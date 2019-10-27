import React, {
  FunctionComponent,
  useContext,
  useReducer,
  useCallback
} from "react";
import Button from "@material-ui/core/Button";
import { colors } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {useTimer, useInterval } from "src/hooks/useTimerHook";
import Vis from "./Vis";
import * as params from "./constants";
import { makeStyles } from "@material-ui/styles";
import {
  AppContext,
  reducer,
  initialState,
  ActionTypes,
  getTotal
} from "./ducks";
import Sliders from "./Sliders";
import { create } from "jss";
import { StylesProvider, jssPreset } from "@material-ui/styles";
import extender from "jss-plugin-extend";
const jss = create({
  plugins: [...jssPreset().plugins, extender()]
});

const useStyles = makeStyles({
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
    alignItems: "center"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  red: {
    fill: colors.red["A400"]
  },
  paper: {
    maxWidth: "500px",
    width: 300,
    // margin: "auto",
    display: "flex",
    padding: "24px 36px",
    flexDirection: "column"
  },
  button: {
    margin: "10px"
    // alignSelf: "center",
    // "&:not(:last-child)": {
    //   marginBottom: 10
    // }
  },
  visContainer: {
    margin: "10px auto",
    width: params.px.width,
    height: params.px.height
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});

const EMPTY = {};
const App: FunctionComponent<{}> = () => {
  const { state, dispatch } = useContext(AppContext),
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt /= params.delta;
    if (state.x < getTotal(state) && state.v > 0)
      dispatch({ type: ActionTypes.TICK, payload: dt });
    else dispatch({ type: ActionTypes.RESTART });
  }, state.play);

  useInterval(
    () => {
      console.log("hello");
    },
    10 / params.delta,
    state.play
  );

  return (
    <div className={classes.main}>
      <div className={classes.visContainer}>
        <Vis />
      </div>
      <Paper className={classes.paper} elevation={2}>
        <Sliders />
        <div className={classes.buttons}>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() =>
              dispatch({ type: ActionTypes.SET_PLAY, payload: !state.play })
            }
          >
            {state.play ? "PAUSE" : "PLAY"}
          </Button>
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => {
              dispatch({ type: ActionTypes.RESET });
            }}
          >
            Reset
          </Button>
        </div>
      </Paper>
    </div>
  );
};

const AppWithReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <App />
    </AppContext.Provider>
  );
};

export default () => (
  <StylesProvider jss={jss}>
    <AppWithReducer />
  </StylesProvider>
);
