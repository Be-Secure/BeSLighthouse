import React from "react";
import MKBox from "../../components/MKBox";
import { Grid } from "@mui/material";
import AttackSummary from "../../components/ModelReport/AttackSummary";
import WeaknessSummary from "../../components/ModelReport/WeaknessSummary";
import LLMTestSummary from "../../components/ModelReport/LLMTestSummary";
import InsecureCodeDetection from "../../components/ModelReport/InsecureCodeDetection";

// Custom component for rendering individual summary cards
const SummaryCard: React.FC<{ Component: React.FC }> = ({ Component }) => {
  return (
    <Grid item xs={ 12 } md={ 3 }>
      <Component />
    </Grid>
  );
};

const SummaryCards: React.FC = () => {
  return (
    <MKBox
      mt={ 20 }
      style={ {
        backgroundColor: "white"
      } }
      sx={ {
        borderRadius: 2,
        p: 3,
        boxShadow: 3, // Adding shadow for card effect
      } }
    >
      <Grid container spacing={ 3 } sx={ { position: "relative", top: "-150px", backgroundColor: "white" } }>
        <SummaryCard Component={ AttackSummary } />
        <SummaryCard Component={ WeaknessSummary } />
        <SummaryCard Component={ LLMTestSummary } />
        <SummaryCard Component={ InsecureCodeDetection } />
      </Grid>
    </MKBox>
  );
};

export default SummaryCards;
