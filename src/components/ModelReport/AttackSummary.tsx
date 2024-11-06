import React, { useEffect } from "react";
import { Card, Typography, Button, Box, Divider } from "@mui/material";
import AdversarialAttackSummary from "../../pages/ShowModelDetails/AdversarialAttackSummary";
import { verifyLink } from "../../utils/verifyLink";
import { NavLink } from "react-router-dom";

function attackGraph(selectedMenu: string, attackMap: any, buttonLabel: string) {
  if (
    attackMap.Evasion.reportAvability ||
    attackMap.Extraction.reportAvability ||
    attackMap.Inference.reportAvability ||
    attackMap["Data Poisoning"].reportAvability
  ) {
    return (
      <NavLink
        to={ {
          pathname: `/BeSLighthouse/model_fuzzing/:${selectedMenu}`,
          search: ""
        } }
        state={ { selectedFuzz: selectedMenu } }
        style={ { color: "#587f2f", cursor: "pointer" } }
      >
        <Button
          sx={ {
            top: '-12px',
            backgroundColor: '#CCF2FF',
            color: 'black',
            '&:hover': {
              backgroundColor: '#99D6FF',
              opacity: 0.9,
            },
          } }
        >
          { buttonLabel }
        </Button>
      </NavLink>
    );
  } else {
    return (
      <Button
        sx={ {
          top: '-12px',
          backgroundColor: '#CCF2FF',
          color: 'black',
          '&:hover': {
            backgroundColor: '#99D6FF',
            opacity: 0.9,
          }
        } }
        disabled
      >
        { buttonLabel }
      </Button>
    );
  }
}


// Custom component for displaying a summary card
const SummaryCard: React.FC<{ title: string; buttonLabel: string, name: string }> = ({ title, buttonLabel, name }) => {
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
  }, [name]);

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
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#fffff',
      display: 'flex',
      flexDirection: 'column',
    } }>
      { /* Title and Button in one row */ }
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align to center vertically
      >
        <Typography variant="h6" sx={ { position: 'relative', fontWeight: 'bold', top: '-7px' } }>{ title }</Typography>
        { attackGraph(name, attackMap, buttonLabel) }
      </Box>

      { /* Divider positioned consistently */ }
      <Divider sx={ { my: 2, opacity: 1, position: 'relative', top: '-14px' } } />

      { /* Additional content or placeholders can go here */ }
      { /* <Box sx={ { flexGrow: 1 } } /> */ }
      <AdversarialAttackSummary attackMap={ attackMap } />
    </Card>
  );
};

const AttackSummary: React.FC<{ name: string }> = ({ name }) => {
  return (
    <SummaryCard title="Attack Summary" buttonLabel="Emulation" name={ name } />
  );
};

export default AttackSummary;
