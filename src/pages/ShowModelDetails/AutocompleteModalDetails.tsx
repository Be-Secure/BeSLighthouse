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
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell
} from 'recharts';

import { AutocompleteData } from "./SummaryDashboard";
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

function generatePieChartData(autocompleteSummaryData: AutocompleteData) {
  let successCount: number = 0;
  let vulnerableCount: number = 0;

  if (!autocompleteSummaryData || Object.keys(autocompleteSummaryData).length === 0) {
    return [];
  }

  Object.values(autocompleteSummaryData).forEach((language: any) => {
    successCount += (language.total_count - language.vulnerable_suggestion_count);
    vulnerableCount += language.vulnerable_suggestion_count;
  });

  return [
    {
      name: 'Success',
      value: successCount,
      color: '#156082'
    },
    {
      name: 'Failed',
      value: vulnerableCount,
      color: '#E87437'
    }
  ];
}

export const AutocompleteModal = ({ autocompleteSummaryData }: { autocompleteSummaryData: AutocompleteData }) => {
  const pieData = generatePieChartData(autocompleteSummaryData) || [];
  console.log('pieData', pieData);
  const autocompleteBarData = Object.keys(autocompleteSummaryData).map((language: string) => ({
    language: language,
    safe: autocompleteSummaryData[language].pass_rate,
    insecure: autocompleteSummaryData[language].vulnerable_percentage,
  }));
  const summaryData: any = Object.keys(autocompleteSummaryData).length > 0
    ? autocompleteModalDetails()
    : { testName: '', testDetail: '' };

  return (
    <>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } md={ 4 } lg={ 4 }>
          <Card sx={ { height: "100%", display: "flex", marginLeft: '8px', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px" } }>
          
            <Typography id="transition-modal-title" sx={ { fontSize: '16px'} }>
              <strong>{ summaryData.testName }</strong>{ ' ' }
              { summaryData.testDetail }
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={ 12 } md={ 8 } lg={ 8 }>
          <Card style={ { paddingBottom: '8px', paddingTop: '8px', margin: '10px', marginTop: '20px' } }>
            <ResponsiveContainer>
              <>
                <PieChart width={ 400 } height={ 300 }>
                  <Pie
                    data={ pieData }
                    innerRadius={ 60 }
                    outerRadius={ 80 }
                    fill="#8884d8"
                    paddingAngle={ 3 }
                    dataKey="value"
                  >
                    { pieData.map((entry, index) => (
                      <Cell key={ `cell-${index}` } fill={ entry.color } />
                    )) } 
                  </Pie>
                </PieChart>

                <Box sx={ {
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  maxWidth: "100%",
                  gap: 1,
                } }>
                  { pieData.map((item) => (
                    <Box key={ item.name } sx={ { display: "flex", alignItems: "center" } }>
                      <Box
                        sx={ {
                          width: 10,
                          height: 10,
                          backgroundColor: item.color,
                          borderRadius: "50%",
                          mr: 0.5,
                        } }
                      />
                      <Typography variant="caption" sx={ { fontSize: "13px", color: "textSecondary", textTransform: 'capitalize' } }>
                        { item.name }
                      </Typography>
                    </Box>
                
                  )) }
                </Box>
              </>
            </ResponsiveContainer>
          </Card>
        </Grid> 
      </Grid>
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } md={ 12 } lg={ 12 }>
          <Card style={ { paddingBottom: '8px', paddingTop: '8px', margin: '10px', marginTop: '20px' } }>
            <ResponsiveContainer width={ '100%' } height={ 300 }>
              <BarChart
                data={ autocompleteBarData }
                margin={ {
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                } }
                barSize={ 35 }
              >
                <XAxis dataKey="language" name="Language" />
                <YAxis name="Percentage" />
                <Tooltip />
                <Legend />
                <Bar dataKey="safe" name="Safe Code" stackId="a" fill="#156082" />
                <Bar dataKey="insecure" name="Insecure Code" stackId="a" fill="#E97132" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid> 
      </Grid>
    </>
  );
};
