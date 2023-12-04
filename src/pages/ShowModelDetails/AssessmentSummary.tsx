import Card from "@mui/material/Card";
import * as React from "react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import Grid from "@mui/material/Grid";
import { fetchJsonReport } from "../../utils/fatch_json_report";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import DisplayRepository, { dividerDiv } from "./DisplayRepository";
import DisplayModelReport from "./DisplayModelReport";
import { Link, NavLink, useLocation } from "react-router-dom";
import MKButton from "../../components/MKButton";

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      let data = JSON.parse(response);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus({});
    }
  } catch (error) {
    setLinkStatus({});
  }
};

function displayRepository(linkStatus: any) {
  return <DisplayRepository data={linkStatus} />;
}

function displaymodel(linkStatus: any) {
  return <DisplayModelReport data={linkStatus} />;
}

function displayModelReport(linkStatus: any) {
  const sizeOfSummary = Object.values(linkStatus).length;
  if (sizeOfSummary !== 0) {
    return (
      <>
        {displayRepository(linkStatus)}
        {displaymodel(linkStatus)}
      </>
    );
  }
}
function AssessmentSummary() {
  const [linkStatus, setLinkStatus]: any = React.useState({});

  const location = useLocation();
  const selectedMenu: any = location.state.selectedMenu;
  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${selectedMenu.name}/sast/${selectedMenu.name}-sast-summary-report.json`;
    verifyLink(link, setLinkStatus);
  }, []);
  return (
    <Card sx={{ height: "100%" }}>
      <MKBox pt={2} px={3}>
        <MKTypography
          variant="h5"
          fontWeight="medium"
          style={{ textAlign: "center" }}
        >
          Assessment Summary
        </MKTypography>
      </MKBox>
      <MKBox p={2}>
        <Grid item xs={12}>
          {displayModelReport(linkStatus)}

          {dividerDiv(1)}
          <NavLink
            to={{
              pathname: `/BeSLighthouse/model_fuzzing/:${selectedMenu.name}`,
              search: ""
            }}
            state={{ selectedFuzz: selectedMenu }}
            style={{ color: "#587f2f", cursor: "pointer" }}
          >
            <MKButton
              variant={"gradient"}
              color={"info"}
              size="Large"
              sx={{ width: "100%" }}
            >
              Model Security
            </MKButton>
          </NavLink>
        </Grid>
      </MKBox>
    </Card>
  );
}

export default AssessmentSummary;
