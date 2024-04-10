import { Card, CardContent, Grid } from "@mui/material";
import * as React from "react";
import MKTypography from "../../../components/MKTypography";
import MKBox from "../../../components/MKBox";

export default function Scorecard({
  date,
  version,
  github,
  commit,
  score
}: any) {
  return (
    <Card sx={ { marginBottom: 4 } }>
      <CardContent key={ "CardContentkey" }>
        <Grid key={ "gridkey1" } container spacing={ 1 }>
          <Grid key={ "gridkey2" } item xs={ 4 }>
            <MKBox key="test" display="flex" py={ 1 } pr={ 2 }>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Date: &nbsp;
              </MKTypography>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                { date }
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid key={ "gridkey3" } item xs={ 4 }>
            <MKBox key="test" display="flex" py={ 1 } pr={ 2 }>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Scorecard Version: &nbsp;
              </MKTypography>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                { version }
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid key={ "gridkey3" } item xs={ 4 }>
            <MKBox key="test" display="flex" py={ 1 } pr={ 2 }>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                textTransform="capitalize"
              >
                OSSP: &nbsp;
              </MKTypography>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                { `https://${github}` }
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid key={ "gridkey3" } item xs={ 4 }>
            <MKBox key="test" display="flex" py={ 1 } pr={ 2 }>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Commit: &nbsp;
              </MKTypography>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                { commit }
              </MKTypography>
            </MKBox>
          </Grid>
          <Grid key={ "gridkey3" } item xs={ 4 }>
            <MKBox key="test" display="flex" py={ 1 } pr={ 2 }>
              <MKTypography
                variant="h6"
                fontWeight="bold"
                textTransform="capitalize"
              >
                Score: &nbsp;
              </MKTypography>
              <MKTypography variant="h6" fontWeight="regular" color="text">
                { score }
              </MKTypography>
            </MKBox>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
