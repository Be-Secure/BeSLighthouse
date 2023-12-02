import React from "react";

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

function LeftFuzzing() {
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
        position="left"
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <MKBox mb={1}>
              <HorizontalModelFuzzCard
                name="Evasion"
                position={{ color: "info", label: "Model Analysis Inputs" }}
                description="Modify input data in a way that the AI model's predictions are manipulated."
                textAllign={"left"}
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
                name="Inference"
                position={{ color: "info", label: "Model Analysis Inputs" }}
                description="Determine whether a specific data point was part of the training dataset."
                textAllign={"left"}
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
                name="Extraction"
                position={{ color: "info", label: "Model Analysis Inputs" }}
                description="Determine whether a specific data point was part of the training dataset."
                textAllign={"left"}
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
                name="Data Poisoning"
                position={{ color: "info", label: "Model Analysis Inputs" }}
                description="Determine whether a specific data point was part of the training dataset."
                textAllign={"left"}
              />
            </MKBox>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Grid>
  );
}

export default LeftFuzzing;
