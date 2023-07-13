// @flow

import * as React from "react";
import cn from "classnames";
import PageHeader from "./PageHeader";
import Container from "../Container";



function PageContent({
  className,
  children,
  title,
  subTitle,
  options,
}: any): any {
  const classes = cn("page-content", className);
  return (
    <div className={classes}>
      <Container>
        {(title || subTitle || options) && (
          <PageHeader title={title} subTitle={subTitle} options={options} />
        )}
        {children}
      </Container>
    </div>
  );
}

PageContent.displayName = "Page.Content";

export default PageContent;
