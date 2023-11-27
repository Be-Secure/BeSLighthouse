import * as React from "react";
import Grid from "@mui/material/Grid";

import ShowModelContent from "./ShowModelContent";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import AssessmentSummary from "./AssessmentSummary";

function ShowModelDetails() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        <MKBox>
          <Grid container spacing={3} pt={3}>
            <Grid item xs={12} md={6} lg={7}>
              <ShowModelContent />
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <AssessmentSummary/>
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
    </>
  );
}

export default ShowModelDetails;
