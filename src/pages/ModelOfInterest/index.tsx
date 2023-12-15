import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import MKBox from "../../components/MKBox";
import routes from "../../routes";
import ModelDisplay from "./ModelDisplay";
import MKTypography from "../../components/MKTypography";
import { useState } from "react";
import { verifyLink } from "../ShowModelDetails/AssessmentSummary";
import { modelOfInterestData } from "../../dataStore";

function ModelOfInterest() {
  const [report, setreport]: any = useState([]);
  React.useEffect(() => {
    verifyLink(modelOfInterestData, setreport);
  }, []);
  const count = modelOfInterestData.length
  console.log(count)
  // debugger
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <Grid container spacing={3}>
       <Grid item xs={12} md={6} lg={6}>
        <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 }}}>
        <Card sx={{ height: "100%", width: "30%"}}>
          <MKBox pt={1} pb={1} px={1}>
            <MKTypography
                display="flex"
                justifyContent="center"
                alignItems="center"
                variant="h5"
                textTransform="capitalize"
                // style={{fontSize: "30px"}}
                
                >
                Model Count
              </MKTypography>
              <MKTypography
                display="flex"
                justifyContent="center"
                alignItems="center"
                variant="h5"
                textTransform="capitalize"
                style={{fontSize: "40px"}}
                
                >
                {count}
              </MKTypography>
          </MKBox>
        </Card>
        </MKBox>
      </Grid>
      <Grid container spacing={3}>
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 }}}>
        <Card sx={{ height: "100%", width: "30%"}}>
          <MKBox pt={1} pb={1} px={1}>
          </MKBox>
        </Card>
      </MKBox>
      </Grid>
      </Grid>
        <MKBox pt={5} sx={{ mx: { xs: 2, lg: 3 } }}>
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
