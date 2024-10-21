import React from "react";
import { Card, Typography, Button, Box, Divider } from "@mui/material";
import AdversarialAttackSummary from "../../pages/ShowModelDetails/AdversarialAttackSummary";

// Custom component for displaying a summary card
const SummaryCard: React.FC<{ title: string; buttonLabel: string }> = ({ title, buttonLabel }) => {
  return (
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#F3F9FB',
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
      </Box>

      { /* Divider positioned consistently */ }
      <Divider sx={ { my: 2, opacity: 1, position: 'relative', top: '-14px' } } />

      { /* Additional content or placeholders can go here */ }
      <Box sx={ { flexGrow: 1 } } />
      <AdversarialAttackSummary model={ 'bes_image_classification' } />
    </Card>
  );
};

const AttackSummary: React.FC = () => {
  return (
    <SummaryCard title="Attack Summary" buttonLabel="Emulation" />
  );
};

export default AttackSummary;
