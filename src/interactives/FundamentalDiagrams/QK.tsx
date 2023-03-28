import React, { useContext, useMemo, memo } from "react";
import { scaleLinear } from "d3-scale";
import { AppContext, getRange, vkMap, VKType, getQ0 } from "./ducks";
import * as params from "./constants";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import mo from "memoize-one";
import TexLabel from "src/sharedComponents/TexLabel";

const M = {
    top: 25,
    bottom: 30,
    left: 20,
    right: 50
  },
  gTranslate = `translate(${M.left},${M.top})`,
  KAxis = memo<{
    height: number;
    width: number;
    children?: React.ReactNode[];
  }>(({ height, width, children }) => (
    <g transform={`translate(0,${height})`}>
      <path d={`M0,0L${width},0`} fill="none" stroke="black" />
      {children}
    </g>
  )),
  QAxis = memo<{ height: number; children?: React.ReactNode[] }>(
    ({ height, children }) => (
      <g>
        <path d={`M0,0L0,${height}`} fill="none" stroke="black" />
        {children}
      </g>
    )
  ),
  memoizedvalues = mo((width, height) => {
    const qScale = scaleLinear()
        .range([height, 0])
        .domain([0, params.q0 * 1.2]),
      kScale = scaleLinear()
        .range([0, width])
        .domain([0, params.kj + 0.008]);
    return { qScale, kScale };
  });

// cons

export default ({ width, height }: { width: number; height: number }) => {
  const { state } = useContext(AppContext),
    vk = vkMap[state.vk],
    classes = useStyles({
      width: width + M.left + M.right,
      height: height + M.top + M.bottom
    }),
    { qScale, kScale } = memoizedvalues(width, height),
    QPath = useMemo(
      () =>
        getRange(70)
          .map((v, i, k) => (v / (k.length - 1)) * params.kj)
          .reduce((a, k) => a + kScale(k) + "," + qScale(k * vk(k)) + " ", "M"),
      [kScale, qScale, vk]
    );
  return (
    <svg className={classes.svg}>
      <g transform={gTranslate}>
        <mask id="myMask2">
          <rect width={width} height={height} fill="white" />
        </mask>
        <path mask="url(#myMask2)" className={classes.path} d={QPath} />
        <QAxis height={height}>
          <TexLabel x={-20} y={qScale(getQ0(state)) - 10} latexstring="q_0" />
          <TexLabel x={-10} y={-25} latexstring="\text{(veh/hr)}" />
        </QAxis>
        <KAxis height={height} width={width}>
          <TexLabel
            x={
              kScale(
                state.vk === VKType.GREENSHIELDS ? params.kj / 2 : params.k0
              ) - 4
            }
            y={0}
            latexstring="k_0"
          />
          <TexLabel x={kScale(params.kj) - 4} y={0} latexstring="k_j" />
          <TexLabel x={width} y={-15} latexstring="\text{(veh/km)}" />
        </KAxis>
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
  svg: ({ width, height }: { width: number; height: number }) => ({
    // width: "100%",
    width,
    height,
    // height: "100%",
    "& text": {
      fontSize: "11px"
    }
  }),
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
