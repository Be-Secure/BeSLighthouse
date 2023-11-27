import Card from "@mui/material/Card";
import * as React from "react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import Grid from "@mui/material/Grid";
import { fetchJsonReport } from "../../utils/fatch_json_report";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import DisplayRepository from "./DisplayRepository";
import DisplayModelReport from "./DisplayModelReport";
import DisplayFileReport from "./DisplayFileReport";
import { useLocation } from "react-router-dom";

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

function displayFiles(linkStatus: any) {
  return <DisplayFileReport data={linkStatus} />;
}

function displayModelReport(linkStatus: any) {
  const sizeOfSummary = Object.values(linkStatus).length;
  if (sizeOfSummary !== 0) {
    return (
      <>
        {displayRepository(linkStatus)}
        {displaymodel(linkStatus)}
        {displayFiles(linkStatus)}
      </>
    );
  }
}
function AssessmentSummary() {
  const [linkStatus, setLinkStatus]: any = React.useState({});

  const location = useLocation();
  const selectedMenu: any = location.state.selectedMenu;
  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${selectedMenu.name}/vulnerabilities/${selectedMenu.name}-vulnerabilities-summary-report.json`;
    debugger;
    verifyLink(link, setLinkStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card sx={{ height: "100%" }}>
      <MKBox pt={3} px={3}>
        <MKTypography variant="h5" fontWeight="medium">
          Assessment Summary
        </MKTypography>
        <MKBox mt={0} mb={2}></MKBox>
      </MKBox>
      <MKBox p={2}>
        <Grid item xs={12}>
          {displayModelReport(linkStatus)}
        </Grid>
      </MKBox>
    </Card>
  );
}

export default AssessmentSummary;
