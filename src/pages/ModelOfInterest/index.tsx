import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import MKBox from "../../components/MKBox";
import routes from "../../routes";
import ModelDisplay from "./ModelDisplay";

function ModelOfInterest() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MKBox>
                <ModelDisplay />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ModelOfInterest;
