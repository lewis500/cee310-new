import React, { useContext, useRef } from "react";
import * as ducks from "./ducks";
import useElementSize from "src/hooks/useElementSizeHook";
import makeStyles from "@mui/styles/makeStyles";
import * as colors from "@mui/material/colors";
import TexLabel from "src/sharedComponents/TexLabel";
import clsx from "clsx";
const EMPTY = {};

const makeRLabel = (center: number[], b: number[], r: number, Δ: number) => {
  return (
    <g
      transform={`translate(${(b[0] + center[0]) / 2}, ${(b[1] + center[1]) /
        2}) rotate(${-Δ / 2})`}
    >
      <circle fill="white" r="12" />
      <TexLabel x={0} y={0} dx={-6} dy={-11} latexstring="R" />
    </g>
  );
};

const MsLabel = ({ x, y }: { x: number; y: number }) => {
  return (
    <g transform={`translate(${x - 8}, ${y - 6})`}>
      {/* <circle fill="white" r="8" /> */}
      {/* <rect fill="white" width={4} height={12} x={6}/> */}
      <TexLabel x={0} y={0} dx={-1} dy={-3} latexstring="M_s" />
    </g>
  );
};

export default () => {
  const { state } = useContext(ducks.AppContext),
    classes = useStyles(EMPTY),
    containerRef = useRef<HTMLDivElement>(),
    dims = useElementSize(containerRef),
    rp = ducks.getRoadPoints(state, dims),
    Δ2 = ducks.getΔ2Rad(state);

  return (
    <div ref={containerRef} className={classes.container}>
      <svg className={classes.svg}>
        <circle
          r={rp.r}
          cx={rp.center[0]}
          cy={rp.center[1]}
          className={classes.circle}
        />
        <path d={ducks.getHinge(state, dims)} className={classes.hinge} />
        <path d={ducks.getRoadSides(state, dims)} className={classes.sides} />
        <path d={ducks.getRoadArc(state, dims)} className={classes.arc} />
        <path d={ducks.getRoadArc(state, dims)} className={classes.arc} />
        <path d={ducks.getTangents(state, dims)} className={classes.tangents} />
        <path d={ducks.getBlockPath(state, dims)} className={classes.hinge} />
        <rect
          className={clsx(classes.car, { [classes.braking]: state.braking })}
          width={8}
          height={5}
          transform={`translate(${ducks.getCar(state, dims).loc}) rotate(${
            ducks.getCar(state, dims).rotate
          }) translate(${-4},${-2.5})`}
        />

        <MsLabel
          x={ducks.getMsLabel(state, dims).x}
          y={ducks.getMsLabel(state, dims).y}
        />

        <rect
          className={classes.block}
          width="20px"
          height="20px"
          transform={`translate(${
            ducks.getBlockPoints(state, dims).block
          }) translate(${-10},${0})`}
        />
        <rect
          className={classes.car}
          width={8}
          height={5}
          transform={`translate(${
            ducks.getStoppedCar(state, dims).loc
          }) rotate(${
            ducks.getStoppedCar(state, dims).rotate
          }) translate(${4},${-2.5})`}
        />
        <TexLabel
          x={rp.center[0]}
          y={rp.center[1]}
          dx={-6}
          dy={-50}
          rotate={0}
          latexstring="\Delta"
        />
        <TexLabel
          x={rp.pvi[0]}
          y={rp.pvi[1]}
          dx={-12}
          dy={-17}
          rotate={0}
          latexstring="\text{PVI}"
        />
        <TexLabel
          x={rp.b[0]}
          y={rp.b[1]}
          dx={-12}
          dy={-22}
          rotate={-state.Δ / 2}
          latexstring="\text{PC}"
        />
        <TexLabel
          x={rp.c[0]}
          y={rp.c[1]}
          dx={-12}
          dy={-22}
          rotate={state.Δ / 2}
          latexstring="\text{PT}"
        />
        <circle cx={rp.pvi[0]} cy={rp.pvi[1]} r="2" className={classes.pvi} />
        <circle cx={rp.b[0]} cy={rp.b[1]} r="2" className={classes.pvi} />
        <circle cx={rp.c[0]} cy={rp.c[1]} r="2" className={classes.pvi} />
        <path
          d={`M${rp.center[0] + Math.sin(-Δ2) * 30},${rp.center[1] -
            Math.cos(-Δ2) * 30} A ${30} ${30} 0 0 1 ${rp.center[0] +
            Math.sin(Δ2) * 30} ${rp.center[1] - Math.cos(Δ2) * 30}
          `}
          stroke="black"
          strokeWidth="1px"
          fill="none"
        />
        {makeRLabel(rp.center, rp.b, rp.r, state.Δ)}
        {makeRLabel(rp.center, rp.c, rp.r, -state.Δ)}
      </svg>
    </div>
  );
};

const useStyles = makeStyles({
  laser: {
    fill: "none",
    "stroke-width": 12
    // "stroke-linecap": "round"
  },
  sides: {
    extend: "laser",
    stroke: colors.blueGrey["700"]
    // "stroke-linecap": ""
  },
  tangents: {
    stroke: colors.orange["A200"],
    strokeWidth: "1px",
    fill: "none",
    strokeDasharray: "2,2"
  },
  pvi: {
    stroke: "none",
    fill: colors.orange["A200"]
  },
  arc: {
    extend: "laser",
    stroke: colors.lightBlue["700"]
  },
  circle: {
    extend: "laser",
    strokeWidth: "1px",
    stroke: colors.green["500"],
    strokeDasharray: "2,3"
  },
  hinge: {
    extend: "laser",
    stroke: colors.pink["A700"],
    fill: "none",
    strokeWidth: "1px",
    strokeDasharray: "2,3"
    // strokeWidth: 2
  },
  svg: {
    display: "block",
    width: "100%",
    height: "100%",
    "& text": {
      fontSize: "13px"
    }
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  tangent: {
    stroke: colors.pink["A700"],
    strokeWidth: "2px",
    fill: "none"
  },
  connected: {
    stroke: colors.pink["A200"],
    strokeDasharray: "2, 2"
  },
  text: {
    textAlign: "center",
    fontSize: "12px",
  },
  car: {
    fill: colors.purple["200"],
    stroke: "white",
    rx: 1.5,
    ry: 1.5
  },
  braking: {
    fill: colors.red["A400"]
  },
  block: {
    fill: colors.green["A700"]
  }
});
