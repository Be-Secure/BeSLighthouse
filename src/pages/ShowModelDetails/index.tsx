import * as React from "react";
import Grid from "@mui/material/Grid";

import ShowModelContent from "./ShowModelContent";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import routes from "../../routes";
import AssessmentSummary, { verifyLink } from "./AssessmentSummary";
import { useParams } from "react-router-dom";
import { modelOfInterestData } from "../../dataStore";

function ShowModelDetails() {
  const [data, setData] = React.useState([]);
  const { modelName }: any = useParams();
  React.useEffect(() => {
    verifyLink(modelOfInterestData, setData);
  }, []);
  const model = data.filter((data: any) => data.name === modelName.slice(1));
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox pt={12} sx={{ mx: { xs: 2, lg: 3 } }}>
        <Grid container spacing={3} pt={3}>
          <Grid item xs={12} md={6} lg={7}>
            <ShowModelContent model={model} />
          </Grid>
          <Grid item xs={12} md={6} lg={5}>
            <AssessmentSummary selectedName={modelName.slice(1)} selectedModel={model}/>
          </Grid>
        </Grid>
      </MKBox>
    </>
  );
}

export default ShowModelDetails;
