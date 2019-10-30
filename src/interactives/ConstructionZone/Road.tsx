import React, { useContext, useMemo } from "react";
import { AppContext } from "./ducks";
import * as params from "./constants";
import { delta } from "./constants";
import { history, xOfT2, getBlocked } from "./ducks";
import { colors } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import useScale from "src/hooks/useScale";

export default ({ width, height }: { width: number; height: number }) => {
  const { state } = useContext(AppContext),
    classes = useStyles({
      width,
      height
    }),
    xScale = useScale([0, width], [0, params.total], [width]),
    yScale = useScale([height, 0], [0, 2 * params.roadWidth], [height]);
  const [blockX, roadWidth, carLength, carHeight] = useMemo(
    () => [
      xScale(params.blockX),
      height - yScale(params.roadWidth),
      xScale(params.carLength),
      height - yScale(params.carHeight)
    ],
    [xScale, yScale]
  );
  const [roadPath] = useMemo(() => [`M0,0L${width},0`], [width]);
  let t = state.time / delta;
  let M = params.total + params.sj1;
  let xs = history.map((d, i) => {
    const int = Math.floor(t);
    const frac = t - int;
    return [i, xOfT2[i](int, frac)];
  });


  return (
    <g>
      <path
        className={classes.road}
        d={roadPath}
        style={{ strokeWidth: roadWidth }}
      />
      {getBlocked(state.time) && (
        <path
          className={classes.cZone}
          d={`M${xScale(params.blockX)},0L${xScale(params.total)},0`}
          strokeWidth={roadWidth}
        />
      )}
      <g>
        {xs.map((d, i) => (
          <rect
            key={d[0]}
            className={classes.car}
            transform={`translate(${xScale(d[1]) - carLength},${-carHeight /
              2})`}
            height={carHeight}
            width={carLength}
          />
        ))}
      </g>
    </g>
  );
};

const useStyles = makeStyles({
  road: {
    stroke: colors.grey["300"]
  },
  car: {
    fill: colors.purple["A400"],
    rx: 1,
    ry: 1
  },
  text: {
    textAlign: "center",
    fontSize: "12px",
    fontFamily: "Puritan, sans-serif"
  },
  cZone: {
    stroke: colors.amber["A400"]
  }
});
