
import * as React from "react";
import cn from "classnames";



function GridRow({
  className,
  children,
  cards,
  deck,
  gutters = "",
  alignItems = "",
  justifyContent = "",
}: any): any {
  const classes: string = cn(
    `row`,
    {
      row: true,
      "row-cards": cards,
      "row-deck": deck,
      [`gutters-${gutters}`]: gutters,
      [`align-items-${alignItems}`]: alignItems,
      [`justify-content-${justifyContent}`]: justifyContent,
    },
    className
  );
  return <div className={classes}>{children}</div>;
}

GridRow.displayName = "Grid.Row";

/** @component */
export default GridRow;
