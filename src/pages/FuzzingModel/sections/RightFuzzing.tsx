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
    <Grid container pr={2} pt={1} width="35%">
      <Timeline
        sx={{
          m: 0,
          p: 0,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0
          }
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: "#f0f2f5" }} />
            <TimelineDot color="secondary" />
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                position={{ color: "info", label: "" }}
                name="Attack Efficacy Graph"
                cardSide={true}
                textAllign="center"
                data={report}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            <TimelineDot color="secondary" />
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                position={{ color: "info", label: "" }}
                name="Attack Efficacy Graph"
                cardSide={true}
                textAllign="center"
                data={report}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            <TimelineDot color="secondary" />
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                position={{ color: "info", label: "" }}
                name="Attack Efficacy Graph"
                cardSide={true}
                textAllign="center"
                data={report}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            <TimelineDot color="secondary" />
            <TimelineConnector sx={{ bgcolor: "#f0f2f5" }} />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                position={{ color: "info", label: "" }}
                name="Attack Efficacy Graph"
                cardSide={true}
                textAllign="center"
                data={report}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Grid>
  );
}

export default RightFuzzing;
