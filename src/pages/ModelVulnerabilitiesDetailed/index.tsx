import React from "react";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import MKBox from "../../components/MKBox";
import { Card, Grid } from "@mui/material";
import ModelVulnerabilitiesDetailedTable from "./ModelVulnerabilitiesDetailedTable";
import MKTypography from "../../components/MKTypography";
import watchtowerLogo from "../../assets/images/AIShield-watchtower-final-logo.png"


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

        <Grid pt={47} container style={{ width: "100%", placeContent: "center", alignItems: "center", height: "fit-content", position: "fixed", bottom: 0 }}>
      <Grid item>

      <MKTypography style={{ fontSize: "12px" }}>
      Powered by 
      </MKTypography>
      </Grid>
      <Grid item style={{ paddingLeft: "8px" }}>

      <img style={{ width: "70px", height: "30px" }} src={watchtowerLogo} />
      </Grid>
      </Grid>
    </>
  );
}

export default ModelVulnerabilitiesDetailed;
