import React, { useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import CreateTopicModal from "./CreateTopicModal";
import CreateVoteModal from "./CastVoteModal";
import GetVotesModal from "./GetVotesModal";
import VoteResultsModal from "./VoteResultModal";

function HomePage() {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openCastVoteModal, setOpenCastVoteModal] = useState(false);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [voteResults, setVoteResults] = useState(null);
  const [openVoteResultsModal, setOpenVoteResultsModal] = useState(false);

  const handleOpenVoteResultsModal = () => setOpenVoteResultsModal(true);
  const handleCloseVoteResultsModal = () => setOpenVoteResultsModal(false);

  const isAnyModalOpen =
    openCreateModal || openCastVoteModal || openResultModal;

  const handleResultsFetched = (results) => {
    setVoteResults(results);
    handleOpenVoteResultsModal();
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const handleOpenCastVoteModal = () => {
    setOpenCastVoteModal(true);
  };

  const handleCloseCastVoteModal = () => {
    setOpenCastVoteModal(false);
  };

  const handleOpenResultModal = () => {
    setOpenResultModal(true);
  };

  const handleCloseResultModal = () => {
    setOpenResultModal(false);
  };

  return (
    <div style={{ margin: "20px" }}>
      <Grid container spacing={4}>
        {/* Create Topic Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea onClick={handleOpenCreateModal}>
              <CardMedia
                component="img"
                height="140"
                image={require("./img/image1.jpg")}
                alt="Create Vote Topic"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Create Vote Topic
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here to create a new topic.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea onClick={handleOpenCastVoteModal}>
              <CardMedia
                component="img"
                height="140"
                image={require("./img/image2.jpg")}
                alt="Cast Vote"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Cast Vote
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here to Cast Vote.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardActionArea onClick={handleOpenResultModal}>
              <CardMedia
                component="img"
                height="140"
                image={require("./img/image3.jpg")}
                alt="Get Vote Result"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Get Vote Result
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click here to Get Vote Result.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      <CreateTopicModal
        open={openCreateModal}
        handleClose={handleCloseCreateModal}
      />
      <CreateVoteModal
        open={openCastVoteModal}
        handleClose={handleCloseCastVoteModal}
      />

      <GetVotesModal
        open={openResultModal}
        onResultsFetched={handleResultsFetched}
        handleClose={handleCloseResultModal}
      />

      <VoteResultsModal
        open={openVoteResultsModal}
        handleClose={handleCloseVoteResultsModal}
        results={voteResults}
      />
    </div>
  );
}

export default HomePage;
