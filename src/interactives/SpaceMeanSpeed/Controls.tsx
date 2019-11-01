import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./params";
import withStyles from "@material-ui/styles/withStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import TeX from "@matejmazur/react-katex";
import { AppContext, ActionTypes as AT } from "./ducks";
import Slider from "@material-ui/core/Slider";
const StyleSlider = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.secondary.main
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

const MySlider = ({
  keyVar,
  step,
  min,
  max,
  latexstring,
  label,
  value
}: Props) => {
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

const styles = {
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
};

export default () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state;

  useTimer((dt: number) => {
    dt /= params.delta;
    dispatch({ type: AT.TICK, payload: dt });
  }, play);

  return (
    <div style={styles.controlsContainer}>
      <div>
        <Button
          component="div"
          style={styles.button}
          variant="contained"
          color="secondary"
          onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
        >
          {play ? "PAUSE" : "PLAY"}
        </Button>
      </div>
      <MySlider
        step={0.01}
        min={4}
        max={15}
        keyVar={"vCar"}
        latexstring=" v_{\text{car}}"
        label="speed car"
        value={state.vCar}
      />
      <MySlider
        step={0.001}
        min={0.02}
        max={0.12}
        keyVar={"kCar"}
        latexstring="k_{\text{car}}"
        label="density car"
        value={state.kCar}
      />
      <MySlider
        step={0.01}
        min={4}
        max={15}
        keyVar={"vTruck"}
        latexstring="v_{\text{truck}} "
        label="speed truck"
        value={state.vTruck}
      />
      <MySlider
        step={0.001}
        min={0.02}
        max={0.12}
        keyVar={"kTruck"}
        latexstring="k_{\text{truck}}"
        label="density truck"
        value={state.kTruck}
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
    </div>
  );
};
