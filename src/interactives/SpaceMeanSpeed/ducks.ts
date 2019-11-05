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
  kCar: 0.1,
  vCar: 10,
  kTruck: 0.1,
  vTruck: 6
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

const getSelectors = (which: "Car" | "Truck") => {
  const kVar = "k" + which,
    vVar = "v" + which,
    getLines = createSelector<State, number, number, Line[]>(
      [get(kVar), get(vVar)],
      (k, v) => {
        // return range(params.total, )
        return range(params.total * k, -v * k * params.cycle).map(d => ({
          x0: d / k,
          t0: 0,
          x1: d / k + v * params.cycle,
          t1: params.cycle
        }));
      }
    ),
    getVehs = createSelector<
      State,
      number,
      number,
      Line[],
      { id: number; x: number }[]
    >(
      [get(vVar), get("time"), getLines],
      (v, t, lines) => {
        const dx = t * v;
        return lines.map(({ x0 }) => ({ id: x0, x: x0 + dx }));
      }
    ),
    getKDots = createSelector<State, number, Line[], number[]>(
      [get(vVar), getLines],
      (v, lines) => {
        const c0 = params.xCut,
          c1 = c0 + params.X,
          c2 = v * params.tCut;
        return lines
          .map(({ x0 }) => x0 + c2)
          .filter(x => x >= c0 && x <= c1)
          .sort((a, b) => a - b);
      }
    ),
    getQDots = createSelector(
      [get(vVar), getLines],
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

  return { getLines, getKDots, getQDots, getVehs };
};

export const getAvgSpeeds = createSelector(
  [get("vCar"), get("vTruck"), get("kCar"), get("kTruck")],
  (vCar, vTruck, kCar, kTruck) => ({
    timeMean:
      (vCar * vCar * kCar + vTruck * vTruck * kTruck) /
      (vCar * kCar + vTruck * kTruck),
    spaceMean: (vCar * kCar + vTruck * kTruck) / (kCar + kTruck)
  })
);

export const {
  getLines: getLinesCar,
  getKDots: getKDotsCar,
  getQDots: getQDotsCar,
  getVehs: getCars
} = getSelectors("Car");

export const {
  getLines: getLinesTruck,
  getKDots: getKDotsTruck,
  getQDots: getQDotsTruck,
  getVehs: getTrucks
} = getSelectors("Truck");

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
