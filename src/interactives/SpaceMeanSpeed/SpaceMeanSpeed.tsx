import React, { FunctionComponent, useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./params";
import { AppContext, reducer, initialState, ActionTypes as AT } from "./ducks";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import { Grid } from "@material-ui/core";
import SpaceTime from "./SpaceTime";
import { withStyles, Theme } from "@material-ui/core/styles";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import Slider from "@material-ui/core/Slider";

const StyleSlider = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.main,
    marginBottom: "5px"
  }
}))(Slider);

const Controls = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt /= params.delta;
    dispatch({ type: AT.TICK, payload: dt });
  }, play);

  return (
    <Paper elevation={2} className={classes.paper}>
      <Button
        component="div"
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
      >
        {play ? "PAUSE" : "PLAY"}
      </Button>
      <div className={classes.sliderLabel} style={{ marginTop: 15 }}>
        density <TeX math="k \; \text{(veh/km)}" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, val: number) =>
          dispatch({ type: AT.SET_VAR, payload: { key: "kCar", val } })
        }
        value={state.kCar}
        step={0.002}
        min={.04}
        max={.09}
      />
      <div className={classes.sliderLabel} style={{ marginTop: 15 }}>
        speed <TeX math="v \; \text{(km/hr)}" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, val: number) =>
          dispatch({ type: AT.SET_VAR, payload: { key: "vCar", val } })
        }
        value={state.vCar}
        step={0.01}
        min={3}
        max={15}
      />
      <div className={classes.sliderLabel}>
        time <TeX math="t \; (s)" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, val: number) =>
          dispatch({ type: AT.SET_VAR, payload: { key: "time", val } })
        }
        value={state.time}
        step={params.cycle / 300}
        min={0}
        max={params.cycle}
      />
    </Paper>
  );
};

const EMPTY = {};
const App: FunctionComponent<{}> = () => {
  const classes = useStyles(EMPTY);
  return (
    <Grid
      direction="column"
      container
      className={classes.main}
      alignItems="stretch"
      spacing={3}
    >
      <Grid item className={classes.spaceTimeContainer}>
        <SpaceTime />
      </Grid>
      <Grid item>
        <Controls />
      </Grid>
    </Grid>
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
    maxWidth: "700px",
    margin: "0 auto"
  },
  sliderLabel: {
    fontSize: "14px",
    marginTop: "5px"
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    padding: "10px 30px"
  },
  button: {
    margin: "5px"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
