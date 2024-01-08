import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "axios";

function CastVoteModal({ open, handleClose }) {
  const [topics, setTopics] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/topics")
      .then((response) => {
        setTopics(response.data.topics);
      })
      .catch((error) => {
        console.error("There was an error fetching the topics", error);
      });
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      axios
        .get("http://localhost:5000/contestants/", {
          params: {
            topic: `${selectedTopic}`,
          },
        })
        .then((response) => {
          setCandidates(response.data.contestants);
        })
        .catch((error) => {
          console.error("There was an error fetching the candidates", error);
        });
    }
  }, [selectedTopic]);

  const handleSubmit = () => {
    console.log(selectedTopic, selectedCandidate);
    axios
      .post("http://localhost:5000/cast-vote", {
        topic: selectedTopic,
        contestant: selectedCandidate,
      })
      .then((response) => {
        console.log(response);
        setSelectedTopic("");
        setSelectedCandidate("");
        handleClose();
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Cast Vote</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To Cast Vote based on Topic and Contestants
        </DialogContentText>
        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel id="topic-label">Topic Name</InputLabel>
          <Select
            labelId="topic-label"
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            label="Topic Name"
          >
            {topics.map((topic, index) => (
              <MenuItem key={index} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense" variant="standard">
          <InputLabel id="candidates-label">Candidates</InputLabel>
          <Select
            labelId="candidates-label"
            id="candidates"
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            label="Candidates"
          >
            {candidates.map((candidate, index) => (
              <MenuItem key={index} value={candidate}>
                {candidate}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>CastVote</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CastVoteModal;
