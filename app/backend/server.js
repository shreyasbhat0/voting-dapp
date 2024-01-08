const express = require("express");
const anchor = require("@coral-xyz/anchor");
const { PublicKey, SystemProgram } = anchor.web3;

const cors = require("cors");

// Load the IDL file
const idl = require("../../target/idl/voting_dapp.json");

// Define the program ID
const programId = new PublicKey("EuKDEhzL4VSXHRQqDudWXwaorsR8yZxL3aZ3VS7rKp3w");

// Configure the provider to connect to the Solana cluster
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Initialize the program
const program = new anchor.Program(idl, programId);

const app = express();
app.use(cors());
app.use(express.json());

const votingAccount = anchor.web3.Keypair.generate();

// Endpoint to create a voting topic
app.post("/create-topic", async (req, res) => {
  const { topic, contestants } = req.body;
  try {
    await program.methods
      .createTopic(topic, contestants)
      .accounts({
        voteApp: votingAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    res.json({
      success: true,
      message: "Topic created successfully",
      votingAccount: votingAccount.publicKey.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating topic" });
  }
});

// Endpoint to cast a vote
app.post("/cast-vote", async (req, res) => {
  const { topic, contestant } = req.body;

  try {
    await program.methods
      .castVote(topic, contestant)
      .accounts({
        voteApp: votingAccount.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    res.json({ success: true, message: "Vote cast successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error casting vote" });
  }
});

// Endpoint to get votes based on topic
app.get("/votes/", async (req, res) => {
  try {
    const voteData = await program.views.getVotes(req.query["topic"], {
      accounts: {
        voteApp: votingAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log(voteData);

    res.json({ topic: req.query["topic"], votes: voteData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching votes" });
  }
});

// Endpoint to get topics
app.get("/topics/", async (req, res) => {
  try {
    const topicsData = await program.views.getTopics({
      accounts: {
        voteApp: votingAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log(topicsData);

    res.json({ topics: topicsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching topics" });
  }
});

// Endpoint to get Contestants based on topic
app.get("/contestants/", async (req, res) => {
  console.log(req.query["topic"]);
  try {
    const candidates = await program.views.getAllCandidatesByTopic(
      req.query["topic"],
      {
        accounts: {
          voteApp: votingAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      }
    );
    console.log(candidates);

    res.json({ contestants: candidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching topics" });
  }
});

(async () => {
  try {
    // Init the solana program for usage
    await program.methods
      .init()
      .accounts({
        voteApp: votingAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([votingAccount])
      .rpc();

    console.log("Initialization successful");
  } catch (error) {
    console.error("Error during initialization:", error);
    // Exit if initialization fails
    process.exit(1);
  }

  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
