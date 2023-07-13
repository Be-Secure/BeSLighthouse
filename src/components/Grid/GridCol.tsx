
import * as React from "react";
import cn from "classnames";

function GridCol({
  className,
  children,
  width = 0,
  xs = 0,
  sm = 0,
  md = 0,
  lg = 0,
  xl = 0,
  xsAuto,
  smAuto,
  mdAuto,
  lgAuto,
  xlAuto,
  auto,
  offset = 0,
  offsetXs = 0,
  offsetSm = 0,
  offsetMd = 0,
  offsetLg = 0,
  offsetXl = 0,
  ignoreCol = false,
}: any): any {
  const classes = cn(
    {
      col: !ignoreCol,
      [`col-${width}`]: width,
      [`col-xs-${xs}`]: xs,
      [`col-xs-auto`]: xsAuto,
      [`col-sm-${sm}`]: sm,
      [`col-sm-auto`]: smAuto,
      [`col-md-${md}`]: md,
      [`col-md-auto`]: mdAuto,
      [`col-lg-${lg}`]: lg,
      [`col-lg-auto`]: lgAuto,
      [`col-xl-${xl}`]: xl,
      [`col-xl-auto`]: xlAuto,
      "col-auto": auto,
      [`offset-${offset}`]: offset,
      [`offset-xs-${offsetXs}`]: offsetXs,
      [`offset-sm-${offsetSm}`]: offsetSm,
      [`offset-md-${offsetMd}`]: offsetMd,
      [`offset-lg-${offsetLg}`]: offsetLg,
      [`offset-xl-${offsetXl}`]: offsetXl,
    },
    className
  );
  return <div className={classes}>{children}</div>;
}

GridCol.displayName = "Grid.Col";

/** @component */
export default GridCol;
