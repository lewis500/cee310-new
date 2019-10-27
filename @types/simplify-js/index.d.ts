declare module "simplify-js" {
  interface Point {
    x: number;
    y: number;
  }

  function simplify(
    points: Point[],
    tolerance?: number,
    highQuality?: boolean
  ): Point[];
  // namespace simplify {}

  export = simplify;
}
