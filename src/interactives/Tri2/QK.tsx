import React, {
  createElement as CE,
  useContext,
  useMemo,
  FC,
  memo,
  useRef
} from "react";
import { AppContext, getQK } from "./ducks";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import TexLabel from "src/sharedComponents/TexLabel";
import useElementSize from "src/hooks/useElementSizeHook";
import useScale from "src/hooks/useScale";
import Arrow from "src/sharedComponents/Arrow";
import range from "lodash.range";
import { scaleLinear } from "d3-scale";

const M = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 40
  },
  gTranslate = `translate(${M.left},${M.top})`;

const marginer = ({ width, height }: { width: number; height: number }) => ({
  width: Math.max(width - M.left - M.right, 0),
  height: Math.max(height - M.top - M.bottom, 0)
});

const EMPTY = {};

export default () => {
  const { state } = useContext(AppContext),
    containerRef = useRef<HTMLDivElement>(),
    { width, height } = marginer(useElementSize(containerRef)),
    classes = useStyles(EMPTY),
    kScale = useScale([0, width], [0, 0.4], [width]),
    qScale = useScale([height, 0], [0, 2 / 3], [height]),
    qk = getQK(state),
    QKPath = useMemo(() => {
      let d =
        "M" +
        [
          [0, 0],
          [state.k0, state.k0 * state.vf],
          [state.kj, 0]
        ]
          .map(([k, q]) => [kScale(k), qScale(q)])
          .join("L");

      // range(0, state.kj + .005, state.kj / 200 )
      //   .map(k => [kScale(k), qScale(qk(k))])
      //   .join("L");
      return <path className={classes.path} d={d} />;
    }, [width, height, state.kj, state.k0, state.vf]);
  return (
    <div ref={containerRef} className={classes.container}>
      <svg className={classes.svg}>
        <Arrow />
        <g transform={gTranslate}>
          <mask id="myMask4">
            <rect width={width} height={height} fill="white" />
          </mask>
          <g mask="url(#myMask4)">
            {QKPath}
            <circle
              cx={kScale(state.k)}
              cy={qScale(qk(state.k))}
              className={classes.dot}
              r={6}
            />
          </g>
          <g id="g-qaxis">
            <path
              d={`M0,0L0,${height}`}
              fill="none"
              stroke="black"
              className={classes.axis}
              markerStart="url(#arrow)"
            />
            <TexLabel
              y={qScale(state.k0 * state.vf) - 9}
              x={-15}
              latexstring="q_0"
            />
            <TexLabel x={-20} y={-25} latexstring="q \; \text{(veh/min)}" />
          </g>

          <g transform={`translate(0,${height})`} id="g-kaxis">
            <path
              d={`M0,0L${width},0`}
              fill="none"
              stroke="black"
              markerEnd="url(#arrow)"
              className={classes.axis}
            />
            <TexLabel x={kScale(state.k0)} y={0} latexstring="k_0" />
            <TexLabel x={kScale(state.kj)} y={0} latexstring="k_j" />
            <TexLabel
              x={width - 40}
              y={-24}
              latexstring="k \; \text{(veh/km)}"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

const useStyles = makeStyles({
  dot: {
    fill: colors.pink["A400"],
    stroke: "white",
    strokeWidth: "2px"
  },
  path: {
    strokeWidth: "4px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  line: {
    strokeWidth: "1.5px",
    stroke: colors.lightBlue["A400"],
    strokeDasharray: "2,2"
  },
  svg: {
    width: "100%",
    height: "100%",
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "11px"
    }
  },
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
