import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import { projectOfInterestData } from "../../utils/poi_data";
import ShowModelContent from "./ShowModelContent";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";

export const fetchOsspoiMaterData = async () => {
  const osspoi: any = JSON.parse(
    await projectOfInterestData.getJsonReportOsspoiMaster()
  );
  projectOfInterestData.updateDataPoi("Project_of_interest", osspoi.items);
  return osspoi;
};

function ShowModelDetails() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={14} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MKBox pt={3} px={3}>
                <ShowModelContent />
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ShowModelDetails;
