// import * as colors from "@material-ui/core/colors";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import primary from "@material-ui/core/colors/blue";
import secondary from "@material-ui/core/colors/pink";

const container = document.getElementById("root");
if (!container) throw Error("no root container");

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary['500']
    },
    secondary:{
      main: secondary['500']
    }
  }
});

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  container
);
