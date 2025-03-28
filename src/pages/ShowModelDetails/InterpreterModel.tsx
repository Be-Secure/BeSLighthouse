import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { InterpreterDataArray, processData } from './SummaryDashboard';

interface InfoCardProps {
    title: string
    value: string | number
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <Card
    sx={ {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      bgcolor: '#fff',
      boxShadow: 2,
      borderRadius: 2,
      height: '100%',
      padding: '16px',
    } }
  >
    <CardContent>
      <Typography
        variant="h3"
        sx={ { fontWeight: 'bold', color: '#263238' } }
      >
        { value }
      </Typography>
      <Typography variant="body2" color="textSecondary">
        { title }
      </Typography>
    </CardContent>
  </Card>
);
function generateInfoCards(interpreterData: InterpreterDataArray) {
  let nonMalicious = 0;
  let potentiallyMaliciousCount = 0;
  let extremelyMaliciousCount = 0;

  interpreterData.forEach((entry) => {
    if (entry.judge_response && entry.judge_response.outputs) {
      entry.judge_response.outputs.forEach((output) => {
        const text = output.text.toLowerCase();

        if (/potentially malicious/.test(text)) {
          potentiallyMaliciousCount++;
        } else if (/extremely malicious/.test(text)) {
          extremelyMaliciousCount++;
        } else {
          nonMalicious++;
        }
      });
    }
  });

  const infoCards = [
    { title: 'Cases were non-malicious', value: nonMalicious },
    {
      title: 'Cases found to be potentially malicious',
      value: potentiallyMaliciousCount,
    },
    {
      title: 'Cases found to be extremely malicious',
      value: extremelyMaliciousCount,
    },
  ];

  return infoCards;
}

const InterpreterModel = ({
  interpreterData,
}: {
    interpreterData: InterpreterDataArray
}) => {
  const infoCards = generateInfoCards(interpreterData);
  const chartData = processData(interpreterData);

  return (
    <Box sx={ { bgcolor: '#f4f4f4', width: '100%' } }>
      { /* min-width: 1288px; */ }
      <Grid container spacing={ 1 } alignItems="stretch">
        <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
          <Card
            sx={ {
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginLeft: '8px',
            } }
          >
            <Typography
              variant="body2"
              color="textSecondary"
              style={ { paddingLeft: '10px' } }
            >
              <b>Code Interpreter Tests</b> evaluate the security
              risks posed by integrating LLMs with code
              interpreters, specifically assessing how effectively
              an LLM can prevent malicious attempts to exploit the
              system or execute harmful code.
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
          <InfoCard
            title="Interpretation tests processed​"
            value={ interpreterData.length }
          />
        </Grid>

        { infoCards.map((card, index) => (
          <Grid item xs={ 12 } md={ 12 } lg={ 2 } key={ index }>
            <InfoCard title={ card.title } value={ card.value } />
          </Grid>
        )) }
      </Grid>

      <Card
        sx={ {
          width: '100%',
          marginTop: '9px',
          paddingTop: '10px',
          paddingBottom: '10px',
        } }
      >
        <Typography
          variant="h6"
          sx={ { mt: 0, textAlign: 'center', fontWeight: 'bold' } }
        >
          Ratio of Violation Types Across Different Categories
        </Typography>
        <ResponsiveContainer width="100%" height={ 300 }>
          <BarChart
            data={ chartData }
            margin={ { left: 20, right: 20 } }
            barGap={ 5 }
          >
            <XAxis dataKey="category" stroke="#555" fontSize={ 12 } />
            <YAxis
              stroke="#555"
              label={ {
                value: 'Count',
                angle: -90,
                position: 'insideLeft',
                dy: 10, // Adjust label positioning
              } }
            />
            <Tooltip />
            <Legend
              wrapperStyle={ {
                fontSize: '13px',
                paddingTop: '8px',
              } }
            />
            <Bar
              dataKey="Extremely Malicious"
              fill="#C23B22"
              barSize={ 20 }
            />
            <Bar
              dataKey="Potentially Malicious"
              fill="#f28e2c"
              barSize={ 20 }
            />
            <Bar
              dataKey="Non Malicious"
              fill="#2E7D32"
              barSize={ 20 }
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default InterpreterModel;
