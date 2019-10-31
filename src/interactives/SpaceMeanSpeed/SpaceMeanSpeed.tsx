import React, {
  FunctionComponent,
  useContext,
  Dispatch,
  useReducer
} from "react";
import Button from "@material-ui/core/Button";
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
import { number } from "prop-types";

const MySlider = (() => {
  const StyleSlider = withStyles((theme: Theme) => ({
    root: {
      color: theme.palette.primary.main
    }
  }))(Slider);

  const sliderLabel = {
      fontSize: "14px"
    },
    sliderContainer = {
      padding: "5px",
      width: "100%"
    };
  type Props = {
    keyVar: "kCar" | "vCar" | "time" | "kTruck" | "vTruck";
    step: number;
    min: number;
    max: number;
    latexstring: string;
    label: string;
    value: number;
  };

  return ({ keyVar, step, min, max, latexstring, label, value }: Props) => {
    const { dispatch } = useContext(AppContext);
    return (
      <div style={sliderContainer}>
        <div style={sliderLabel}>
          {label} <TeX math={latexstring} />
        </div>
        <StyleSlider
          component="div"
          onChange={(e, val: number) =>
            dispatch({ type: AT.SET_VAR, payload: { key: keyVar, val } })
          }
          value={value}
          step={step}
          min={min}
          max={max}
        />
      </div>
    );
  };
})();

const Controls = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt /= params.delta;
    dispatch({ type: AT.TICK, payload: dt });
  }, play);

  return (
    <div className={classes.controlsContainer}>
      <div>
        <Button
          component="div"
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
        >
          {play ? "PAUSE" : "PLAY"}
        </Button>
      </div>
      {/* <MySlider step/> */}
      <MySlider
        step={0.01}
        min={4}
        max={15}
        keyVar={"vCar"}
        latexstring=" v_{\text{car}} \; (km/hr)"
        label="speed"
        value={state.vCar}
      />
      <MySlider
        step={0.002}
        min={0.02}
        max={0.12}
        keyVar={"kCar"}
        latexstring="k_{\text{car}} \; (veh/km)"
        label="density car"
        value={state.kCar}
      />
      <MySlider
        step={0.01}
        min={0}
        max={params.cycle}
        keyVar={"time"}
        latexstring="t"
        label="time"
        value={state.time}
      />
      <MySlider
        step={0.002}
        min={0.02}
        max={0.12}
        keyVar={"kTruck"}
        latexstring="k_{\text{truck}} \; (veh/km)"
        label="density truck"
        value={state.kTruck}
      />
      <MySlider
        step={0.002}
        min={0.02}
        max={0.12}
        keyVar={"vTruck"}
        latexstring="v_{\text{truck}} \; (veh/km)"
        label="speed truck"
        value={state.vTruck}
      />
    </div>
  );
};

const EMPTY = {};
const App: FunctionComponent<{}> = () => {
  const classes = useStyles(EMPTY);
  return (
    <div className={classes.main}>
      <div>
        <SpaceTime />
      </div>
      <Controls />
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
  controlsContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "5px 15px",
    width: "300px",
    boxSizing: "border-box"
  },
  button: {
    margin: "5px auto"
  }
});
