import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import CheckIcon from '../../assets/images/checked.png';
import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { dividerDiv, verifyLink } from "./AssessmentSummary";
import MKButton from "../../components/MKButton";
import axios from "axios";
import { generatePdfFromJson } from "../../utils/OsarPdf";

const TABLE_HEAD = [
  { id: "attackType", label: "Attack Type", alignRight: false },
  { id: "riskPosture", label: "Risk Posture", alignRight: false },
  { id: "defenceAvailable", label: "Defence Available", alignRight: false }
];

export async function checkFileExists(url: string, status: any) {
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      status(true);
    } else {
      status(false);
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      status(false);
    } else {
      status(false);
    }
  }
}

function riskPosture(attackMap: any, name: any) {
  try {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        { attackMap[name].vulnerability.overview.Alert }
      </TableCell>
    );
  } catch (e) {
    return (
      <TableCell align="left" sx={ { fontSize: "18px" } }>
        Not Analyzed
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

function attackGraph(selectedMenu: { name: string }, attackMap: any) {
  if (
    attackMap.Evasion.reportAvability ||
    attackMap.Extraction.reportAvability ||
    attackMap.Inference.reportAvability ||
    attackMap["Data Poisoning"].reportAvability
  ) {
    return (
      <NavLink
        to={ {
          pathname: `/BeSLighthouse/model_fuzzing/:${selectedMenu.name}`,
          search: ""
        } }
        state={ { selectedFuzz: selectedMenu } }
        style={ { color: "#587f2f", cursor: "pointer" } }
      >
        <MKButton
          variant={ "gradient" }
          color={ "info" }
          size="Large"
          sx={ { width: "100%" } }
        >
          Attack Graph Emulation
        </MKButton>
      </NavLink>
    );
  } else {
    return (
      <MKButton
        variant={ "gradient" }
        color={ "info" }
        size="Large"
        sx={ { width: "100%" } }
        disabled
      >
        Attack Graph Emulation
      </MKButton>
    );
  }
}

const AdversarialAttackSummary = ({ model }: any) => {
  const attackName = ["Evasion", "Extraction", "Inference", "Data Poisoning"];
  const selectedModel = model.length > 0 ? model[0] : {};
  const selectedMenu = selectedModel;
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
  const [getOsarReport, setOsarReportData]: any = React.useState(
    {}
  );
  const [getCosignLink, setCosignLink]: any = React.useState(false);
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
    const osarReportLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/${name}-osar.json`;
    const cosignLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/cosign.pub`;
    verifyLink(evasionLink, evasionData);
    verifyLink(extractionLink, extractionData);
    verifyLink(defenceForEvasion, evasionDefenceData);
    verifyLink(defenceForExtraction, extractionDefenceData);
    verifyLink(inferenceLink, inferenceData);
    verifyLink(defenceForInference, inferenceDefenceData);
    verifyLink(dataPoisoningLink, dataPoisoningData);
    verifyLink(defenceForDataPoisoning, dataPoisoningDefenceData);
    verifyLink(osarReportLink, setOsarReportData);
    checkFileExists(cosignLink, setCosignLink);
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="black" pt={ 1 } pb={ 3 }>
          Adversarial Attack Summary
        </Typography>
        <div style={ { display: 'flex' } }>
          { getCosignLink ? <img style={ { position: 'relative', left: '-8px', top: '-3px' } } src={ CheckIcon } alt="Checked Icon" width={ 24 } height={ 24 } /> : <></> }

          { Object.keys(getOsarReport).length === 0 ? <MKButton
            onClick={ () => generatePdfFromJson(getOsarReport, `${name}-osar.json`, getCosignLink) }
            style={ { top: '-7px' } }
            variant="gradient"
            color="info"
            size="small"
            endIcon={ <i className="fa fa-download" /> }
            disabled
          >
            OSAR
          </MKButton> : <MKButton
            onClick={ () => generatePdfFromJson(getOsarReport, `${name}-osar.json`, getCosignLink) } // Replace downloadJson with the generatePdfFromJson function
            style={ { top: '-7px' } }
            variant="gradient"
            color="info"
            size="small"
            endIcon={ <i className="fa fa-download" /> }
          >
            OSAR
          </MKButton> }
        </div>
      </Box>
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
      { dividerDiv(1) }
      { attackGraph(selectedMenu, attackMap) }
    </>
  );
};

export default AdversarialAttackSummary;
