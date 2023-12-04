import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import HorizontalModelFuzzCard from "../../../assets/theme/components/card/HorizontalModelFuzzCard";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";
import ModelAttack from "../AttackType/ModelAttack";

function LeftFuzzing() {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    verifyLink(link, setreport);
  }, []);
  return (
    <Grid container pr={2} width="35%">
      <Grid item width={"100%"}>
        <MKBox mb={1}>
          <ModelAttack
            positionType={{ color: "info", label: "Model Analysis Inputs" }}
            nameType="Evasion"
            description="Modify input data in a way that the AI model's predictions are manipulated."
            textSide="left"
          />
        </MKBox>
        <MKBox mb={1}>
          <HorizontalModelFuzzCard
            name="Inference"
            position={{ color: "info", label: "Model Analysis Inputs" }}
            description="Determine whether a specific data point was part of the training dataset."
            textAllign={"left"}
            data={report}
          />
        </MKBox>
        <MKBox mb={1}>
          <HorizontalModelFuzzCard
            name="Extraction"
            position={{ color: "info", label: "Model Analysis Inputs" }}
            description="Determine whether a specific data point was part of the training dataset."
            textAllign={"left"}
            data={report}
          />
        </MKBox>
        <MKBox mb={1}>
          <HorizontalModelFuzzCard
            name="Data Poisoning"
            position={{ color: "info", label: "Model Analysis Inputs" }}
            description="Determine whether a specific data point was part of the training dataset."
            textAllign={"left"}
            data={report}
          />
        </MKBox>
      </Grid>
    </Grid>
  );
}

export default LeftFuzzing;
