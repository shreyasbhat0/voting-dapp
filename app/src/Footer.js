import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "primary.main", color: "white", py: 3 }}
    >
      <Container maxWidth="md">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Voting System
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
