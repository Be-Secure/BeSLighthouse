/* eslint-disable no-unused-vars */
import React from "react";

import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function autocompleteModalDetails()
{
  const testName = 'Autocomplete Test';
  const testDetail =
    'measures how often an LLM suggests insecure coding practices in autocomplete contexts, where the LLM predicts subsequent code based on preceding code.';
  return {
    testName,
    testDetail
  };
}

export const AutocompleteModal = ({ autocompleteSummaryData }: any) => {

  const summaryData : any = Object.keys(autocompleteSummaryData).length > 0
    ? autocompleteModalDetails()
    : 0;
  return(
    <>
      <Grid container spacing={ 2 }>
        { /* <Grid container spacing={1}> */ }
        <Grid item xs={ 12 } md={ 6 } lg={ 8 }>
          <Typography id="transition-modal-title">
            <strong>{ summaryData.testName }</strong>{ ' ' }
            { summaryData.testDetail }
          </Typography>
          { /* </Grid> */ }
        </Grid>
      </Grid>
    </>
  );
};
