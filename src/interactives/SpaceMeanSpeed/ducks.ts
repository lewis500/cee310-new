import React, { Dispatch } from "react";
import * as params from "./params";
import mo from "memoize-one";
import range from "lodash.range";
import get from "lodash/fp/get";
import { createSelector } from "reselect";
const { total } = params,
  min = Math.min,
  max = Math.max;

export type State = {
  readonly play: boolean;
  readonly time: number;
  readonly kCar: number;
  readonly vCar: number;
  readonly kTruck: number;
  readonly vTruck: number;
};

export const initialState = {
  play: true,
  time: 0,
  kCar: 0.15,
  vCar: 15,
  kTruck: 0.1,
  vTruck: 10
};

export enum ActionTypes {
  TICK = "TICK",
  SET_VAR = "SET_VAR",
  SET_PLAY = "SET_PLAY"
}

type Action =
  | {
      type: ActionTypes.TICK;
      payload: number;
    }
  | {
      type: ActionTypes.SET_VAR;
      payload: {
        val: number;
        key: "kCar" | "vCar" | "time" | "kTruck" | "vTruck";
      };
    }
  | {
      type: ActionTypes.SET_PLAY;
      payload: boolean;
    };

export type Line = { x0: number; t0: number; x1: number; t1: number };
export const getLinesCar = createSelector<State, number, number, Line[]>(
    [get("kCar"), get("vCar")],
    (k, v) =>
      range(-v * k * params.cycle, params.total * k).map(d => ({
        x0: d / k,
        t0: 0,
        x1: d / k + v * params.cycle,
        t1: params.cycle
      }))
  ),
  getCars = createSelector<State, number, number, Line[], number[]>(
    [get("vCar"), get("time"), getLinesCar],
    (v, t, lines) => {
      const dx = t * v;
      return lines.map(({ x0 }) => x0 + dx);
    }
  ),
  getKDotsCar = createSelector<State, number, Line[], number[]>(
    [get("vCar"), getLinesCar],
    (v, lines) => {
      const c0 = params.xCut,
        c1 = c0 + params.X,
        c2 = v * params.tCut;
      return lines
        .map(({ x0 }) => x0 + c2)
        .filter(x => x >= c0 && x <= c2)
        .sort((a, b) => b - a);
    }
  ),
  getQDotsCar = createSelector(
    [get("vCar"), getLinesCar],
    (v, lines) => {
      const c1 = params.xCut,
        c2 = params.tCut,
        c3 = c2 + params.T;
      return lines
        .map(({ x0 }) => (c1 - x0) / v)
        .filter(t => t >= c2 && t <= c3)
        .sort((a, b) => a - b);
    }
  );

// mo((k: number) => {
//   const v = vk(k);
//   return getLines(k)
//     .map(({ x0 }) => x0 + v * params.tCut)
//     .filter(x => x >= params.xCut && x <= params.xCut + params.X)
//     .sort((a, b) => b - a);
// });

// export const getQDots = mo((k: number) => {
//   const v = vk(k);
//   return getLines(k)
//     .map(({ x0 }) => (params.xCut - x0) / v)
//     .filter(t => t >= params.tCut && t <= params.tCut + params.T)
//     .sort((a, b) => a - b);
// });

export const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_VAR:
      return {
        ...state,
        [action.payload.key]: action.payload.val
      };
    case ActionTypes.TICK:
      return {
        ...state,
        time: (state.time + action.payload) % params.cycle
      };
    case ActionTypes.SET_PLAY:
      return {
        ...state,
        play: action.payload
      };
    default:
      return state;
  }
};
export const AppContext = React.createContext<{
  state: State;
  dispatch?: Dispatch<Action>;
}>({ state: initialState, dispatch: null });
