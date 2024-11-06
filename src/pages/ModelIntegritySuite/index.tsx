import React from "react";
import routes from "../../routes";
import MKBox from "../../components/MKBox";
import { Card, Grid } from "@mui/material";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import ModelIntegritySuiteTable from "./ModelIntegritySuiteTable";

function ModelIntegritySuite() {
  return (
    <>
      <DefaultNavbar routes={ routes } sticky />
      <MKBox pt={ 14 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <Grid container spacing={ 6 }>
          <Grid item xs={ 12 }>
            <Card>
              <MKBox>
                <ModelIntegritySuiteTable />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ModelIntegritySuite;
