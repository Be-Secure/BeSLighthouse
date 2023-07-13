// @flow

import * as React from "react";
import PageTitle from "./PageTitle";
import PageSubTitle from "./PageSubTitle";
import PageOptions from "./PageOptions";


function PageHeader({ children, title, subTitle, options }: any): any{
  return (
    <div className="page-header">
      {title && <PageTitle>{title}</PageTitle>}
      {subTitle && <PageSubTitle>{subTitle}</PageSubTitle>}
      {options && <PageOptions>{options}</PageOptions>}
      {children}
    </div>
  );
}

PageHeader.displayName = "Page.Header";

export default PageHeader;
