import React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import MKBox from "../../components/MKBox";
import { Card, Grid } from "@mui/material";
import ModelVulnerabilitiesDetailedTable from "./ModelVulnerabilitiesDetailedTable";


function ModelVulnerabilitiesDetailed() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MKBox>
                <ModelVulnerabilitiesDetailedTable />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ModelVulnerabilitiesDetailed;
