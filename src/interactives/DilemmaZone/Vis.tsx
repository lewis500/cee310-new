import React, { createElement as CE, FunctionComponent } from "react";
import { widths } from "./constants";
// import { colors } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import { scaleLinear } from "d3-scale";
import { makeStyles } from "@material-ui/styles";
import TeX from "@matejmazur/react-katex";
const EMPTY = {};
const useStyles = makeStyles({
  road: {
    fill: colors.grey["200"],
    stroke: "none"
  },
  svg: {
    display: "inline-block",
    // margin: "30px 0",
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "13px"
    }
  },
  text: {
    textAlign: "center",
    fontSize: "12px",
    fontFamily: "Puritan, sans-serif"
  },
  car: {
    fill: colors.lightBlue["500"]
  },
  xssd: {
    stroke: colors.green.A400,
    strokeWidth: "2px"
  }
});
type Classes = ReturnType<typeof useStyles>;

const WIDTH = 700,
  HEIGHT = 175,
  H2 = HEIGHT / 2,
  scale = scaleLinear()
    .range([0, WIDTH])
    .domain([widths.start, widths.start - widths.total]);

const lightColors = {
  green: colors.green["400"],
  red: colors.red["A200"],
  yellow: colors.yellow["700"]
};

const START = scale(0),
  ROAD_WIDTH = START - scale(widths.road),
  CAR_WIDTH = START - scale(widths.car.width),
  CAR_HEIGHT = START - scale(widths.car.height),
  R2 = ROAD_WIDTH / 2;

export const Road = CE(
  "g",
  {},
  CE("rect", {
    height: ROAD_WIDTH,
    width: WIDTH,
    x: 0,
    y: H2 - R2,
    stroke: "none",
    fill: colors.grey["200"]
  }),
  CE("rect", {
    height: HEIGHT,
    width: ROAD_WIDTH,
    x: START,
    y: 0,
    stroke: "none",
    fill: colors.grey["200"]
  })
);

export const Car: FunctionComponent<{
  x: number;
  y: number;
  violation: boolean;
}> = ({ x, y, violation }) => {
  return CE("rect", {
    width: CAR_WIDTH,
    height: CAR_HEIGHT,
    fill: violation ? colors.red["A400"] : colors.lightBlue["A400"],
    y: H2 + y - 4,
    x: x - CAR_WIDTH
  });
};

export const Light: FunctionComponent<{ color: string; classes: Classes }> = ({
  color
}) =>
  CE("line", {
    x1: START,
    x2: START,
    y1: H2 - R2,
    y2: H2 + R2,
    strokeWidth: 6,
    stroke: color
  });

export const S0Line: FunctionComponent<{
  x: number;
  classes: Classes;
}> = (() => {
  const line1 = CE("line", {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: R2 - 10,
    stroke: colors.grey["500"],
    strokeWidth: "2px"
  });
  const line2 = CE("line", {
    x1: 0,
    x2: 0,
    y1: R2 + 11,
    y2: ROAD_WIDTH,
    stroke: colors.grey["500"],
    strokeWidth: "2px"
  });
  const math = (
    <foreignObject width="30" height="30" y={R2 - 11} x="-7">
      <TeX math="x_0" />
    </foreignObject>
  );
  return ({ x }: { x: number }) => (
    <g transform={`translate(${x},${H2 - R2})`}>
      {line1}
      {line2}
      {math}
    </g>
  );
})();

type XssdLineProps = {
  x: number;
  classes: Classes;
};
const XssdLine = (() => {
  let math = (
    <foreignObject width="40" height="50" x="-8" y="2">
      <TeX>{"x_{\\text{ssd}} "}</TeX>
    </foreignObject>
  );
  const res: FunctionComponent<XssdLineProps> = ({ x, classes }) => (
    <g transform={`translate(${x},${H2 + R2 + 3})`}>
      {x > 45 && (
        <foreignObject width="40" height="45" x={-x / 2 - 20} y={6}>
          <div className={classes.text}>CAN STOP</div>
        </foreignObject>
      )}
      <foreignObject width="40" height="45" x={(START - x) / 2 - 20} y={6}>
        <div className={classes.text}>CAN'T STOP</div>
      </foreignObject>
      {math}
      {CE("line", {
        markerStart: "url(#arrow)",
        stroke: colors.blue["400"],
        strokeWidth: 2,
        x2: -x,
        x1: 0
      })}
      {CE("line", {
        markerStart: "url(#arrow3)",
        markerEnd: "url(#arrow3)",
        stroke: colors.grey["400"],
        strokeWidth: 2,
        strokeDasharray: "2 2",
        x2: START - x,
        x1: 0
      })}
    </g>
  );
  return res;
})();

const XclLine = (() => {
  let math = (
    <foreignObject width="30" height="30" x="-8" y="-30">
      <TeX>{"x_{\\text{cl}} "}</TeX>
    </foreignObject>
  );

  const res: FunctionComponent<{ x: number; classes: Classes }> = ({
    x,
    classes
  }) => (
    <g transform={`translate(${x},${H2 - R2 - 3})`}>
      {math}
      <foreignObject width="45" height="45" x={START / 2 - x / 2 - 20} y={-35}>
        <div className={classes.text}>CAN CLEAR</div>
      </foreignObject>
      <foreignObject width="45" height="45" x={-x / 2 - 20} y={-35}>
        <div className={classes.text}>CAN'T CLEAR</div>
      </foreignObject>
      {CE("line", {
        markerEnd: "url(#arrow2)",
        markerStart: "url(#arrow2)",
        stroke: colors.deepOrange.A400,
        strokeWidth: 2,
        x2: 0,
        x1: START - x
      })}
      {CE("line", {
        markerEnd: "url(#arrow3)",
        stroke: colors.grey["400"],
        strokeWidth: 2,
        strokeDasharray: "2,2",
        x2: 0,
        x1: -x
      })}
    </g>
  );
  return res;
})();

const Vis: FunctionComponent<{
  mover: { x: number };
  stopper: { x: number };
  x0: number;
  lightColor: "red" | "green" | "yellow";
  xssd: number;
  xcl: number;
}> = ({ mover, stopper, x0, lightColor, xssd, xcl }) => {
  const classes = useStyles(EMPTY);
  return (
    <svg width={WIDTH} height={HEIGHT} className={classes.svg}>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 15 15"
          refY="5"
          refX="8"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          fill={colors.blue["400"]}
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="arrow2"
          viewBox="0 0 15 15"
          refY="5"
          refX="8"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          fill={colors.deepOrange.A400}
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
        <marker
          id="arrow3"
          viewBox="0 0 15 15"
          refY="5"
          refX="8"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
          fill={colors.grey["400"]}
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <g>
        {Road}
        <S0Line x={scale(x0)} classes={classes} />
        <XssdLine x={scale(xssd)} classes={classes} />
        <XclLine x={scale(xcl)} classes={classes} />
        <Light color={lightColors[lightColor]} classes={classes} />
        <Car x={scale(mover.x)} y={-15} violation={mover.x < -1 && x0 > xcl} />
        <Car x={scale(stopper.x)} y={15} violation={stopper.x < -1} />
      </g>
    </svg>
  );
};
export default Vis;
