import React from "react";
import MKBox from "../../components/MKBox";
import { Grid } from "@mui/material";
import AttackSummary from "../../components/ModelReport/AttackSummary";
import WeaknessSummary from "../../components/ModelReport/WeaknessSummary";
import LLMTestSummary from "../../components/ModelReport/LLMTestSummary";
import InsecureCodeDetection from "../../components/ModelReport/InsecureCodeDetection";

interface SummaryCardProps {
  Component: React.FC<any>; // Accept any component with props
  [key: string]: any; // Additional props passed to the component
}

// Custom component for rendering individual summary cards
const SummaryCard: React.FC<SummaryCardProps> = ({ Component, name }) => {
  return (
    <Grid item xs={ 12 }  // Full width on extra small screens
      sm={ 6 }   // Two cards per row on small screens
      md={ 6 }   // Two cards per row on medium screens (fixed)
      lg={ 3 }   // Four cards per row on large screens
    >
      <Component name={ name } />
    </Grid >
  );
};

const SummaryCards: React.FC<{ name: string }> = ({ name }) => {
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
      <Grid container spacing={ 1 } sx={ {
        position: "relative", top: "-150px", backgroundColor: "white", "@media (min-width: 990px) and (max-width: 1378px)": {
          "& > div": {
            minWidth: "50%",
          },
        },
        "@media (min-width: 572px) and (max-width: 739px)": {
          "& > div": {
            minWidth: "100%",
          },
        }
      } }>
        <SummaryCard Component={ AttackSummary } name={ name } />
        <SummaryCard Component={ WeaknessSummary } name={ name } />
        <SummaryCard Component={ LLMTestSummary } name={ name } />
        <SummaryCard Component={ InsecureCodeDetection } name={ name } />
      </Grid>
    </MKBox>
  );
};

export default SummaryCards;

