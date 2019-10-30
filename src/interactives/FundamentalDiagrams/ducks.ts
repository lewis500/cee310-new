import React, { Dispatch } from "react";
import * as params from "./constants";
import { createSelector } from "reselect";
const { kj, vf, w, k0, numLanes, total } = params,
  min = Math.min,
  max = Math.max;

export const getRange = (v: number) => [...Array(v).keys()];

type Lane = {
  cars: number[];
  v: number;
  s: number;
  k: number;
};

export enum VKType {
  TRIANGLE = "TRIANGLE",
  GREENSHIELDS = "GREENSHIELDS",
  DRAKE = "DRAKE"
}

export type State = {
  readonly play: boolean;
  readonly lanes: Lane[];
  readonly vk: VKType;
};

export const kRange: number[] = getRange(numLanes).map(
  (d: number, i: number) => ((i + 1) / numLanes) * kj
);

export const vkMap: { [keys in VKType]: (k: number) => number } = {
  TRIANGLE: k => max(min(vf, w * (kj / k - 1)), 0),
  GREENSHIELDS: k => max(0, vf * (1 - k / kj)),
  DRAKE: k => max(0, vf * Math.exp(-Math.pow(k / k0, 2) / 2))
};

const setLanes = (vk: VKType): Lane[] =>
  kRange.map(k => ({
    k,
    s: 1 / k,
    v: vkMap[vk](k),
    cars: getRange(Math.round(total * k)).map(d => d / k)
  }));

export const initialState = {
  play: true,
  lanes: setLanes(VKType.TRIANGLE),
  vk: VKType.TRIANGLE
};

export enum ActionTypes {
  TICK = "TICK",
  SET_VK = "SET_VK",
  SET_PLAY = "SET_PLAY"
}

type Action =
  | {
      type: ActionTypes.TICK;
      payload: number;
    }
  | {
      type: ActionTypes.SET_VK;
      payload: VKType;
    }
  | {
      type: ActionTypes.SET_PLAY;
      payload: boolean;
    };

export const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.TICK:
      let δ = action.payload;
      return {
        ...state,
        lanes: state.lanes.map((l: Lane) => {
          let cars = l.cars.map(c => c + δ * l.v);
          if (cars[0] > l.s) cars.unshift(cars[0] - l.s);
          if (cars[cars.length - 1] > total) cars.pop();
          return {
            ...l,
            cars
          };
        })
      };
    case ActionTypes.SET_VK:
      return {
        ...state,
        vk: action.payload,
        lanes: setLanes(action.payload)
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

export const getQ0 = createSelector<State, VKType, number>(
  [state => state.vk],
  vk => {
    switch (vk) {
      case VKType.GREENSHIELDS:
        return (vkMap.GREENSHIELDS(params.kj / 2) * params.kj) / 2;
      case VKType.TRIANGLE:
        return params.q0;
      default:
        return vkMap.DRAKE(params.k0) * params.k0;
    }
  }
);

export const AppContext = React.createContext<{
  state: State;
  dispatch?: Dispatch<Action>;
}>({ state: initialState, dispatch: null });
