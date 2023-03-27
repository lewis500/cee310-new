import React, {
  createElement as CE,
  useContext,
  useMemo,
  FC,
} from "react";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { AppContext, getRange, vkMap, VKType } from "./ducks";
import * as params from "./constants";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import mo from "memoize-one";
import TexLabel from "src/sharedComponents/TexLabel";

const colorScale:ScaleLinear<number,string> = scaleLinear()
  .range([colors.red["A700"], colors.green["A700"]])
  .domain([0, params.vf]);

const M = {
    top: 25,
    bottom: 30,
    left: 20,
    right: 50
  },
  gTranslate = `translate(${M.left},${M.top})`;

const memoizedvalues = mo((width, height, classes) => {
  const vScale = scaleLinear()
      .range([height, 0])
      .domain([0, params.vf * 1.2]),
    xScale = scaleLinear()
      .range([height, 0])
      .domain([0, params.total - params.carLength]),
    kScale = scaleLinear()
      .range([0, width])
      .domain([0, params.kj + 0.008]),
    carLength = height - xScale(params.carLength),
    carWidth = height - xScale(params.carWidth),
    Road = CE("path", {
      className: classes.road,
      strokeWidth: height - xScale(params.roadWidth),
      d: `M0,0L0,${height}`
    });
  return { vScale, xScale, kScale, carLength, carWidth, Road };
});

const VK: FC<{ width: number; height: number }> = ({ width, height }) => {
  const { state } = useContext(AppContext),
    vk = vkMap[state.vk],
    classes = useStyles({
      width: width + M.right + M.left,
      height: height + M.top + M.bottom
    }),
    { vScale, xScale, kScale, carLength, carWidth, Road } = memoizedvalues(
      width,
      height,
      classes
    ),
    VPath = useMemo(
      () =>
        CE("path", {
          className: classes.path,
          d: getRange(70)
            .map((v, i, k) => (v / (k.length - 1)) * params.kj)
            .reduce((a, k) => a + kScale(k) + "," + vScale(vk(k)) + " ", "M")
        }),
      [kScale, vScale, vk]
    );
  return (
    <svg className={classes.svg}>
      <g transform={gTranslate}>
        <mask id="myMask">
          <rect width={width} height={height} fill="white" />
        </mask>
        <g mask="url(#myMask)">
          {state.lanes.map((d, i) => (
            <g key={d.k} transform={`translate(${kScale(d.k)},0)`}>
              {Road}
              {d.cars.map((x, j) => (
                <rect
                  key={j}
                  className={classes.car}
                  y={xScale(x)}
                  x={-carWidth / 2}
                  height={carLength}
                  fill={colorScale(vk(d.k))}
                  width={carWidth}
                />
              ))}
            </g>
          ))}
          {VPath}
        </g>

        <g id="vaxis">
          <path
            d={`M0,0L0,${height}`}
            fill="none"
            stroke="black"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <TexLabel x={-20} y={vScale(params.vf) - 10} latexstring="v_f" />
          <TexLabel x={-10} y={-25} latexstring="v \; \text{(km/hr)}" />
        </g>

        <g transform={`translate(0,${height})`} id="kaxis">
          <path
            d={`M0,0L${width},0`}
            fill="none"
            stroke="black"
            markerEnd="url(#arrow)"
          />
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
          <TexLabel
            x={width }
            y={-15}
            rotate={0}
            latexstring="\text{(veh/km)}"
          />
        </g>
      </g>
    </svg>
  );
};
export default VK;

const useStyles = makeStyles<{}, { width: number; height: number }>({
  path: {
    strokeWidth: "4px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
  road: {
    stroke: colors.grey["300"]
  },
  car: {
    // fill: colors.purple["A200"],
    rx: 1,
    ry: 1,
    stroke: "none"
  },
  svg: ({ width, height }) => ({
    width,
    height,
    display: "block",
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "11px"
    }
  }),
  text: {
    textAlign: "center",
    fontSize: "10px"
    // fontFamily: "Puritan, sans-serif"
  }
});
