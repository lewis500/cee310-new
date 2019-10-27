import { useMemo } from "react";
import { scaleLinear } from "d3-scale";

export default (
  range: [number, number],
  domain: [number, number],
  dependencies: ReadonlyArray<any>
) =>
  useMemo(
    () =>
      scaleLinear()
        .domain(domain)
        .range(range),
    dependencies
  );
