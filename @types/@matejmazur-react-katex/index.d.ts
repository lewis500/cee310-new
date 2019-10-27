/// <reference types="node" />
declare module "@matejmazur/react-katex" {
  import React from "react";
  const TeX: React.FunctionComponent<{
    children?: string;
    errorColor?: "string";
    //   renderError
    block?: boolean;
    math?: string;
    settings?: {};
    renderError?: (e: React.ErrorInfo) => void;
  }>;
  export default TeX;
}
