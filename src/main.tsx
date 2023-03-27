// import * as colors from "@material-ui/core/colors";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import primary from "@material-ui/core/colors/blue";
import secondary from "@material-ui/core/colors/pink";

// const container = document.getElementById("root");
// if (!container) throw Error("no root container");

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

const Wrapped = ()=>{
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Wrapped/>);

// render(
//   <ThemeProvider theme={theme}>
//     <App />
//   </ThemeProvider>,
//   container
// );
