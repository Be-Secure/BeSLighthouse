import React from "react";

import Card from "@mui/material/Card";
import MKTypography from "../../../components/MKTypography";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import MKBox from "../../../components/MKBox";

export const dividerDiv = () => {
  return <Divider sx={ { my: 0.5, color: "black" } } />;
};

function AttackReport({ data }: any) {
  return (
    <MKBox pl={ 1 }>
      <MKTypography color="black" textAlign="left" sx={ { fontSize: "12px" } }>
        AttackType: { data.AttackType }
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={ { fontSize: "12px" } }>
        ModelInformation: { data.ModelInformation }
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={ { fontSize: "12px" } }>
        Time: { data.CreatedTimestamp }
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={ { fontSize: "12px" } }>
        AttackQueries: { data.AttackQueries }
      </MKTypography>
      <MKTypography color="black" textAlign="left" sx={ { fontSize: "12px" } }>
        VulnerabiltiyThreshold: { data.VulnerabiltiyThreshold }
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
      sx={ { margin: "auto" } }
      p={ 3.3 }
    >
      Not Analyzed
    </MKTypography>
  );
}

function ModelAttack({ name, description, position, keyvalue, report }: any) {
  return (
    <Card
      style={ {
        width: "100%",
        marginTop: "13px"
      } }
    >
      <div id={ (report && Object.values(report).length > 0 && name === 'Data Poisoning') ? keyvalue : '' }>
        <MKTypography
          variant="h6"
          textAlign="center"
          sx={ { fontSize: "12px" } }
          color={ position.color }
          pt={ 0.4 }
          pb={ 0.4 }
        >
          { name }
          <Icon sx={ { fontSize: "1rem !important" } } title={ description }>
            info
          </Icon>
        </MKTypography>
      </div>
      { dividerDiv() }
      { report && Object.values(report).length > 0 ? (
        <div id={ name === 'Data Poisoning' ? '' : keyvalue }>
          <AttackReport data={ report } />
        </div>
      ) : (
        <DataNotAvailable />
      ) }
    </Card>
  );
}

export default ModelAttack;
