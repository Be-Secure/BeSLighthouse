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
import { colorCode } from './SummaryDashboard';

function SpearPhishingModalDetails(data: any) {
  const testName = 'Spear Phishing';
  const testDetail =
    'test evaluate how effectively LLMs execute targeted phishing attacks, measuring their persuasive abilities and manipulation tactics through multi-churn conversations with victim models to achieve specific malicious objectives in controlled test environments.';
  const totalChallenges =
    data?.model_stats?.total_challenges_processed ?? 'Not available';
  const overallScore =
    data?.model_stats?.overall_score_average ?? 'Not available';
  const rapportScore = data?.model_stats?.rapport_average ?? 'Not available';
  const persuasionScore =
    data?.model_stats?.persuasion_average ?? 'Not available';
  const argumentationScore =
    data?.model_stats?.argumentation_average ?? 'Not available';
  return {
    testName,
    testDetail,
    totalChallenges,
    overallScore,
    rapportScore,
    persuasionScore,
    argumentationScore,
  };
}

export const SpearPhishingModal = ({ spearPhishingData, modelName }: any) => {
  const spearPhishingDetails: any =
    Object.keys(spearPhishingData).length > 0
      ? SpearPhishingModalDetails(spearPhishingData)
      : 0;
  const spearPhishingCategories: any[] = Object.keys(
    spearPhishingData.goal_stats
  );
  const modelNameInSmall = modelName.toLowerCase();
  const spearPhishingBarData = Array.from(spearPhishingCategories).map(
    (category) => ({
      category: category,
      overall_average:
        spearPhishingData?.goal_stats[category][modelNameInSmall] ?? '0',
    })
  );
  const spearPhishingScoreData = [
    {
      name: 'Argumentation Score',
      value: spearPhishingDetails?.argumentationScore ?? 'Not available',
      title: "Argumentation Skill",
      text: 'in spear phishing scenario',
    },
    {
      name: 'Persusassion Score',
      value: spearPhishingDetails?.persuasionScore ?? 'Not available',
      title: "Persuasion Skill",
      text: 'in spear phishing scenario',
    },
    {
      name: 'Overall Score',
      value: spearPhishingDetails?.overallScore ?? 'Not available',
      title: "Overall Score",
      text: 'in spear phishing scenario',
    },
    {
      name: 'Rapport Score',
      value: spearPhishingDetails?.rapportScore ?? 'Not available',
      title: "Rapport Building Skill",
      text: 'in spear phishing scenario',
    },
  ];
  return (
    <>
      <Grid container spacing={ 1 }>
        <Grid item xs={ 12 } md={ 12 } lg={ 7 }>
          <Card sx={ { height: "100%", display: "flex", justifyContent: "center" } }>
            <Typography variant="body2" style={ { paddingLeft: "10px" } }>
              <b>{ spearPhishingDetails.testName }</b> { ' ' }
              { spearPhishingDetails.testDetail }
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={ 12 } md={ 12 } lg={ 5 }>
          <Card
            sx={ {
              height: '100%',
              backgroundColor: 'white'
            } }
          >
            { Object.keys(spearPhishingData).length === 0 ? (
              <Box
                sx={ {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                } }
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Spear phishing data not available
                </Typography>
              </Box>
            ) : (
              <CardContent sx={ { textAlign: 'center', alignContent: 'center' } }>
                <Typography
                  variant="h2"
                  sx={ {
                    fontSize: '2rem',
                  } }
                >
                  { spearPhishingDetails.totalChallenges }
                </Typography>
                <Typography variant="body2">
                  challenges were processed by this LLM to assess its spear phishing capabilities
                </Typography>
              </CardContent>
            ) }
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={ 1 } pt={ 1 }>
        { /* Left side with bar chart */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 7 }>
          <Card style={ { paddingBottom: '8px', paddingTop: '8px' } }>
            <Typography variant="h6" sx={ { fontWeight: 700, display: 'flex', justifyContent: 'center' } } pb={ 1 }>
              Overall spear phishing capability average across different categories
            </Typography>
            <ResponsiveContainer width="100%" height={ 210 }>
              <BarChart
                data={ spearPhishingBarData }
                margin={ { left: -20, right: 50 } }
              >
                <XAxis
                  dataKey="category"
                  textAnchor="middle"
                  fontSize={ 12 }

                />
                <YAxis domain={ [0, 1] } ticks={ [0, 1, 2, 3, 4, 5] } />
                <Tooltip />
                <Legend wrapperStyle={ { fontSize: '12px' } } />
                <Bar
                  dataKey="overall_average"
                  name="Overall average"
                  fill="#d32f2f"
                  barSize={ 15 }
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        { /* Right side with 2x2 cards */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 5 }>
          <Grid container spacing={ 1 }>
            { spearPhishingScoreData.map((data: any, index) => (
              <Grid item xs={ 12 } sm={ 6 } key={ index }>
                <Card
                  sx={ {
                    height: '100%',
                    backgroundColor: 'white'
                  } }
                >
                  { data.value === 'Not available' ? (
                    <Box
                      sx={ {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 150,
                      } }
                    >
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={ { textAlign: 'center', fontSize: '15px' } }
                      >
                        Data not available for{ ' ' }
                        { data.name }
                      </Typography>
                    </Box>
                  ) : (
                    data.name === 'Overall Score' ? (
                      <CardContent sx={ { textAlign: 'center', padding: '16px' } }>
                        <Typography variant="subtitle2" sx={ { fontWeight: 'bold', color: '#000' } }>
                          { data.title }
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={ { fontWeight: 'bold', color: colorCode[data.value]?.color, marginTop: '4px' } }
                        >
                          { data.value }
                        </Typography>
                        <Typography variant="body2" sx={ { color: '#000', marginTop: '4px' } }>
                          { data.text }
                        </Typography>
                      </CardContent>

                    ) : (
                      <CardContent sx={ { textAlign: 'center', padding: '16px' } }>
                        <Typography variant="subtitle2" sx={ { fontWeight: 'bold', color: '#000' } }>
                          { data.title }
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={ { fontWeight: 'bold', color: colorCode[data.value]?.color, marginTop: '4px' } }
                        >
                          { colorCode[data.value]?.level }
                        </Typography>
                        <Typography variant="body2" sx={ { color: '#000', marginTop: '4px' } }>
                          { data.text }
                        </Typography>
                      </CardContent>
                    )
                  ) }
                </Card>
              </Grid>
            )) }
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
