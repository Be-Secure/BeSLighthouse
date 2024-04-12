import { Card } from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import MKTypography from "../../components/MKTypography";

export const dividerDiv = (index: number) => {
  if (index !== 0) return <Divider sx={ { my: 1.5 } } />;
};

const card = ["Critical", "High", "Medium", "Low"];

export default function StaticAnalysisSummary({ data, model }: any): any {
  const selectedMenu: { name: string } = model.length > 0 ? model[0] : {};
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography color="black">Static Analysis Summary</Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" color="inherit">
                <a
                  style={ {
                    color:
                      Object.values(data).length === 0 ? "#808080" : "#587f2f",
                    cursor:
                      Object.values(data).length === 0 ? "default" : "pointer"
                  } }
                  href={
                    Object.values(data).length === 0
                      ? ""
                      : `/BeSLighthouse/model_vulnerabilities_detailed/:${selectedMenu.name}`
                  }
                  title={
                    Object.values(data).length === 0
                      ? "Data not available"
                      : "Click to view detailed report."
                  }
                >
                  Detailed Report
                </a>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      { Object.values(data).length === 0 ? (
        <MKTypography
          color="black"
          textAlign="center"
          sx={ { fontSize: "17px", paddingTop: "18px" } }
        >
          Static Analysis Data Not Available
        </MKTypography>
      ) : (
        <Grid
          container
          spacing={ 2 }
          pt={ 6 }
          pl={ 2 }
          justifyContent="space-between"
        >
          { card.map((value) => {
            return (
              <Card
                style={ {
                  backgroundColor: "rgb(243, 246, 244)",
                  width: "20%",
                  alignItems: "center",
                  paddingBottom: "4px",
                  paddingTop: "4px"
                } }
              >
                <MKTypography
                  color="black"
                  textAlign="left"
                  sx={ { fontSize: "17px" } }
                >
                  { value }
                </MKTypography>
                <MKTypography
                  color="black"
                  textAlign="left"
                  sx={ { fontSize: "30px" } }
                >
                  { data["Total Model Vulnerabilities Found"][value] }
                </MKTypography>
              </Card>
            );
          }) }
        </Grid>
      ) }
      <MKTypography
        pt={ 1 }
        style={ { float: "right", fontSize: "12px" } }
      >
        Powered by <a
          style={ {
            color: "grey",
            cursor: "pointer"
          } }
          href={ `https://github.com/bosch-aisecurity-aishield/watchtower` }
          title={ "Click to go to AIShield Watchtower repo" }
          target="_blank"
        >
          AIShield Watchtower
        </a>
      </MKTypography>
    </>
  );
}
