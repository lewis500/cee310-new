import React, {
  createElement as CE,
  useContext,
  useMemo,
  FC,
  memo,
  useRef
} from "react";
import { scaleLinear } from "d3-scale";
import { AppContext, getRange, vkMap, VKType } from "./ducks";
import * as params from "./constants";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import mo from "memoize-one";
import TexLabel from "src/sharedComponents/TexLabel";
import useElementSize from "src/hooks/useElementSizeHook";

const M = {
    top: 25,
    bottom: 30,
    left: 20,
    right: 90
  },
  gTranslate = `translate(${M.left},${M.top})`;

const KAxis = memo<{
    height: number;
    width: number;
    children?: React.ReactNode[];
  }>(({ height, width, children }) => (
    <g transform={`translate(0,${height})`}>
      <path
        d={`M0,0L${width},0`}
        fill="none"
        stroke="black"
        markerEnd="url(#arrow)"
      />
      {children}
    </g>
  )),
  QAxis = memo<{ height: number; children?: React.ReactNode[] }>(
    ({ height, children }) => (
      <g>
        <path
          d={`M0,0L0,${height}`}
          fill="none"
          stroke="black"
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
        {children}
      </g>
    )
  );

const memoizedvalues = mo((width, height) => {
  console.log(width);
  const qScale = scaleLinear()
      .range([height, 0])
      .domain([0, params.q0 * 1.2]),
    kScale = scaleLinear()
      .range([0, width])
      .domain([0, params.kj + 0.008]);
  return { qScale, kScale };
});

function marginer({ width, height }: { width: number; height: number }) {
  return {
    width: Math.max(width - M.left - M.right, 0),
    height: Math.max(height - M.top - M.bottom, 0)
  };
}
const EMPTY = {};
const QK: FC<{}> = () => {
  const { state } = useContext(AppContext),
    svgRef = useRef<HTMLDivElement>(),
    { width, height } = marginer(useElementSize(svgRef)),
    vk = vkMap[state.vk],
    classes = useStyles(EMPTY),
    { qScale, kScale } = memoizedvalues(width, height),
    QPath = useMemo(
      () =>
        getRange(70)
          .map((v, i, k) => (v / (k.length - 1)) * params.kj)
          .reduce((a, k) => a + kScale(k) + "," + qScale(k * vk(k)) + " ", "M"),
      [kScale, qScale, vk]
    );
  return (
    <div ref={svgRef} className={classes.container}>
      <svg className={classes.svg}>
        <g transform={gTranslate}>
          <mask id="myMask2">
            <rect width={width} height={height} fill="white" />
          </mask>
          <path mask="url(#myMask2)" className={classes.path} d={QPath} />
          <QAxis height={height}>
            <TexLabel x={-20} y={qScale(params.q0) - 10} latexstring="q_0" />
            <TexLabel x={-10} y={-25} latexstring="q \; \text{(veh/hr)}" />
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
            <TexLabel
              x={width + 10}
              y={-10}
              latexstring="k \; \text{(veh/km)}"
            />
          </KAxis>
        </g>
      </svg>
    </div>
  );
};
export default QK;

const useStyles = makeStyles({
  path: {
    strokeWidth: "4px",
    fill: "none",
    stroke: colors.lightBlue["A700"],
    opacity: 0.8
  },
  container: {
    position: "relative",
    width: "100%",
    height: "300px"
  },
  svg: {
    width: "100%",
    height: "100%",
    "& text": {
      fontFamily: "Puritan, san-serif",
      fontSize: "11px"
    }
  },
  text: {
    textAlign: "center",
    fontSize: "10px"
  }
});
