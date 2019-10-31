import React, {
  createElement as CE,
  useContext,
  useMemo,
  FC,
  memo,
  useRef,
  useLayoutEffect
} from "react";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { AppContext } from "./ducks";
import * as ducks from "./ducks";
import * as params from "./params";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import { Line } from "./ducks";
import TexLabel from "src/sharedComponents/TexLabel";
import useElementSize from "src/hooks/useElementSizeHook";
import Arrow from "src/sharedComponents/Arrow";
import "d3-transition";
import { select } from "d3-selection";
import {
  easeCubicInOut,
  easeCubicOut,
  easeBackOut,
  easeCubicIn
} from "d3-ease";

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
  carWidth = height - xScale(params.carWidth);

type DotProps = {
  t: number;
  x: number;
  time: number;
  play: boolean;
  className: string;
};

const Dot = React.memo(({ time, t, x, className, play }: DotProps) => {
  const ref = useRef<SVGCircleElement>();
  useLayoutEffect(() => {
    // if (Math.abs(time - t) < .5)
    select(ref.current)
      .attr("r", 0)
      .transition()
      .ease(easeCubicOut)
      .duration(320)
      .attr("r", 7)
      .attr("stroke-width", 4)
      .transition()
      .duration(300)
      .ease(easeCubicOut)
      .attr("stroke-width", 2)
      .attr("r", 4.5);
    // else select(ref.current).attr("r", 4);
  }, []);

  return (
    <circle ref={ref} className={className} cx={tScale(t)} cy={xScale(x)} />
  );
});

const Lines = (() => {
  const style = {
    strokeWidth: "1.5px",
    stroke: colors.lightBlue["A400"],
    strokeDasharray: "1,1"
  };
  return React.memo(({ lines }: { lines: Line[] }) => (
    <g id="g-lines">
      {lines.map(({ x1, x0, t1, t0 }, i) => (
        <path
          key={i}
          style={style}
          d={`M${tScale(t0)},${xScale(x0)}L${tScale(t1)},${xScale(x1)}`}
        />
      ))}
    </g>
  ));
})();

const EMPTY = {};
export default () => {
  const { state } = useContext(AppContext),
    classes = useStyles(EMPTY);
  return (
    <svg className={classes.svg}>
      <Arrow />
      <g transform={gTranslate}>
        <mask id="myMask2">
          <rect width={width} height={height} fill="white" />
        </mask>
        <mask id="myMask3">
          <rect width={tScale(state.time)} height={height} fill="white" />
        </mask>
        <g className={classes.maskedLines} mask="url(#myMask3)">
          <Lines lines={ducks.getLinesCar(state)}  />
        </g>
        <g id="g-masked" mask="url(#myMask2)">
          {CE("path", {
            className: classes.road,
            strokeWidth: height - xScale(params.roadWidth),
            d: `M0,0L0,${height}`,
            transform: `translate(${tScale(state.time)},0)`
          })}
          <g id="g-cut">
            <rect
              className={classes.cut}
              width={tScale(params.T)}
              height={height - xScale(params.X)}
              y={xScale(params.xCut + params.X)}
              x={tScale(params.tCut)}
            />
            {state.time >= params.tCut &&
              ducks
                .getKDotsCar(state)
                .map((x, i) => (
                  <Dot
                    key={i}
                    x={x}
                    t={params.tCut}
                    time={state.time}
                    play={state.play}
                    className={classes.kdot}
                  />
                ))}
            {ducks
              .getQDotsCar(state)
              .filter(t => t <= state.time)
              .map((t, i) => (
                <Dot
                  key={i}
                  x={params.xCut}
                  t={t}
                  time={state.time}
                  play={state.play}
                  className={classes.qdot}
                />
              ))}
          </g>
          <g id="g-lane" transform={`translate(${tScale(state.time)},0)`}>
            <g id="g-cars">
              {ducks.getCars(state).map((x, i) => (
                <rect
                  key={i}
                  className={classes.car}
                  y={xScale(x) + carLength / 6}
                  x={-carWidth / 2}
                  height={carLength}
                  width={carWidth}
                />
              ))}
            </g>
          </g>
        </g>
        <g id="vaxis">
          <path
            d={`M0,0L0,${height}`}
            fill="none"
            stroke="black"
            className={classes.axis}
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
            className={classes.axis}
          />
          <TexLabel x={width - 15} y={5} latexstring="t \; \text{(s)}" />
        </g>
      </g>
    </svg>
  );
};

const useStyles = makeStyles({
  path: {
    strokeWidth: "4px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
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
    fillOpacity: 0.15
  },
  car: {
    fill: colors.purple["A200"]
  },
  masked: {
    mask: "url(#myMask2)"
  },
  maskedLines: {
    mask: "url(#myMask3)"
  },
  road: {
    stroke: colors.grey["300"]
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
    fill: colors.green.A700,
    stroke: "white",
    strokeWidth: "2px"
  },
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
