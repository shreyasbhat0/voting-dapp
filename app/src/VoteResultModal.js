import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  DialogActions,
} from "@mui/material";

function VoteResultsModal({ open, handleClose, results }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Vote Results for: {results?.topic}</DialogTitle>
      <DialogContent dividers>
        <List>
          {results?.votes.map((vote, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={vote.candidate}
                  secondary={`Votes: ${vote.count}`}
                />
              </ListItem>
              {index < results.votes.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default VoteResultsModal;
