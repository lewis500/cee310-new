import React, { useContext, useMemo, useRef } from "react";
import { AppContext } from "./ducks";
import * as params from "./constants";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import TexLabel from "src/sharedComponents/TexLabel";
import useElementSize from "src/hooks/useElementSizeHook";
import Arrow from "src/sharedComponents/Arrow";
import useScale from "src/hooks/useScale";

const M = {
  top: 20,
  bottom: 20,
  left: 20,
  right: 10
};

export default ({ width, height }: { width: number; height: number }) => {
  const { state } = useContext(AppContext),
    classes = useStyles({ width, height });
  width -= M.left + M.right;
  height -= M.top + M.bottom;
  const kScale = useScale([0, width], [0, params.kj1 * 1.1], [width]),
    qScale = useScale([height, 0], [0, params.qc1 * 1.1], [height]),
    QKPath1 = useMemo(() => {
      const d =
        "M" +
        [[0, 0], [params.kc1, params.qc1], [params.kj1, 0]]
          .map(([k, q]) => [kScale(k), qScale(q)])
          .join("L");
      return <path className={classes.path} d={d} />;
    }, [width, height]),
    QKPath2 = useMemo(() => {
      const d =
        "M" +
        [[0, 0], [params.kc2, params.qc2], [params.kj2, 0]]
          .map(([k, q]) => [kScale(k), qScale(q)])
          .join("L");
      return <path className={classes.path} d={d} />;
    }, [width, height]);
  return (
    <svg className={classes.svg}>
      <Arrow />
      <g transform={`translate(${M.left},${M.top})`}>
        <mask id="myMask4">
          <rect width={width} height={height} fill="white" />
        </mask>
        <g mask="url(#myMask4)">
          {QKPath1}
          {QKPath2}
          {state.showState && (
            <circle
              cx={kScale(state.trafficState[0])}
              cy={qScale(state.trafficState[1])}
              className={classes.dot}
              r={6}
            />
          )}
        </g>
        <g id="g-qaxis">
          <path
            d={`M0,0L0,${height}`}
            fill="none"
            stroke="black"
            className={classes.axis}
            markerStart="url(#arrow)"
          />
          {/* <TexLabel y={qScale(params.q0) - 12} x={-15} latexstring="q_0" /> */}
          <TexLabel x={10} y={0} latexstring="q \; (\text{veh/min})" />
        </g>

        <g transform={`translate(0,${height})`} id="g-kaxis">
          <path
            d={`M0,0L${width},0`}
            fill="none"
            stroke="black"
            markerEnd="url(#arrow)"
            className={classes.axis}
          />
          {/* <path
              d={`M0,0L${width},0`}
              fill="none"
              stroke="black"
              markerEnd="url(#arrow)"
              className={classes.axis}
            /> */}
          {/* <TexLabel x={kScale(params.kc1)} y={0} latexstring="k_0" /> */}
          <TexLabel x={width - 70} y={3} latexstring="k \; \text{(veh/km)}" />
        </g>
      </g>
    </svg>
  );
};

const useStyles = makeStyles({
  dot: {
    fill: colors.pink["500"],
    stroke: "white",
    strokeWidth: "2px"
  },
  path: {
    strokeWidth: "2px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
  //   container: {
  //     position: "relative",
  //     width: "100%",
  //     height: "100%"
  //   },
  line: {
    strokeWidth: "1.5px",
    stroke: colors.lightBlue["A400"],
    strokeDasharray: "2,2"
  },
  svg: ({ width, height }: { width: number; height: number }) => ({
    width,
    height
    // "& text": {
    //   fontFamily: "Puritan, san-serif",
    //   fontSize: "11px"
    // }
  }),
  cut: {
    stroke: colors.grey["700"],
    strokeWidth: "2px",
    fill: colors.green["A200"],
    fillOpacity: 0.2
  },
  car: {
    fill: colors.purple["A400"]
    // stroke: 'black'
    // stroke: colors.grey["800"]
  },
  masked: {
    mask: "url(#myMask2)"
  },
  maskedLines: {
    mask: "url(#myMask3)"
  },
  road: {
    stroke: colors.grey["300"]
    // opacity: .95
  },
  axis: {
    strokeWidth: "2px",
    color: colors.grey["800"]
  },
  qdot: {
    fill: colors.pink.A400,
    stroke: "white",
    strokeWidth: "2px"
  },
  kdot: {
    fill: colors.orange.A700,
    stroke: "white",
    strokeWidth: "2px"
  },
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
