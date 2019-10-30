import React, { Dispatch } from "react";
import memoizeone from "memoize-one";
import { params, widths } from "./constants";

export const initialState = {
  play: true,
  v0: params.v0,
  x0: widths.start * 0.75,
  stopper: {
    x: widths.start,
    v: params.v0
  },
  mover: {
    x: widths.start,
    v: params.v0
  },
  time: 0,
  useState: 2,
  yellow: 2.5
};
type State = typeof initialState;
type ActionTypes =
  | {
      type: "TICK";
      payload: { dt: number; xssd: number };
    }
  | { type: "SET_X0"; payload: number }
  | { type: "SET_V0"; payload: number }
  | { type: "SET_YELLOW"; payload: number }
  | { type: "RESTART" }
  | { type: "RESET" }
  | { type: "DRAG"; payload: { x0: number; v0: number } }
  | { type: "SET_PLAY"; payload: boolean };

// for (let [type, prop] of [
//   ["SET_X0", "x0"],
//   ["SET_V0", "v0"],
//   ["SET_YELLOW", "yellow"],
//   ["SET_PLAY", "play"]
// ])
//   if (action.type === type) return { ...state, [prop]: action.payload };

const stopperReducer = (
  { x, v }: { v: number; x: number },
  {
    payload: { xssd, dt }
  }: { type: "TICK"; payload: { dt: number; xssd: number } },
  v0: number,
  x0: number
) => {
  if (x < Math.min(xssd, x0) - v0 * params.tp)
    return {
      v: Math.max(v - params.a * dt, 0),
      x: Math.min(x - v * dt + 0.5 * params.a * dt * dt, x)
    };
  return {
    v,
    x: x - v * dt
  };
};

export const reducer = (state: State, action: ActionTypes): State => {
  switch (action.type) {
    case "TICK":
      const { dt } = action.payload;
      let { mover, stopper, v0, x0 } = state;
      return {
        ...state,
        time: state.time + dt,
        mover: {
          v: mover.v,
          x: mover.x - mover.v * dt
        },
        stopper: stopperReducer(stopper, action, v0, x0)
      };
    case "SET_X0":
      return {
        ...state,
        x0: action.payload
      };
    case "SET_PLAY":
      return {
        ...state,
        play: action.payload
      };
    case "SET_YELLOW":
      return {
        ...state,
        yellow: action.payload
      };
    case "SET_V0":
      return {
        ...state,
        v0: action.payload
      };
    case "RESTART":
      return {
        ...state,
        mover: {
          v: state.v0,
          x: widths.start
        },
        time: 0,
        stopper: {
          v: state.v0,
          x: widths.start
        }
      };
    case "DRAG":
      return {
        ...state,
        v0: action.payload.v0,
        x0: action.payload.x0
      };
    case "RESET":
      return {
        ...state,
        play: false,
        time: 0,
        mover: {
          v: state.v0,
          x: widths.start
        },
        stopper: {
          v: state.v0,
          x: widths.start
        }
      };
    default:
      return state;
  }
};

export const AppContext = React.createContext<{
  state: State;
  dispatch?: Dispatch<ActionTypes>;
}>({ state: initialState, dispatch: null });

export const getxssd = memoizeone(
  (v0: number) => v0 * params.tp + (v0 * v0) / 2 / params.a
);
export const getxcl = memoizeone(
  (v0: number, yellow: number) => -widths.car.width + v0 * yellow
);
