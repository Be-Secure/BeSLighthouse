import React, { useState } from "react";

import { useLocation } from "react-router-dom";
import { besecureMlAssessmentDataStore } from "../../../dataStore";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";
import Card from "@mui/material/Card";
import MKTypography from "../../../components/MKTypography";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MKBox from "../../../components/MKBox";

export const dividerDiv = () => {
  return <Divider sx={{ my: 0.5, color: "black" }} />;
};

function AttackReport({ data }: any) {
  return (
    <MKBox pl={1}>
      <MKTypography color="black" textAlign="left" sx={{ fontSize: "10px" }}>
        AttackType: {data["AttackType"]}
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={{ fontSize: "10px" }}>
        ModelInformation: {data["ModelInformation"]}
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={{ fontSize: "10px" }}>
        Time: {data["CreatedTimestamp"]}
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={{ fontSize: "10px" }}>
        AttackQueries: {data["AttackQueries"]}
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={{ fontSize: "10px" }}>
        VulnerabiltiyThreshold: {data["VulnerabiltiyThreshold"]}
      </MKTypography>
    </MKBox>
  );
}

function DataNotAvailable() {
  return (
    <MKTypography
      color="black"
      textAlign="center"
      variant="h6"
      sx={{ margin: "auto" }}
    >
      Not Available
    </MKTypography>
  );
}

function ModelAttack({ name, description, position }: any) {
  const location = useLocation();
  const selectedFuzz: any = location.state.selectedFuzz;
  const [report, setreport]: any = useState({});
  React.useEffect(() => {
    let link = `${besecureMlAssessmentDataStore}/${selectedFuzz.name}/fuzz-test/evasion/JobMetadata.json`;
    verifyLink(link, setreport);
  }, []);
  return (
    <Card
      style={{
        width: "100%",
        marginTop: "13px"
      }}
    >
      <MKTypography
        variant="h6"
        textAlign="center"
        sx={{ fontSize: "12px" }}
        color={position.color}
        pt={0.4}
        pb={0.4}
      >
        {name}
        <Icon fontSize="small" title={description}>
          info
        </Icon>
      </MKTypography>
      {dividerDiv()}
      {report && Object.values(report).length > 0 ? (
        <AttackReport data={report} />
      ) : (
        <DataNotAvailable />
      )}
    </Card>
  );
}

export default ModelAttack;
