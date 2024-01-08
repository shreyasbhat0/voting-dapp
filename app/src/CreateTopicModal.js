import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

function CreateTopicModal({ open, handleClose }) {
  const [topic, setTopic] = useState("");
  const [candidates, setCandidates] = useState("");

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/create-topic", {
        topic: topic,
        contestants: candidates.split(","),
      })
      .then((response) => {
        console.log(response);
        setTopic("");
        setCandidates("");
        handleClose();
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a New Topic</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To create a new voting topic, please enter the topic name and
          contestants here.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Topic Name"
          type="text"
          fullWidth
          variant="standard"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <TextField
          autoFocus
          margin="dense"
          id="candidates"
          label="contestants [comma, separated ,values]"
          type="text"
          fullWidth
          variant="standard"
          value={candidates}
          onChange={(e) => setCandidates(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTopicModal;
