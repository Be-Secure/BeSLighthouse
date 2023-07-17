// @flow

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from "react";
import GridRow from "./GridRow";
import GridCol from "./GridCol";


function Grid(props: any): any {
  return props.children;
}

Grid.Row = GridRow;
Grid.Col = GridCol;

Grid.displayName = "Grid";

/** @component */
export default Grid;
