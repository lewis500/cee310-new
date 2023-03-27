import React, {
  FunctionComponent,
  useContext,
  useReducer,
} from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./params";
import {
  AppContext,
  reducer,
  initialState,
  ActionTypes as AT
} from "./ducks";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import { Grid } from "@mui/material";
import SpaceTime from "./SpaceTime";
import QK from "./QK";
import { withStyles, Theme } from "@mui/styles";
import {InlineMath as TeX} from 'react-katex';
import "katex/dist/katex.min.css";
import Slider from "@mui/material/Slider";

const StyleSlider = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.main,
    marginBottom: "5px",
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
      <div className={classes.sliderLabel} style={{marginTop: 15}}>
        density <TeX math="k \; \text{(veh/km)}" /> 
      </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) => dispatch({ type: AT.SET_K, payload })}
        value={state.k}
        step={params.kj / 300}
        min={0}
        max={params.kj}
      />
      <div className={classes.sliderLabel}>
        time <TeX math="t \; (s)" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) =>
          dispatch({ type: AT.SET_TIME, payload })
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
      <Grid item className={classes.qkContainer}>
        <QK />
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
