import React, { FunctionComponent, useContext, useReducer } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./params";
import { AppContext, reducer, initialState, ActionTypes as AT } from "./ducks";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import { withStyles, Theme } from "@material-ui/core/styles";
import Ring from "./Ring";
import QK from "./QK";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import Slider from "@material-ui/core/Slider";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const StyleSlider = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.secondary.main,
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
    // <div className={classes.paper}>
    <>
      <Button
        component="div"
        className={classes.button}
        variant="contained"
        color="secondary"
        onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
      >
        {play ? "PAUSE" : "PLAY"}
      </Button>
      <div style={{ width: "100%" }}>
        <div className={classes.sliderLabel} style={{ marginTop: 15 }}>
          density <TeX math="k \; \text{(veh/km)}" />
        </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) => dispatch({ type: AT.SET_K, payload })}
        value={state.k}
        step={1 / 100}
        min={.05}
        max={0.4}
      />
      <div className={classes.sliderLabel}>
        speed <TeX math="v_f \; \text{(m/s)}" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) =>
          dispatch({ type: AT.SET_VF, payload })
        }
        value={state.vf}
        step={0.01}
        min={.05}
        max={7}
      />
      <div className={classes.sliderLabel}>
        critical density <TeX math="k_{0} \; \text{(veh/km)}" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) =>
          dispatch({ type: AT.SET_K0, payload })
        }
        value={state.k0}
        step={0.01}
        min={0.05}
        max={0.4}
      />
      <div className={classes.sliderLabel}>
        jam density <TeX math="k_{j} \; \text{(veh/km)}" />
      </div>
      <StyleSlider
        component="div"
        onChange={(e, payload: number) =>
          dispatch({ type: AT.SET_KJ, payload })
        }
        value={state.kj}
        step={0.01}
        min={0.01}
        max={0.4}
      />
      </div>
    </>
  );
};

const EMPTY = {};
const App: FunctionComponent<{}> = () => {
  const classes = useStyles(EMPTY),
    [checked, setChecked] = React.useState(false),
    handleChange = () => {
      setChecked(prev => !prev);
    };
  return (
    <div className={classes.container}>
      <div className={classes.main}>
        <div className={classes.ringContainer}>
          <Ring />
        </div>
        <div className={classes.qkContainer}>
          <div style={{ height: "270px", width: "100%" }}>
            <QK />
          </div>
          <Controls />
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
  qkContainer: {
    // height: "250px",
    width: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  row: {
    display: "flex",
    flexDirection: "row"
  },
  ringContainer: {
    width: "500px"
  },
  main: {
    margin: "0 auto",
    display: "flex"
  },
  sliderLabel: {
    fontSize: "14px",
    marginTop: "5px"
  },
  paper: {
    display: "flex",
    // justifyContent: "center",
    flexDirection: "column",
    padding: "10px 30px"
  },
  button: {
    margin: "5px"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  videoContainer: { width: 640, height: 360 }
});
