// @flow

import * as React from "react";

import SiteWrapper from "./SiteWrapper";
import { Card, Grid } from "@mui/material";

import YourSvgComponent from "./image/favicon.png";
import Page from "./components/Page";

function Home() {
  return (
    <SiteWrapper>
      <Page.Content title="Home">
        <Card sx={{ width: "100%", height: 600 }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Grid item>
              <img src={YourSvgComponent} alt="Icon" />
            </Grid>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 400,
                lineHeight: "2.5rem",
              }}
            >
              Community Dashboard for security assessment of Open Source
              Security Tech Stacks
            </h1>
          </Grid>
        </Card>
      </Page.Content>
    </SiteWrapper>
  );
}

export default Home;
