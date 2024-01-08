import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingDapp } from "../target/types/voting_dapp";
import { assert } from "chai";

describe("voting-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program = anchor.workspace.VotingDapp as Program<VotingDapp>;
  let appKey = anchor.web3.Keypair.generate();

  it("Is Initialized!", async () => {

    console.log("Starting Program Init")
    await program.methods.init().accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([appKey]).rpc();

    let votesApp = await program.account.voting.fetch(appKey.publicKey);
    
    assert.isEmpty(votesApp.votes)


    console.log("Program Initialized");
  })

  it("Creating Topic", async () => {
    
    await program.methods.createTopic('New Election', ['Alice', "Bob", "Charlie"]).accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc()

    let votesApp = await program.account.voting.fetch(appKey.publicKey);

    assert.isNotEmpty(votesApp.votes)


  })

  it("Casting Votes", async () => {
    await program.methods.castVote("New Election", "Alice").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()
   
    let result = await program.views.getVotes('New Election', {
      accounts: {
        voteApp: appKey.publicKey,
        user: appKey.publicKey
      },
    })
    assert.equal(result[0].candidate, 'Alice')
    assert.equal(result[0].count, 1)
  })

  it("Creating One More Topic", async () => {
    
    await program.methods.createTopic('Best Crypto', ['BTC', "ETH", "XRP"]).accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc()

    let votesApp = await program.account.voting.fetch(appKey.publicKey);

    assert.lengthOf(votesApp.votes,2)

  })

  it("Casting Votes to New Topic Created", async () => {
    await program.methods.castVote("Best Crypto", "BTC").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()

    await program.methods.castVote("Best Crypto", "BTC").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()
    
    await program.methods.castVote("Best Crypto", "BTC").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()

    await program.methods.castVote("Best Crypto", "ETH").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()

     await program.methods.castVote("Best Crypto", "ETH").accounts({
      voteApp: appKey.publicKey,
      user: provider.wallet.publicKey,
    }).rpc()


    let result = await program.views.getVotes("Best Crypto", {
      accounts: {
        voteApp: appKey.publicKey,
        user: appKey.publicKey
      },
    })
    assert.equal(result[0].candidate, 'BTC')
    assert.equal(result[0].count, 3)
  })

  it("Get Vote Topics", async () => {
    let result = await program.views.getTopics( {
      accounts: {
        voteApp: appKey.publicKey,
        user: appKey.publicKey
      },
    })

    assert.equal(result[0], 'New Election')
    assert.equal(result[1], 'Best Crypto')
  })

  it("Get Candidates based on  Topic", async () => {
    let result = await program.views.getAllCandidatesByTopic('Best Crypto', {
      accounts: {
        voteApp: appKey.publicKey,
        user: appKey.publicKey
      },
    })
    assert.equal(result[0],'BTC')
    assert.equal(result[1], 'ETH')
    assert.equal(result[2],'XRP')
  })

}
);
