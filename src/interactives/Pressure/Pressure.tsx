import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import colors from "material-colors";
import styled from "@emotion/styled";
import range from "lodash.range";

const useStyles = makeStyles({
  pressure: {
    display: "flex",
    width: "600px",
    alignItems: "center",
    // textAlign:'center'
  },
});

const W = 800,
  H = 200,
  M = 20;

const MySVG = styled.svg`
  width: ${W}px;
  height: ${H + M}px;
`;
const Road = () => <rect width={W} height={H} fill={colors.grey["300"]} />;

// const Road = styled.circle`
//   stroke: ${colors.grey["700"]};
//   stroke-width: 30px;
//   fill: none;
// `;

// const Vis = () => {
//   return <MySVG></MySVG>;
// };

const Rects = () => {
  return (
    <>
      {range(0, W / 4).map((i) => {
        return range(0, H / 4).map((j) => {
          return (
            <rect
              key={`${i}${j}`}
              x={i * 4}
              y={j * 4}
              stroke={"#555"}
              fill="white"
              width="4"
              height="4"
            />
          );
        });
      })}
    </>
  );
};

const R = 50;

const Tire = () => (
  <circle r={R} cx={W / 2} cy={R} stroke="#000" strokeWidth={30} fill="none" />
);

export default () => {
  const styles = useStyles();
  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <MySVG>
        <g transform="translate(0,30)">
          <Tire />
          <g transform={`translate(0,${2 * R - 5})`}>
            <Road />
            <Rects />
          </g>
        </g>
      </MySVG>

      <div>hello</div>
    </Stack>
  );
  //   return <div className={styles.pressure}>hello</div>;
};
