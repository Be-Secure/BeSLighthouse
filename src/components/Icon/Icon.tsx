// @flow

import * as React from "react";
import cn from "classnames";

function Icon({
  prefix: prefixFromProps = "fe",
  name,
  className,
  link,
  isAriaHidden,
  payment,
  flag,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: any): any {
  const prefix = (payment && "payment") || (flag && "flag") || prefixFromProps;
  const classes = cn(
    {
      [prefix]: true,
      [`${prefix}-${name}`]: true,
    },
    className
  );
  const extraProps: any = isAriaHidden
    ? {
        "aria-hidden": "true",
      }
    : null;

  const eventProps = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
  };

  return !link ? (
    <i className={classes} {...eventProps} />
  ) : (
    <a className="icon" {...extraProps} {...eventProps}>
      <i className={classes} />
    </a>
  );
}

Icon.displayName = "Icon";

/** @component */
export default Icon;
