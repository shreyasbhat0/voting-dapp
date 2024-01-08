use anchor_lang::prelude::*;

//Program Id
declare_id!("EuKDEhzL4VSXHRQqDudWXwaorsR8yZxL3aZ3VS7rKp3w");

// Program module which will be used in execution based on the instructions
#[program]
pub mod voting_dapp {
    use super::*;

    /// The `init` function initializes the `votes` field of the `vote_app` account to an empty vector.
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type `Context<Init>`.
    ///
    /// Returns:
    ///
    /// a `Result` type.
    pub fn init(ctx: Context<Init>) -> Result<()> {
        let vote_app = &mut ctx.accounts.vote_app;

        vote_app.votes = vec![];

        Ok(())
    }

    /// The `create_topic` function creates and stores topic along with the candidates in vote account
    ///  
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type `Context<CreateTopic>`.
    /// * `topic` : The `topic` parameter is of type `String` which used to represent vote topics
    /// * `candidates` : The `candidates` parameter is of types `Vec<String>` which used to represent vote candidates
    /// Returns:
    ///
    /// a `Result()` type.

    pub fn create_topic(
        ctx: Context<CreateTopic>,
        topic: String,
        candidates: Vec<String>,
    ) -> Result<()> {
        let vote_app = &mut ctx.accounts.vote_app;

        vote_app.create_topic(topic, candidates);

        Ok(())
    }

    /// The `cast_vote` function takes topic and vote candidate and increase vote count
    ///  
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type ` Context<CastVote>`.
    /// * `topic` : The `topic` parameter is of type `String` which used to represent vote topics
    /// * `candidate` : The `candidates` parameter is of types `String` which used to represent vote candidate
    /// Returns:
    ///
    /// a `Result()` type.
    ///
    pub fn cast_vote(ctx: Context<CastVote>, topic: String, candidate: String) -> Result<()> {
        let vote_app = &mut ctx.accounts.vote_app;

        vote_app.cast_vote(&topic, &candidate);

        Ok(())
    }

    /// The `get_votes` function takes topic returns votes for each candidates
    ///  
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type ` Context<CastVote>`.
    /// * `topic` : The `topic` parameter is of type `String` which used to represent vote topics
    /// Returns:
    ///
    /// a `Result of Vec<Candidate>` type.
    ///
    pub fn get_votes(ctx: Context<GetVotes>, topic: String) -> Result<Vec<CandidateVote>> {
        let vote_app = &ctx.accounts.vote_app;
        let votes = vote_app.get_votes(&topic);
        msg!("Vote List: {:?}", votes);
        match vote_app.get_votes(&topic) {
            Some(result) => return Ok(result),
            None => return Ok(vec![]),
        }
    }

    /// The `get_topics` function returns all voting topics
    ///  
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type ` Context<CastVote>`.
    ///
    /// Returns:
    ///
    /// a `Result of Vec<String>` type.
    ///
    pub fn get_topics(ctx: Context<GetVotes>) -> Result<Vec<String>> {
        let vote_app = &ctx.accounts.vote_app;

        Ok(vote_app.get_all_topics())
    }

    /// The `get_all_candidates_by_topic` function returns all voting candidates based on voting topic
    ///  
    ///
    /// Arguments:
    ///
    /// * `ctx`: The `ctx` parameter is of type ` Context<CastVote>`.
    /// * `topic` : The `topic` parameter is of type `String` which used to represent vote topics
    ///
    /// Returns:
    ///
    /// a `Result of Vec<String>` type.
    ///
    pub fn get_all_candidates_by_topic(
        ctx: Context<GetVotes>,
        topic: String,
    ) -> Result<Vec<String>> {
        let vote_app = &ctx.accounts.vote_app;

        match vote_app.get_candidates_by_topic(&topic) {
            Some(result) => Ok(result),
            None => Ok(vec![]),
        }
    }
}

#[derive(Accounts)]
pub struct Init<'info> {
    #[account(
        init,
        payer = user,
        space = 4000
    )]
    pub vote_app: Account<'info, Voting>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub vote_app: Account<'info, Voting>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateTopic<'info> {
    #[account(mut)]
    pub vote_app: Account<'info, Voting>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetVotes<'info> {
    #[account()]
    pub vote_app: Account<'info, Voting>,
    #[account()]
    pub user: Signer<'info>,
}
// Solana Account to Store the Vote Topics , Candidates and Respective Vote counts
#[account]
pub struct Voting {
    pub votes: Vec<TopicVote>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TopicVote {
    pub topic: String,
    pub candidate_votes: Vec<CandidateVote>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct CandidateVote {
    pub candidate: String,
    pub count: u64,
}

impl Voting {
    pub fn new() -> Self {
        Self { votes: Vec::new() }
    }

    pub fn create_topic(&mut self, topic: String, candidates: Vec<String>) {
        let candidate_votes = candidates
            .into_iter()
            .map(|candidate| CandidateVote {
                candidate,
                count: 0,
            })
            .collect();

        self.votes.push(TopicVote {
            topic,
            candidate_votes,
        });
    }

    pub fn cast_vote(&mut self, topic: &str, candidate: &str) {
        if let Some(topic_vote) = self.votes.iter_mut().find(|tv| tv.topic == topic) {
            if let Some(candidate_vote) = topic_vote
                .candidate_votes
                .iter_mut()
                .find(|cv| cv.candidate == candidate)
            {
                candidate_vote.count += 1;
            }
        }
    }

    pub fn get_votes(&self, topic: &str) -> Option<Vec<CandidateVote>> {
        self.votes
            .iter()
            .find(|tv| tv.topic == topic)
            .map(|tv| tv.candidate_votes.clone())
    }
    pub fn get_all_topics(&self) -> Vec<String> {
        self.votes.iter().map(|tv| tv.topic.clone()).collect()
    }
    pub fn get_candidates_by_topic(&self, topic: &str) -> Option<Vec<String>> {
        self.votes.iter().find(|tv| tv.topic == topic).map(|tv| {
            tv.candidate_votes
                .iter()
                .map(|cv| cv.candidate.clone())
                .collect()
        })
    }
}
