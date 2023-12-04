import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import HorizontalModelFuzzCard from "../../../assets/theme/components/card/HorizontalModelFuzzCard";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses
} from "@mui/lab";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";

function RightFuzzing() {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/VulnerabilityReport.json`;
    verifyLink(link, setreport);
  }, []);
  return (
    <Grid container pr={2} pl={6} width="35%">
      <Grid item width={"100%"}>
        <MKBox mb={1} >
          <HorizontalModelFuzzCard
            position={{ color: "info", label: "" }}
            name="Attack Efficacy Graph"
            cardSide={true}
            textAllign="center"
            data={report}
          />
        </MKBox>
        <MKBox mb={1} >
          <HorizontalModelFuzzCard
            position={{ color: "info", label: "" }}
            name="Attack Efficacy Graph"
            cardSide={true}
            textAllign="center"
            data={report}
          />
        </MKBox>
        <MKBox mb={1}  >
          <HorizontalModelFuzzCard
            position={{ color: "info", label: "" }}
            name="Attack Efficacy Graph"
            cardSide={true}
            textAllign="center"
            data={report}
          />
        </MKBox>
        <MKBox mb={1}  >
          <HorizontalModelFuzzCard
            position={{ color: "info", label: "" }}
            name="Attack Efficacy Graph"
            cardSide={true}
            textAllign="center"
            data={report}
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default RightFuzzing;
