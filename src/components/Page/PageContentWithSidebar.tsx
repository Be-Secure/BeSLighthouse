// @flow

import * as React from "react";
import Page from "./Page";
import Grid from "../Grid";
// import { Page, Grid } from "../";



function PageContentWithSidebar({
  children,
  header,
  sidebar,
}: any): any {
  return (
    <Page.Content>
      {header}
      <Grid.Row>
        <Grid.Col lg={3} className="order-lg-1 mb-4">
          {sidebar}
        </Grid.Col>
        <Grid.Col lg={9}>{children}</Grid.Col>
      </Grid.Row>
    </Page.Content>
  );
}

PageContentWithSidebar.displayName = "Page.ContentWithSidebar";

export default PageContentWithSidebar;
