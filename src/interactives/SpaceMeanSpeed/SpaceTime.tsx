import React, {
  createElement as CE,
  useContext,
  useMemo,
  FC,
  memo,
  useRef,
  useLayoutEffect,
  createElement,
  PureComponent
} from "react";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { AppContext } from "./ducks";
import * as ducks from "./ducks";
import * as params from "./params";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import { Line } from "./ducks";
import TexLabel from "src/sharedComponents/TexLabel";
import Arrow from "src/sharedComponents/Arrow";
import "d3-transition";
import { select } from "d3-selection";
import {
  easeCubicInOut,
  easeCubicOut,
  easeBackOut,
  easeCubicIn
} from "d3-ease";
import clsx from "clsx";

const M = {
    top: 25,
    bottom: 25,
    left: 20,
    right: 10
  },
  gTranslate = `translate(${M.left},${M.top})`,
  width = 700 - M.left - M.right,
  height = 450 - M.top - M.bottom,
  tScale = scaleLinear()
    .range([0, width])
    .domain([0, params.cycle]),
  xScale = scaleLinear()
    .range([height, 0])
    .domain([0, params.total]),
  carLength = height - xScale(params.carLength),
  carWidth = height - xScale(params.carWidth),
  truckLength = height - xScale(params.truckLength),
  truckWidth = height - xScale(params.truckWidth),
  carColor = colors.purple.A400,
  truckColor = colors.green.A700;

type DotProps = {
  t: number;
  x: number;
  className: string;
  fill: string;
};
const dotStyle = {
  stroke: "white",
  strokeWidth: "1px",
  opacity: 0.65
};

const Dot = memo(({ t, x, className, fill }: DotProps) => {
  const ref = useRef<SVGCircleElement>();
  useLayoutEffect(() => {
    select(ref.current)
      .attr("r", 0)
      .transition()
      .ease(easeCubicOut)
      .duration(250)
      .attr("r", 7)
      .attr("stroke-width", 4)
      .transition()
      .duration(250)
      .ease(easeCubicOut)
      .attr("stroke-width", 2)
      .attr("r", 4.5);
  }, []);

  return (
    <circle
      ref={ref}
      r="4.5px"
      fill={fill}
      style={dotStyle}
      cx={tScale(t)}
      cy={xScale(x)}
    />
  );
});

const Lines = (() => {
  const style = {
    strokeWidth: "1.5px",
    strokeDasharray: "1,1"
  };
  return React.memo(({ lines, stroke }: { lines: Line[]; stroke: string }) => {
    return (
      <g id="g-lines">
        {lines.map(({ x1, x0, t1, t0 }, i) => (
          <path
            key={i}
            style={style}
            stroke={stroke}
            d={`M${tScale(t0)},${xScale(x0)}L${tScale(t1)},${xScale(x1)}`}
          />
        ))}
      </g>
    );
  });
})();

const EMPTY = {};

const axisStyle = {
  strokeWidth: "2px",
  color: colors.grey["800"]
};
const Axes = (
  <g>
    <g id="vaxis">
      <path
        d={`M0,0L0,${height}`}
        fill="none"
        stroke="black"
        style={axisStyle}
        markerStart="url(#arrow)"
      />
      <TexLabel x={-10} y={-25} latexstring="x \; \text{(m)}" />
    </g>
    <g transform={`translate(0,${height})`} id="taxis">
      <path
        d={`M0,0L${width},0`}
        fill="none"
        stroke="black"
        markerEnd="url(#arrow)"
        style={axisStyle}
      />
      <TexLabel x={width - 15} y={5} latexstring="t \; \text{(s)}" />
    </g>
  </g>
);
const Road = CE("path", {
  stroke: colors.grey["300"],
  strokeWidth: height - xScale(params.roadWidth),
  d: `M0,0L0,${height}`
});

export default () => {
  const { state } = useContext(AppContext),
    classes = useStyles(EMPTY);
  return (
    <svg className={classes.svg}>
      <Arrow />
      <g transform={gTranslate}>
        <mask id="myMask10">
          <rect width={width} height={height} fill="white" />
        </mask>
        <mask id="myMask3">
          <rect width={tScale(state.time)} height={height} fill="white" />
        </mask>
        <g  mask="url(#myMask3)">
          <Lines lines={ducks.getLinesCar(state)} stroke={carColor} />
          <Lines lines={ducks.getLinesTruck(state)} stroke={truckColor} />
        </g>
        <g id="g-masked" mask="url(#myMask10)">
          <rect
            className={classes.cut}
            width={tScale(params.T)}
            height={height - xScale(params.X)}
            y={xScale(params.xCut + params.X)}
            x={tScale(params.tCut)}
          />
          {state.time >= params.tCut && (
            <g>
              {ducks.getKDotsCar(state).map((x, i) => (
                <Dot key={i} x={x} t={params.tCut} fill={carColor} />
              ))}
              {ducks.getKDotsTruck(state).map((x, i) => (
                <Dot key={i} x={x} t={params.tCut} fill={truckColor} />
              ))}
              {ducks
                .getQDotsCar(state)
                .filter(t => t <= state.time)
                .map((t, i) => (
                  <Dot key={i} x={params.xCut} t={t} fill={carColor} />
                ))}
              {ducks
                .getQDotsTruck(state)
                .filter(t => t <= state.time)
                .map((t, i) => (
                  <Dot key={i} x={params.xCut} t={t} fill={truckColor} />
                ))}
            </g>
          )}
          <g id="g-lane" transform={`translate(${tScale(state.time)},0)`}>
            {Road}
            <g id="g-cars">
              {ducks.getCars(state).map(({ x, id }) => (
                <rect
                  key={id}
                  fill={carColor}
                  y={xScale(x) + carLength / 6}
                  x={4 - carWidth / 2}
                  height={carLength}
                  width={carWidth}
                />
              ))}
            </g>
            <g id="g-trucks">
              {ducks.getTrucks(state).map(({ id, x }) => (
                <rect
                  key={id}
                  className={classes.car}
                  y={xScale(x) + truckLength / 6}
                  x={-4 - truckWidth / 2}
                  height={truckLength}
                  width={truckWidth}
                  fill={truckColor}
                />
              ))}
            </g>
          </g>
        </g>
        {Axes}
      </g>
    </svg>
  );
};

const useStyles = makeStyles({
  svg: {
    width: width + M.left + M.right,
    height: height + M.top + M.bottom,
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "11px"
    }
  },
  cut: {
    stroke: colors.grey["700"],
    strokeWidth: "2px",
    rx: 2,
    ry: 2,
    fill: colors.amber["A400"],
    // opacity: .15
    fillOpacity: 0.15
  },
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
