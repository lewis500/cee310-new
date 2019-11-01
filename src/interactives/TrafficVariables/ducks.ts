import React, { Dispatch } from "react";
import * as params from "./params";
import mo from "memoize-one";
import range from "lodash.range";
const { kj, vf, w, k0, total } = params,
  min = Math.min,
  max = Math.max;

// export const getRange = (v: number) => [...Array(v).keys()];
export const vk = mo((k: number) => max(min(vf, w * (kj / k - 1)), 0));
export const qk = mo((k: number) => max(min(vf * k, w * (kj - k)), 0));

export type State = {
  readonly play: boolean;
  readonly time: number;
  readonly k: number;
};

export const initialState = {
  play: true,
  time: 0,
  k: k0
};

export enum ActionTypes {
  TICK = "TICK",
  SET_K = "SET_K",
  SET_TIME = "SET_TIME",
  SET_PLAY = "SET_PLAY"
}

type Action =
  | {
      type: ActionTypes.TICK;
      payload: number;
    }
  | {
      type: ActionTypes.SET_K;
      payload: number;
    }
  | {
      type: ActionTypes.SET_TIME;
      payload: number;
    }
  | {
      type: ActionTypes.SET_PLAY;
      payload: boolean;
    };

export const getLines = mo(
  (k: number): { x0: number; t0: number; x1: number; t1: number }[] => {
    return range(-qk(k) * params.cycle, params.total * k).map(d => ({
      x0: d / k,
      t0: 0,
      x1: d / k + vk(k) * params.cycle,
      t1: params.cycle
    }));
  }
);

export const getCars = mo((k: number, t: number) => {
  const δ = t * vk(k);
  return getLines(k).map(({ x0 }) => x0 + δ);
});

export const getKDots = mo((k: number) => {
  const v = vk(k);
  return getLines(k)
    .map(({ x0 }) => x0 + v * params.tCut)
    .filter(x => x >= params.xCut && x <= params.xCut + params.X)
    .sort((a,b)=>b-a);
});

export const getQDots = mo((k: number) => {
  const v = vk(k);
  console.log('asdf')
  return getLines(k)
    .map(({ x0 }) => (params.xCut - x0) / v)
    .filter(t => t >= params.tCut && t <= params.tCut + params.T)
    .sort((a,b)=>a-b);
});

export const QKLine = range(0, params.kj * (1 + 1 / 100), params.kj / 100).map(
  k => [k, qk(k)]
);

export const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_TIME:
      return {
        ...state,
        time: action.payload
      };
    case ActionTypes.TICK:
      return {
        ...state,
        time: (state.time + action.payload) % params.cycle
      };
    case ActionTypes.SET_K:
      return {
        ...state,
        k: action.payload
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
