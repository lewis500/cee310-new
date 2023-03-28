import React, { useContext, useReducer } from "react";
import Button from "@mui/material/Button";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./constants";
import { AppContext, reducer, initialState } from "./ducks";
import TimeSpace from "./TimeSpace";
import * as colors from "@mui/material/colors";
// import Cumulative from "./Cumulative";
import Slider from "@mui/material/Slider";
import { InlineMath as TeX } from "react-katex";
import { makeStyles, withStyles } from "@mui/styles";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import QK from "./QK";

const StyleSlider = withStyles(() => ({
  root: {
    color: colors.pink["A400"],
    marginBottom: "5px",
  },
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
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div className={classes.main}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={handleChange} />}
        label="show video"
      />
      <Collapse in={checked}>
        <Paper elevation={2}>
          <div style={{ width: 640, height: 497 }}>
            <iframe
              width="640"
              height="497"
              src="https://www.loom.com/embed/cc20ab7d23dd48109c4d2d50c5f57ace"
              frameBorder="0"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
            ></iframe>
          </div>
        </Paper>
      </Collapse>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TimeSpace width={700} height={350} />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
              <input
                style={{ width: "100%" }}
                type="range"
                id="cowbell"
                name="cowbell"
                onChange={function (e) {
                  dispatch({ type: "SET_TIME", payload: +e.target.value });
                }}
                min="0"
                max={params.duration}
                value={state.time}
                step={params.duration / 400}
              />
              {/* <Slider
                // component="div"
                onChange={(e, payload: number) => {
                  dispatch({ type: "SET_TIME", payload:+payload });
                }}
                defaultValue={0}
                value={state.time}
                step={1 / 400}
                min={0}
                max={params.duration}
              /> */}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <QK width={400} height={250} />
          </div>
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

const useStyles = makeStyles({
  sliderLabel: {
    fontSize: "14px",
    marginTop: "5px",
  },
  main: {
    color: colors.grey["800"],
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-15px",
  },
  paper: {
    maxWidth: "500px",
    display: "flex",
    padding: "20px",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    margin: "5px",
    width: "100px",
  },
  visContainer: {
    margin: "0 auto",
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box",
  },
});
