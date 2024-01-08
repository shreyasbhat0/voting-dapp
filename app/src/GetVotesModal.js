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

function GetVotesModal({ open, handleClose, onResultsFetched }) {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:5000/votes/", {
        params: {
          topic: `${selectedTopic}`,
        },
      })
      .then((response) => {
        onResultsFetched(response.data);
        console.log(response.data);
      });

    handleClose();
  };

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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Get Vote Result</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit}>View Votes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default GetVotesModal;
