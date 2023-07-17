// @flow

import * as React from "react";
import cn from "classnames";

function ButtonList({
  className,
  children,
  align = "",
  ...props
}: any): any {
  const classes = cn(
    { "btn-list": true, [`text-${align}`]: !!align },
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

ButtonList.displayName = "Button.List";

export default ButtonList;
