import React, { useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./constants";
import { AppContext, reducer, initialState } from "./ducks";
import TimeSpace from "./TimeSpace";
import * as colors from "@material-ui/core/colors";
import Cumulative from "./Cumulative";
import Slider from "@material-ui/core/Slider";
import TeX from "@matejmazur/react-katex";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const StyleSlider = withStyles(() => ({
  root: {
    color: colors.pink["A400"],
    marginBottom: "5px"
  }
}))(Slider);

const EMPTY = {};
const App = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt *= params.speed;
    dispatch({ type: "TICK", payload: dt });
  }, play);

  if (state.time > params.duration) dispatch({ type: "RESET" });

  return (
    <div className={classes.main}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <TimeSpace width={700} height={350} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => dispatch({ type: "SET_PLAY", payload: !play })}
          >
            {play ? "PAUSE" : "PLAY"}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch({ type: "RESET" });
            }}
          >
            Reset
          </Button>
          <div style={{ flex: "1 1 auto", padding: "0 20px" }}>
            <div className={classes.sliderLabel} style={{ marginTop: 15 }}>
              time <TeX math="t" />
            </div>
            <StyleSlider
              component="div"
              onChange={(e, payload: number) =>
                dispatch({ type: "SET_TIME", payload })
              }
              value={state.time}
              step={(1 / 200) * params.duration}
              min={0}
              max={params.duration}
            />
          </div>
        </div>
      </div>
      <div>
        <Cumulative width={400} height={350} />
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
  sliderLabel: {
    fontSize: "14px",
    marginTop: "5px"
  },
  main: {
    color: colors.grey["800"],
    margin: "auto",
    display: "flex",
    justifyContent: "center"
  },
  paper: {
    maxWidth: "500px",
    display: "flex",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center"
  },
  button: {
    margin: "5px",
    width: "100px"
  },
  visContainer: {
    margin: "0 auto"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
