
import * as React from "react";
import cn from "classnames";

function PageTitle({ className, children }: any): any {
  const classes = cn("page-title", className);
  return <h1 className={classes}>{children}</h1>;
}

PageTitle.displayName = "Page.Title";

export default PageTitle;
