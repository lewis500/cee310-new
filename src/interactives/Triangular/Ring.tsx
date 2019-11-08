import React, {
  createElement as CE,
  useContext,
  useRef,
  useLayoutEffect
} from "react";
import { AppContext } from "./ducks";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import useElementSize from "src/hooks/useElementSizeHook";
import * as params from "./params";
import "d3-transition";
import { select } from "d3-selection";
import {
  easeCubicInOut,
  easeCubicOut,
} from "d3-ease";

const M = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  },
  ROAD_WIDTH = 20,
  gTranslate = `translate(${M.left},${M.top})`;

const marginer = ({ width, height }: { width: number; height: number }) => ({
  width: width - M.left - M.right,
  height: height - M.top - M.bottom
});

export default () => {
  const { state } = useContext(AppContext),
    containerRef = useRef<HTMLDivElement>(),
    { width } = marginer(useElementSize(containerRef)),
    classes = useStyles({ width }),
    R = width / 2 - ROAD_WIDTH / 2;
  let detectorRef = useRef<SVGRectElement>();
  useLayoutEffect(() => {
    select(detectorRef.current)
      .attr("x", R - ROAD_WIDTH / 2)
      .attr("fill", colors.grey["A400"])
      .attr("width", ROAD_WIDTH);
  }, [R]);
  useLayoutEffect(() => {
    if (width < 10) return;
    select(detectorRef.current)
      .transition()
      .ease(easeCubicInOut)
      .duration(100)
      .attr("x", R - ROAD_WIDTH / 2 - 2.5)
      .attr("width", ROAD_WIDTH + 5)
      .attr("fill", colors.red["A400"])
      .transition()
      .duration(200)
      .ease(easeCubicOut)
      .attr("x", R - ROAD_WIDTH / 2)
      .attr("fill", colors.grey["A400"])
      .attr("width", ROAD_WIDTH);
  }, [state.flowCount[state.flowCount.length - 1]]);
  return (
    <div ref={containerRef} className={classes.container}>
      <svg className={classes.svg}>
        <g transform={gTranslate}>
          <g transform={`translate(${width / 2},${width / 2})`}>
            <circle className={classes.road} r={R} />
            <g>
              {state.cars.map(car => (
                <rect
                  key={car.id}
                  transform={`rotate(${(car.x / params.total) * 360}) `}
                  className={classes.car}
                  x={R - 1.5}
                  rx="1"
                  ry="1"
                  width="2"
                  height="4"
                />
              ))}
              <rect y={0} ref={detectorRef} stroke="white" height={4} dy={-2} />
              <g transform={`translate(${R + ROAD_WIDTH / 2},0)`}>
                <Counter flowCount={state.flowCount} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

const useStyles = makeStyles({
  dot: {
    fill: colors.pink["500"],
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
    // padding: '0 40px',
    boxSizing: "border-box",
    width: "100%"
    // height: "100%"
  },
  line: {
    strokeWidth: "1.5px",
    stroke: colors.lightBlue["A400"],
    strokeDasharray: "2,2"
  },
  svg: {
    width: "100%",
    height: ({ width }: { width: number }) => width + M.top + M.bottom,
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
  },
  masked: {
    mask: "url(#myMask2)"
  },
  maskedLines: {
    mask: "url(#myMask3)"
  },
  road: {
    stroke: colors.grey["300"],
    strokeWidth: ROAD_WIDTH,
    fill: "none"
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

const counterStyles = makeStyles({
  box: {
    fill: colors.red["A400"],
    rx: 1,
    ry: 1
  }
});

const Counter = ({ flowCount }: { flowCount: number[] }) => {
  const classes = counterStyles({});
  const ref = useRef<SVGSVGElement>();
  const rectHeight = 8;
  useLayoutEffect(() => {
    let sel = select(ref.current)
      .selectAll("rect")
      .data(flowCount, function(d: number) {
        return d;
      });

    sel
      .exit()
      .transition("remove")
      // .ease(easeCubicInOut)
      .duration(50)
      .style("fill-opacity", 0)
      // .on("end", function(d) {
      //   select(this).remove();
      // });
      .remove();

    sel
      .transition()
      .duration(80)
      .attr(
        "y",
        (d: number, i: number, k: number[]) => (i - k.length) * (rectHeight + 3)
      );

    sel
      .enter()
      .append("rect")
      .attr("class", classes.box)
      .attr("width", rectHeight)
      .attr("height", rectHeight)
      .attr("x", 3)
      .style("fill-opacity", 0.2)
      .attr("y", 0)
      .attr("height", 0)
      .transition(38)
      // .attr('transform','scale(1)')
      .attr("height", rectHeight)
      .attr("y", -rectHeight - 3)
      .style("fill-opacity", 1);
  }, [flowCount]);
  return <g ref={ref}></g>;
};
