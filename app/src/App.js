import React from "react";
import { CssBaseline, Box } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AutoScrollingText from "./AutoScrollingText";
import Footer from "./Footer";
import HomePage from "./HomePage";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#556cd6",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: "#ff1744",
      },
      background: {
        default: "#f4f6f8",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Voting System
            </Typography>
          </Toolbar>
          <AutoScrollingText />
        </AppBar>

        <Box component="main" flexGrow={1}>
          <Container maxWidth="md">
            <HomePage />
          </Container>
          <Container maxWidth="md">
            <Box p={3} textAlign="center">
              <Typography variant="h6">
                Interesting Facts About Voting
              </Typography>
              <Typography>
                Did you know that the first recorded evidence of voting was in
                Ancient Greece?
              </Typography>
            </Box>
          </Container>
          <Container maxWidth="md">
            <Box p={3} textAlign="center">
              <Typography>
                Since 1997, American astronauts have been able to cast their
                votes from space. The ballots are sent electronically to Mission
                Control and then passed on to the respective voting authorities
              </Typography>
            </Box>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
