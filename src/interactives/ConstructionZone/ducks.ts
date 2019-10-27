import React, { Dispatch } from "react";
import mo from "memoize-one";
import * as params from "./constants";
import range from "lodash.range";
import { scaleLinear } from "d3-scale";

const vs1 = (() => {
  const { sj1, w1, vf1 } = params;
  return (s: number) => Math.max(Math.min(vf1, (s / sj1 - 1) * w1), 0);
})();

const vs2 = (() => {
  const { sj2, w2, vf2 } = params;
  return (s: number) => Math.max(Math.min(vf2, (s / sj2 - 1) * w2), 0);
})();

type Entry = [number, number];

export const getBlocked = (() => {
  const {
    blockTimes: [a, b]
  } = params;
  return (time: number) => time >= a && time <= b;
})();

type CumEntry = { t: number; a: number; d: number };
export const cumulative: CumEntry[] = [{ t: 0, a: 0, d: 0 }]; //add v: virtual arrivals later
export const history = (() => {
  const { vf1, delta, Q, total, blockX, aDetector, dDetector } = params,
    S = vf1 / Q,
    numCars = params.duration / Q;

  let cars: number[] = range(0, numCars).map(i => total - i * S);
  const history = cars.map(x => [[0, x]]);
  const getX = (arr: number[], i: number, blocked: boolean) => {
    let x = arr[i];
    let nextX = i === 0 ? Infinity : arr[i - 1];
    if (!blocked || x <= blockX) return x + vs1(nextX - x) * delta;
    // should u put a min operation in here to stop overtaking?
    return x + vs2(nextX - x) * delta;
  };
  for (let t = 0; t < params.duration; t += delta) {
    const blocked = getBlocked(t);
    let cumEntry = { ...cumulative[cumulative.length - 1], t };
    cars = cars.map((x, i, arr) => {
      let newX = getX(arr, i, blocked);
      if (x < aDetector && newX > aDetector) cumEntry.a++;
      if (x < dDetector && newX > dDetector) cumEntry.d++;
      return newX;
    });
    for (let i = 0; i < history.length; i++) history[i].push([t, cars[i]]);
    cumulative.push(cumEntry);
  }
  return history;
})();
console.log(cumulative);

type Point = [number, number];

type Interface = {
  start: Point;
  end: Point;
  u: number;
  l: number;
};

export const interfaces = (() => {
  const A = [params.blockTimes[0] + params.delta, params.blockX],
    B = [params.blockTimes[1], params.blockX],
    kQueue = params.kj1 - params.qc2 / params.w1,
    vBack = -(params.Q - params.qc2) / (params.Q / params.vf1 - kQueue),
    T =
      (params.blockDuration * vBack) / (params.w1 - vBack) +
      params.blockDuration,
    C = [A[0] + T + 1, params.blockX - T * vBack];
  return { dots: [A, B, C], lines: [[A, C], [B, C]] };
})();

export const xOfT = history.map((d, i) =>
  scaleLinear()
    .domain(d.map(v => v[0]))
    .range(d.map(v => v[1]))
);

export const xOfT2 = history.map((d, i) => (int: number, frac: number) => {
  const x0 = d[int][1];
  const x1 = d[int + 1] ? d[int + 1][1] : d[int][1];
  return x0 + (x1 - x0) * frac;
});

export const initialState = {
  play: false,
  time: 0
};

export type State = typeof initialState;
type ActionTypes =
  | {
      type: "TICK";
      payload: number;
    }
  | {
      type: "RESTART";
    }
  | {
      type: "SET_TIME";
      payload: number;
    }
  | {
      type: "RESET";
    }
  | {
      type: "SET_PLAY";
      payload: boolean;
    };

export const reducer = (state: State, action: ActionTypes): State => {
  switch (action.type) {
    case "SET_TIME":
      return {
        ...state,
        time: action.payload
      };
    case "TICK":
      return {
        ...state,
        time: state.time + action.payload
      };
    case "SET_PLAY":
      return {
        ...state,
        play: action.payload
      };
    case "RESET":
      return {
        ...state,
        time: 0
      };
    default:
      return state;
  }
};
export const AppContext = React.createContext<{
  state: State;
  dispatch?: Dispatch<ActionTypes>;
}>({ state: initialState, dispatch: null });
