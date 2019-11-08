import React, { useReducer } from "react";
import { AppContext, reducer, initialState } from "./ducks";
import makeStyles from "@material-ui/styles/makeStyles";
import SpaceTime from "./SpaceTime";
import Controls from "./Controls";
import Paper from "@material-ui/core/Paper";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
const EMPTY = {};
const App = () => {
  const classes = useStyles(EMPTY);
  // const classes = useStyles(EMPTY);

  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(prev => !prev);
  };
  return (
    <div className={classes.container}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="show video"
      />
      <Collapse in={checked}>
        <Paper elevation={2}>
          <div className={classes.videoContainer}>
            <iframe
              width="640"
              height="360"
              src="https://www.loom.com/embed/1fa88513238d4b6aa0b211b7f1973e03"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            />
          </div>
        </Paper>
      </Collapse>
      <div className={classes.main}>
        <div>
          <SpaceTime />
        </div>
        <Controls />
      </div>
    </div>
  );
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <App />
    </AppContext.Provider>
  );
};

const useStyles = makeStyles({
  qkContainer: {
    height: "250px"
  },
  spaceTimeContainer: {
    height: "450px"
  },
  main: {
    display: "flex",
    margin: "0 auto"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  videoContainer:{ width: 640, height: 360 }
});
