import React from "react";
import { useTheme } from "@mui/material/styles";
import "./AutoScrollingText.css";

function AutoScrollingText() {
  const theme = useTheme();

  const containerStyle = {
    backgroundColor: theme.palette.primary.main, // Use primary color from theme
    color: theme.palette.primary.contrastText, // Ensure text color is readable on primary color
  };

  return (
    <div className="scrolling-container" style={containerStyle}>
      <div className="scrolling-text">
        Welcome to the Voting Platform! Make your voice heard. Every vote
        counts. Participate in our latest polls and see the impact of your vote!
      </div>
    </div>
  );
}

export default AutoScrollingText;
