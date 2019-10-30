import React, { FunctionComponent, useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import Text from "@material-ui/core/Typography";
import * as colors from "@material-ui/core/colors";
import { withStyles, Theme } from "@material-ui/core/styles";
import { useTimer } from "src/hooks/useTimerHook";
import Vis from "./Vis";
import Plot from "./Plot";
import { params, widths } from "./constants";
import { makeStyles } from "@material-ui/styles";
import { AppContext, getxssd, getxcl, reducer, initialState } from "./ducks";
import TeX from "@matejmazur/react-katex";

import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  main: {
    color: colors.grey["800"],
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  column: {
    flexDirection: "column",
    display: "flex",
    alignItems: "center"
  },
  red: {
    fill: colors.red["A400"]
  },
  button: {},
  visContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingRight: "30px"
  }
});

const Sliders = (() => {
  const StyleSlider = withStyles((theme: Theme) => ({
    root: {
      color: theme.palette.secondary.main,
      marginBottom: "15px"
    }
  }))(Slider);
  const x0Text = (
    <Text variant="body1">
      <TeX math="x_0" /> (position when light turns green → yellow)
    </Text>
  );
  const v0Text = (
    <Text variant="body1">
      <TeX math="v_0" /> (speed when light changes green → yellow)
    </Text>
  );
  const yellowText = (
    <Text variant="body1">
      <TeX math="t_y" /> (yellow light duration)
    </Text>
  );

  return () => {
    const { state, dispatch } = useContext(AppContext);
    const { x0, v0, yellow } = state;
    return (
      <>
        {x0Text}
        <StyleSlider
          onChange={(e, payload: number) =>
            dispatch({ type: "SET_X0", payload })
          }
          value={x0}
          step={0.02}
          min={0}
          max={widths.start}
        />
        {v0Text}
        <StyleSlider
          onChange={(e, payload: number) =>
            dispatch({ type: "SET_V0", payload })
          }
          value={v0}
          step={0.1}
          min={0}
          max={params.v0Max}
        />
        {yellowText}
        <StyleSlider
          onChange={(e, payload: number) =>
            dispatch({ type: "SET_YELLOW", payload })
          }
          value={yellow}
          step={0.02}
          min={0}
          max={params.yellowMax}
        />
      </>
    );
  };
})();

const EMPTY = {};
const App: FunctionComponent<{}> = () => {
  const { state, dispatch } = useContext(AppContext);
  const { x0, v0, stopper, mover, time, play, yellow } = state;

  const classes = useStyles(EMPTY);
  const xssd = getxssd(v0);
  const xcl = getxcl(v0, yellow);

  useTimer((dt: number) => {
    dt /= params.delta;
    if (mover.x > widths.start - widths.total || stopper.v > 0) {
      dispatch({ type: "TICK", payload: { dt, xssd } });
    } else {
      setTimeout(() => {
        dispatch({ type: "RESTART" });
      }, 0);
    }
  }, play);

  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked(prev => !prev);
  };

  return (
    <div className={classes.column}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="show video"
      />
      <Collapse in={checked}>
        <Paper elevation={2}>
          <div style={{ width: 640, height: 422 }}>
            <iframe
              width="640"
              height="422"
              src="https://www.loom.com/embed/6e95e2f9122f4579b5ee5538f5d2202a"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
            />
          </div>
        </Paper>
      </Collapse>
      <div className={classes.main}>
        <div className={classes.visContainer}>
          <div style={{ marginBottom: "30px" }}>
            {Vis({
              mover,
              stopper,
              xcl,
              x0,
              lightColor:
                time < (widths.start - x0) / v0
                  ? "green"
                  : time - (widths.start - x0) / v0 < yellow
                  ? "yellow"
                  : "red",
              xssd
            })}
          </div>
          <Plot />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Sliders />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around"
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
              component="div"
              onClick={() => {
                dispatch({ type: "RESET" });
              }}
            >
              Reset
            </Button>
          </div>
          <div></div>
        </div>
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
