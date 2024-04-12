import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { dividerDiv } from "./AssessmentSummary";

const repository = ["Repository Type", "Repository URL"];

export default function DisplayRepository({ data }: any): any {
  return repository.map((value, index) => {
    return (
      <>
        { dividerDiv(index) }
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle1" color="inherit">
              { value }
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  { value === "Repository URL" ? (
                    <a
                      style={ { color: "#587f2f", cursor: "pointer" } }
                      href={ data[value] }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                  ) : (
                    data[value]
                  ) }
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  });
}
