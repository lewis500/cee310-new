// import { makeStyles } from "@material-ui/styles";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";

export default makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Puritan', sans-serif"
    }
  },
  main: {
    maxWidth: "900px",
    color: colors.grey["800"],
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column"
  },
  red: {
    fill: colors.red["A400"]
  },
  paper: {
    maxWidth: "500px",
    margin: "auto",
    display: "flex",
    padding: "20px",
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    margin: "5px"
  },
  // button: {
  //   alignSelf: "center"
  // },
  visContainer: {
    margin: "0 auto"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
