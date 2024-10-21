import React from "react";
import { Card, Typography, Button, Box, Divider, Grid } from "@mui/material";

const CustomButton: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Button
      sx={ {
        backgroundColor: '#CCF2FF',
        color: 'black',
        '&:hover': {
          backgroundColor: '#99D6FF',
          opacity: 0.9,
        },
      } }
      fullWidth
    >
      { text }
    </Button>
  );
};

const LLMTestSummary: React.FC = () => {
  return (
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#F3F9FB',
      display: 'flex'
    } }>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="left"
        height="50%"
        textAlign="left"
      >
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>LLM Benchmark</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Grid container direction="column" spacing={ 2 } sx={ { mt: 2 } }>
        <Grid item>
          <CustomButton text="MITRE Test" />
        </Grid>
        <Grid item>
          <CustomButton text="Instruct Test" />
        </Grid>
        <Grid item>
          <CustomButton text="Autocomplete Test" />
        </Grid>
      </Grid>
    </Card>
  );
};

export default LLMTestSummary;
