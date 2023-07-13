// @flow

import * as React from "react";
import Container from "../Container";
import Grid from "../Grid";
import Card from "../Card";


function PageCard({
  children,
  title,
  header,
  footer,
  RootComponent,
}: any): any {
  return (
    <div className="my-3 my-md-5">
      <Container>
        <Grid.Row>
          <Grid.Col width={12}>
            <Card RootComponent={RootComponent}>
              {title && (
                <Card.Header>
                  <Card.Title>{title}</Card.Title>
                </Card.Header>
              )}
              {header}
              <Card.Body>{children}</Card.Body>
              {footer}
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Container>
    </div>
  );
}

PageCard.displayName = "Page.Card";

export default PageCard;
