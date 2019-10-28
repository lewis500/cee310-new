import React, { useContext, useCallback, useMemo } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import { AppContext, ActionTypes } from "./ducks";
import Slider, { SliderProps } from "@material-ui/core/Slider";
import { Typography as Text, colors } from "@material-ui/core";
import TeX from "@matejmazur/react-katex";
import * as params from "./constants";
import "katex/dist/katex.min.css";
import * as ducks from "./ducks";

const StyleSlider = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.primary.main,
    marginBottom: "15px"
  }
}))(Slider);

export default () => {
  const { state, dispatch } = useContext(AppContext);
  const cbs = useMemo(
    () =>
      ({
        setΔ: (e, payload) => dispatch({ type: ActionTypes.SET_Δ, payload }),
        setR: (e, payload) => dispatch({ type: ActionTypes.SET_R, payload }),
        setX: (e, payload) => dispatch({ type: ActionTypes.SET_X, payload }),
        setMs: (e, payload) => dispatch({ type: ActionTypes.SET_MS, payload })
      } as { [key: string]: (e: React.ChangeEvent<{}>, v: number) => void }),
    []
  );
  return (
    <>
      <Text variant="body1">
        <TeX math="M_s" /> object distance (m)
      </Text>
      <StyleSlider
        onChange={cbs.setMs}
        value={state.Ms}
        step={0.1}
        min={2}
        max={
          ducks.getRoadPointsRaw(state).r -
          ducks.getRoadPointsRaw(state).c[1] + ducks.getRoadPointsRaw(state).center[1] - 2
        }
      />
      <Text variant="body1">
        <TeX math="R" /> radius (m)
      </Text>
      <StyleSlider
        onChange={cbs.setR}
        value={state.R}
        step={1}
        min={70}
        max={90}
      />
      {/* <Text variant="body1">
        <TeX math="x" /> position
      </Text>
      <StyleSlider
        onChange={cbs.setX}
        value={state.x}
        step={0.25}
        min={0}
        max={params.W * 1.4}
      /> */}
    </>
  );
};
