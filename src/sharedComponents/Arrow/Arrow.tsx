import React from "react";
export default React.memo(() => {
  return (
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 15 15"
        refY="5"
        refX="2"
        markerWidth="8"
        markerHeight="8"
        orient="auto-start-reverse"
        fill="black"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
  );
});
