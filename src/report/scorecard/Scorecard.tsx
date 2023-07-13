import { Card, CardContent, Grid } from "@mui/material";
import * as React from "react";
import { spanStyle } from "../../BesAssessmentReport";

export default function Scorecard({
  date,
  version,
  github,
  commit,
  score,
}: any) {
  return (
    <>
      <Card>
        <CardContent key={"CardContentkey"}>
          <Grid key={"gridkey1"} container spacing={1}>
            <Grid key={"gridkey2"} item xs={4}>
              <span style={spanStyle}>Date:</span> {date}
            </Grid>
            <Grid key={"gridkey3"} item xs={4}>
              <span style={spanStyle}>Scorecard Version:</span> {version}
            </Grid>
            <Grid key={"gridkey3"} item xs={4}>
              <span style={spanStyle}>OSSP:</span> {`https://${github}`}
            </Grid>
            <Grid key={"gridkey3"} item xs={4}>
              <span style={spanStyle}>Commit:</span> {commit}
            </Grid>
            <Grid key={"gridkey3"} item xs={4}>
              <span style={spanStyle}>Score:</span> {score}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
