import React, {
  FunctionComponent,
  useContext,
  useReducer,
  useCallback
} from "react";
import Button from "@mui/material/Button";
// import Paper from "@mui/material/Paper";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import { useTimer } from "src/hooks/useTimerHook";
import * as params from "./constants";
import {
  AppContext,
  reducer,
  initialState,
  ActionTypes as AT,
  VKType,
  ActionTypes
} from "./ducks";
import VK from "./VK";
import QK from "./QK";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

const Buttons = React.memo(
  ({
    changeVK,
    vk
  }: {
    vk: VKType;
    changeVK: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <RadioGroup
      row={true}
      aria-label="Fundamental Diagram"
      name="fd"
      value={vk}
      onChange={changeVK}
    >
      <FormControlLabel
        value={VKType.TRIANGLE}
        control={<Radio />}
        label="Triangle"
      />
      <FormControlLabel
        value={VKType.GREENSHIELDS}
        control={<Radio />}
        label="Greenshields"
      />
      <FormControlLabel
        value={VKType.DRAKE}
        control={<Radio />}
        label="Drake"
      />
    </RadioGroup>
  )
);

const EMPTY = {},
  WIDTH = 600,
  HEIGHT = WIDTH / params.GR;
const App: FunctionComponent<{}> = () => {
  const { state, dispatch } = useContext(AppContext),
    { play } = state,
    classes = useStyles(EMPTY);

  useTimer((dt: number) => {
    dt /= params.delta;
    dispatch({ type: AT.TICK, payload: Math.min(dt, 0.05) });
  }, play);

  const changeVK = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // if (!VKType.hasOwnProperty(e.currentTarget.value))
    //   throw Error("wrong input event");
    let payload = e.currentTarget.value as VKType;
    dispatch({ type: ActionTypes.SET_VK, payload });
  }, []);

  return (
    <div className={classes.main}>
      <div style={{ display: "flex" }}>
        <div>
          <VK height={HEIGHT} width={WIDTH} />
        </div>
        <div>
          <QK height={HEIGHT} width={WIDTH} />
        </div>
      </div>
      <div className={classes.controls}>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
        >
          {play ? "PAUSE" : "PLAY"}
        </Button>
        <Buttons changeVK={changeVK} vk={state.vk} />
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
  main: {
    // maxWidth: "900px",
    color: colors.grey["800"],
    margin: "0 auto",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column"
  },
  red: {
    fill: colors.red["A400"]
  },
  controls: {
    // maxWidth: "500px",
    margin: "auto",
    display: "flex",
    // padding: "20px",
    marginTop: "10px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  button: {
    margin: "5px",
    marginRight: "45px"
  },
  // button: {
  //   alignSelf: "center"
  // },
  visContainer: {
    margin: "0 auto"
  },
  sliderContainer: {
    width: "300px",
    padding: "20px",
    boxSizing: "border-box"
  }
});
