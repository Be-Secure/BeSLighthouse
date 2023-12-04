import React, { useState } from "react";

import HorizontalModelFuzzCard from "../../../assets/theme/components/card/HorizontalModelFuzzCard";
import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";

function ModelAttack({nameType, positionType, description, textSide, pathOfFile}: any) {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    verifyLink(link, setreport);
  }, []);
  return (
    <HorizontalModelFuzzCard
      name={nameType}
      position={positionType}
      description={description}
      textAllign={textSide}
      data={report}
    />
  );
}

export default ModelAttack;
