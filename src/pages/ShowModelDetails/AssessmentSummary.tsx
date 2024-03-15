 
 
import Card from "@mui/material/Card";
import * as React from "react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import Grid from "@mui/material/Grid";
import { fetchJsonReport } from "../../utils/fatch_json_report";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import StaticAnalysisSummary from "./StaticAnalysisSummary";
import Divider from "@mui/material/Divider";
import AdversarialAttackSummary from "./AdversarialAttackSummary";

export const dividerDiv = (index: number) => {
  if (index !== 0) return <Divider sx={ { my: 1.5 } } />;
};

export const verifyLink = async (link: any, setLinkStatus: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      const data = JSON.parse(response);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus({});
    }
  } catch (error) {
    setLinkStatus({});
  }
};

function displayModelReport(linkStatus: any, selectedModel: any) {
  return (
    <>
      <AdversarialAttackSummary model={ selectedModel }/>
      { dividerDiv(1) }
      <StaticAnalysisSummary data={ linkStatus } model={ selectedModel }/>
    </>
  );
}

function assissmentReport(linkStatus: any, selectedModel: any) {
  return (
    <>
      <MKBox pt={ 2 } px={ 3 }>
        <MKTypography
          variant="h5"
          fontWeight="medium"
          style={ { textAlign: "center" } }
        >
          Assessment Summary
        </MKTypography>
      </MKBox>
      <MKBox p={ 2 }>
        <Grid item xs={ 12 }>
          { displayModelReport(linkStatus, selectedModel) }
        </Grid>
      </MKBox>
    </>
  );
}

const AssessmentSummary: React.FC<{selectedName: string, selectedModel: any}> = ({ selectedName, selectedModel }) => {
  const [linkStatus, setLinkStatus]: any = React.useState({});

  React.useEffect(() => {
    const link = `${besecureMlAssessmentDataStore}/${selectedName}/sast/${selectedName}-sast-summary-report.json`;
    verifyLink(link, setLinkStatus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card sx={ { height: "100%" } }>
      { Object.values(linkStatus).length > 0 ? (
        assissmentReport(linkStatus, selectedModel)
      ) : (
        <>
          <MKBox pt={ 2 } px={ 3 } sty>
            <MKTypography
              variant="h5"
              fontWeight="medium"
              style={ { textAlign: "center" } }
            >
              Assessment Summary
            </MKTypography>
          </MKBox>
          <MKTypography
            variant="h5"
            fontWeight="medium"
            style={ {
              textAlign: "center",
              margin: "auto",
              paddingLeft: "26px",
              paddingRight: "26px"
            } }
          >
            Please raise a request if you would like to get this model
            validated.
          </MKTypography>
        </>
      ) }
    </Card>
  );
};

export default AssessmentSummary;
