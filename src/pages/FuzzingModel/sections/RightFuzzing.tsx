import React from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import HorizontalModelFuzzCard from "../../../assets/theme/components/card/HorizontalModelFuzzCard";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator, timelineItemClasses } from "@mui/lab";

function RightFuzzing() {
  return (
    <Grid container pr={2} width="35%">
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
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                name=""
                position={{ color: "info", label: "" }}
                description="Attack Efficacy Graph"
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                name=""
                position={{ color: "info", label: "" }}
                description="Attack Efficacy Graph"
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                name=""
                position={{ color: "info", label: "" }}
                description="Attack Efficacy Graph"
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                name=""
                position={{ color: "info", label: "" }}
                description="Attack Efficacy Graph"
                cardSide={true}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Grid>
  );
}

export default RightFuzzing;
