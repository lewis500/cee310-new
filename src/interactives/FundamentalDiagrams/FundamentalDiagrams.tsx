import React, {
  FunctionComponent,
  useContext,
  useReducer,
  useCallback,
  FormEvent
} from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
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
import useStyles from "./styleApp";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";

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
      <Paper className={classes.paper} elevation={2}>
        {/* <Sliders /> */}
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={() => dispatch({ type: AT.SET_PLAY, payload: !play })}
        >
          {play ? "PAUSE" : "PLAY"}
        </Button>
        <Buttons changeVK={changeVK} vk={state.vk} />
      </Paper>
      <VK height={HEIGHT} width={WIDTH} />
      <QK />
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
