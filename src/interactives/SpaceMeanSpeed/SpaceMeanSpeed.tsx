import React, {
  useReducer
} from "react";
import { AppContext, reducer, initialState } from "./ducks";
import makeStyles from "@material-ui/styles/makeStyles";
import SpaceTime from "./SpaceTime";
import Controls from './Controls';

const EMPTY = {};
const App = () => {
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
});
