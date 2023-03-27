import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material";
import primary from "@mui/material/colors/blue";
import secondary from "@mui/material/colors/pink";

const theme = createTheme({
  palette: {
    primary: {
      main: primary["500"],
    },
    secondary: {
      main: secondary["500"],
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
