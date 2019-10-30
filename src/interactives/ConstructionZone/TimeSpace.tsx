import React, { useMemo, createElement as CE, useContext } from "react";
import * as params from "./constants";
import { AppContext } from "./ducks";
import { ScaleLinear } from "d3-scale";
import "katex/dist/katex.min.css";
import simplify from "simplify-js";
import { history } from "./ducks";
import Road from "./Road";
import * as ducks from "./ducks";
import { makeStyles, createStyles } from "@material-ui/styles";
import * as colors from "@material-ui/core/colors";
import useScale from "src/hooks/useScale";
import TexLabel from "src/sharedComponents/TexLabel";

const M = {
    top: 20,
    bottom: 25,
    left: 25,
    right: 10
  },
  gTranslate = `translate(${M.left},${M.top})`;

const Axes = (() => {
  const style = {
    strokeWidth: "2px",
    color: colors.grey["800"]
  };
  return ({ width, height }: { width: number; height: number }) => (
    <>
      <g>
        <path
          d={`M0,0L0,${height}`}
          fill="none"
          stroke="black"
          style={style}
          markerStart="url(#arrow)"
        />
        <TexLabel x={-5} y={-25} latexstring="x" />
      </g>
      <g transform={`translate(0,${height})`}>
        <path
          d={`M0,0L${width},0`}
          fill="none"
          stroke="black"
          style={style}
          markerEnd="url(#arrow)"
        />
        <TexLabel x={width - 5} y={5} latexstring="t" />
      </g>
    </>
  );
})();

const coverMaskStyle = { mask: "url(#coverMask)" };
const Trajectories = (() => {
  const style = {
    fill: "none",
    stroke: colors.lightBlue["A400"],
    strokeWidth: "2px",
    pointerEvents: "none"
  };
  return React.memo(
    ({
      tScale,
      xScale
    }: {
      tScale: ScaleLinear<number, number>;
      xScale: ScaleLinear<number, number>;
    }) => (
      <g style={coverMaskStyle}>
        {history.map((trajectory, key) =>
          CE("path", {
            style,
            key,
            d: simplify(
              trajectory.map(([t, x]) => ({ x: tScale(t), y: xScale(x) })),
              0.2
            ).reduce((a, { x, y }) => a + x + "," + y + " ", "M")
          })
        )}
      </g>
    )
  );
})();

const Detectors = (() => {
  const dStyle = {
      strokeWidth: "2px",
      stroke: params.dColor,
      fill: "none",
      strokeDasharray: "3,4",
      strokeLinecap: "round"
    },
    aStyle = { ...dStyle, stroke: params.aColor },
    czStyle = { ...dStyle, stroke: colors.green['A700'] },
    tStyle={...dStyle, stroke: colors.grey['500']};
  return React.memo(({
    xScale,
    tScale,
    width,
    height
  }: {
    xScale: ScaleLinear<number, number>;
    tScale: ScaleLinear<number, number>;
    width: number;
    height: number;
  }) => (
    <g>
      <g transform={`translate(0,${xScale(params.aDetector)})`}>
        <TexLabel latexstring="x_a" x={-22} y={-10} />
        {CE("path", {
          ...aStyle,
          d: `M0,0L${width},0`
        })}
      </g>
      <g transform={`translate(0,${xScale(params.dDetector)})`}>
        <TexLabel latexstring="x_d" x={-22} y={-10} />
        {CE("path", {
          ...dStyle,
          d: `M0,0L${width},0`
        })}
      </g>
      <g transform={`translate(0,${xScale(params.blockX)})`}>
        <TexLabel latexstring="x_{cz}" x={-22} y={-10} />
        {CE("path", {
          ...czStyle,
          d: `M0,0L${width},0`
        })}
      </g>
      <g
        transform={`translate(${tScale(params.blockStart)},${height})`}
      >
        <TexLabel latexstring="t_0" x={-2} y={0} />
        {CE("path", {
          ...tStyle,
          d: `M0,0L${0},${-height}`
        })}
      </g>
      <g
        transform={`translate(${tScale(params.blockTimes[1])},${height})`}
      >
        <TexLabel latexstring="t_1" x={-2} y={0} />
        {CE("path", {
          ...tStyle,
          d: `M0,0L${0},${-height}`
        })}
      </g>
    </g>
  ));
})();

const Marker = (
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 15 15"
      refY="5"
      refX="2"
      markerWidth="8"
      markerHeight="8"
      orient="auto-start-reverse"
      fill="black"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  </defs>
);
export default ({ width, height }: { width: number; height: number }) => {
  const classes = useStyles({ width, height });
  width = width - M.left - M.right;
  height = height - M.bottom - M.top;
  const { state, dispatch } = useContext(AppContext),
    xScale = useScale([height, 0], [0, params.total], [height]),
    tScale = useScale([0, width], [0, params.duration], [width]);
  const TrafficStates = useMemo(() => {
    return (
      <g mask="url(#coverMask)">
        {ducks.trafficStates.map(d => (
          <path
            className={classes.trafficState}
            key={d.k}
            onMouseOver={() => {
              dispatch({ type: "HIGHLIGHT", payload: [d.k, d.q] });
            }}
            onMouseOut={() => {
              dispatch({ type: "HIDE" });
            }}
            d={
              d.points.reduce(
                (a, v) => a + tScale(v[0]) + "," + xScale(v[1]) + " ",
                "M"
              ) + "Z"
            }
          />
        ))}
      </g>
    );
  }, [width, height]);

  return (
    <svg className={classes.svg}>
      {Marker}
      <g transform={gTranslate}>
        <mask id="myMask">
          <rect height={height} width={width} fill="white" stroke="none" />
        </mask>
        {/* <mask id="coverMask"> */}
        {/* </mask> */}
        {TrafficStates}
        <g style={{ mask: "url(#myMask)" }}>
          <Trajectories tScale={tScale} xScale={xScale} />
          <rect
            x={tScale(state.time)}
            width={width - tScale(state.time)}
            height={height}
            fill="white"
          />
          <g
            transform={`translate(${tScale(state.time)},${height}) rotate(-90)`}
          >
            <Road height={30} width={height} />
          </g>
        </g>
        {/* {ducks.interfaces.dots.map((d, i) => (
          <circle key={i} cx={tScale(d[0])} cy={xScale(d[1])} r="5" />
        ))} */}
        {/* {ducks.interfaces.lines.map((d, i) => (
          <line
            key={i}
            x1={tScale(d[0][0])}
            y1={xScale(d[0][1])}
            x2={tScale(d[1][0])}
            y2={xScale(d[1][1])}
            className={classes.interface}
          />
        ))} */}
        <Detectors
          xScale={xScale}
          width={width}
          tScale={tScale}
          height={height}
        />
        <Axes width={width} height={height} />
      </g>
    </svg>
  );
};

const useStyles = makeStyles(
  createStyles({
    svg: ({ width, height }: { width: number; height: number }) => ({
      width,
      height,
      "& text": {
        fontFamily: "Puritan, san-serif",
        fontSize: "11px"
      }
    }),
    trafficState: {
      fill: colors.pink["200"],
      opacity: 0.0,
      "&:hover": {
        opacity: 0.2
      }
    },
    hidden: {
      fill: "white",
      opacity: 0
    },
    marker: {
      fill: colors.lightBlue["A700"]
    }
  })
);
