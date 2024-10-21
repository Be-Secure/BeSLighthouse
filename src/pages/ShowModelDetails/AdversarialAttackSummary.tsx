import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tooltip, Icon } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { verifyLink } from "../../utils/verifyLink";

const TABLE_HEAD = [
  { id: "attackType", label: "Attack Type", alignRight: false },
  { id: "riskPosture", label: "Risk Posture", alignRight: false },
  { id: "defenceAvailable", label: "Defence Available", alignRight: false }
];

function riskPosture(attackMap: any, name: any) {
  try {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        { attackMap[name].vulnerability.overview.Alert }
      </TableCell>
    );
  } catch (e) {
    return (
      <TableCell align="left" sx={ { fontSize: "18px", padding: "8px" } }>
        NA
        <Tooltip title="Not Analyzed">
          <Icon
            sx={ {
              verticalAlign: "top", // Aligns the icon to the top
              fontSize: "14px",      // Adjust icon size
              marginLeft: "4px",     // Adds space between 'NA' and icon
              cursor: "pointer",
              color: "#607D8B"
            } }
          >
            <InfoOutlinedIcon />
          </Icon>
        </Tooltip>
      </TableCell>
    );
  }
}

function defenceAvailable(attackMap: any, name: any) {
  if (Object.values(attackMap[name].defence).length > 0) {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        Yes
      </TableCell>
    );
  } else {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        No
      </TableCell>
    );
  }
}

const AdversarialAttackSummary = ({ model }: any) => {
  const attackName = ["Evasion", "Extraction", "Inference", "Data Poisoning"];
  const { modelName }: any = useParams();
  const name: string = modelName.slice(1);
  const [evasion, evasionData]: any = React.useState({});
  const [extraction, extractionData]: any = React.useState({});
  const [inference, inferenceData]: any = React.useState({});
  const [dataPoisoning, dataPoisoningData]: any = React.useState({});
  const [inferenceDefence, inferenceDefenceData]: any = React.useState({});
  const [dataPoisoningDefence, dataPoisoningDefenceData]: any = React.useState(
    {}
  );
  const [evasionDefence, evasionDefenceData]: any = React.useState({});
  const [extractionDefence, extractionDefenceData]: any = React.useState({});
  useEffect(() => {
    const evasionLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/evasion/VulnerabilityReport.json`;
    const extractionLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/extraction/VulnerabilityReport.json`;
    const defenceForEvasion = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/evasion/DefenceReport.json`;
    const defenceForExtraction = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/extraction/DefenceReport.json`;
    const inferenceLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/inference/VulnerabilityReport.json`;
    const defenceForInference = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/inference/DefenceReport.json`;
    const dataPoisoningLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/dataPoisoning/VulnerabilityReport.json`;
    const defenceForDataPoisoning = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/fuzz-test/dataPoisoning/DefenceReport.json`;
    verifyLink(evasionLink, evasionData);
    verifyLink(extractionLink, extractionData);
    verifyLink(defenceForEvasion, evasionDefenceData);
    verifyLink(defenceForExtraction, extractionDefenceData);
    verifyLink(inferenceLink, inferenceData);
    verifyLink(defenceForInference, inferenceDefenceData);
    verifyLink(dataPoisoningLink, dataPoisoningData);
    verifyLink(defenceForDataPoisoning, dataPoisoningDefenceData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attackMap: any = {
    Evasion: {
      name: "evasion",
      defence: evasionDefence,
      vulnerability: evasion,
      reportAvability: (() => {
        return (
          Object.values(evasionDefence).length > 0 ||
          Object.values(evasion).length > 0
        );
      })()
    },
    Extraction: {
      name: "extraction",
      defence: extractionDefence,
      vulnerability: extraction,
      reportAvability: (() => {
        return (
          Object.values(extractionDefence).length > 0 ||
          Object.values(extraction).length > 0
        );
      })()
    },
    Inference: {
      name: "inference",
      defence: inferenceDefence,
      vulnerability: inference,
      reportAvability: (() => {
        return (
          Object.values(inferenceDefence).length > 0 ||
          Object.values(inference).length > 0
        );
      })()
    },
    "Data Poisoning": {
      name: "dataPoisoning",
      defence: dataPoisoningDefence,
      vulnerability: dataPoisoning,
      reportAvability: (() => {
        return (
          Object.values(dataPoisoningDefence).length > 0 ||
          Object.values(dataPoisoning).length > 0
        );
      })()
    }
  };
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead sx={ { display: "contents" } }>
            <TableRow>
              { TABLE_HEAD.map((headCell: any) => (
                <TableCell
                  sx={ {
                    color: "#637381",
                    backgroundColor: "#F4F6F8",
                    fontSize: "14px"
                  } }
                  key={ headCell.id }
                  align={ headCell.alignRight ? "right" : "left" }
                >
                  { headCell.label }
                </TableCell>
              )) }
            </TableRow>
          </TableHead>
          <TableBody>
            { attackName.map((nameOfAttack) => {
              return (
                <TableRow hover tabIndex={ -1 }>
                  <TableCell align="left" sx={ { fontSize: "18px" } }>
                    { nameOfAttack }
                  </TableCell>
                  { riskPosture(attackMap, nameOfAttack) }
                  { defenceAvailable(attackMap, nameOfAttack) }
                </TableRow>
              );
            }) }
          </TableBody>
        </Table>
      </TableContainer>
      <Typography color="black"
        pt={ 2 }
        pb={ 1 }
        style={ { fontSize: "12px", float: "right" } }>
        Powered by <a
          style={ {
            color: "grey",
            cursor: "pointer"
          } }
          href={ `https://www.boschaishield.com/` }
          title={ "Click to view boschaishield webpage" }
          target="_blank"
        >
          Bosch AIShield
        </a>
      </Typography>
    </>
  );
};

export default AdversarialAttackSummary;
