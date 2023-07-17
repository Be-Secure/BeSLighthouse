// @flow

import * as React from "react";
import cn from "classnames";
import Container from "../Container";
import Grid from "../Grid";
import Nav from "../Nav";
// import { Container, Grid, Nav } from "../..";

const SiteNav = ({
  children,
  items,
  itemsObjects,
  withSearchForm = true,
  rightColumnComponent,
  collapse = true,
  routerContextComponentType,
}: any): any => {
  const classes = cn("header d-lg-flex p-0", { collapse });
  return (
    <div className={classes}>
      <Container>
        {children || (
          <Grid.Row className="align-items-center">
            <Grid.Col lg={3} className="ml-auto" ignoreCol={true}>
              {/* @TODO: add InlineSearchForm  */}
              {/* {rightColumnComponent || (withSearchForm && <InlineSearchForm />)} */}
              {rightColumnComponent}
            </Grid.Col>
            <Grid.Col className="col-lg order-lg-first">
              <Nav
                tabbed
                className="border-0 flex-column flex-lg-row"
                items={items}
                itemsObjects={itemsObjects}
                routerContextComponentType={routerContextComponentType}
              />
            </Grid.Col>
          </Grid.Row>
        )}
      </Container>
    </div>
  );
};

SiteNav.displayName = "Site.Nav";

export default SiteNav;
