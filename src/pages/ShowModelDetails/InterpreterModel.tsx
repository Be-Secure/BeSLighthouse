import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { InterpreterDataArray, processData } from "./SummaryDashboard";

interface InfoCardProps {
  title: string;
  value: string | number;
}


const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <Card
    sx={ {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      bgcolor: "#fff",
      boxShadow: 2,
      borderRadius: 2,
      height: "100%",
      padding: "16px"
    } }
  >
    <CardContent>
      <Typography variant="h3" sx={ { fontWeight: "bold", color: "#263238" } }>
        { value }
      </Typography>
      <Typography variant="body2" color="textSecondary">
        { title }
      </Typography>
    </CardContent>
  </Card>
);

const CustomStackedBarChart = ({ data, title, padding }: any) => {
  return (
    <Grid
      item
      xs={ 12 }
      md={ 12 }
      lg={ 12 }
      sx={ {
        paddingTop: "8px !important",
        paddingLeft: `${padding}px !important`,
        display: "flex",
      } }
    >
      <Card
        sx={ {
          p: 0,
          boxShadow: 3,
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        } }
      >
        <Typography
          variant="h6"
          sx={ { textAlign: "center", fontWeight: "bold", margin: "1px", mt: "8px" } }
        >
          { title }
        </Typography>
        <CardContent sx={ { flexGrow: 1, p: 0 } }>
          <ResponsiveContainer width="100%" height={ 300 }>
            <BarChart data={ data } margin={ { top: 20, right: 30, left: 20, bottom: 5 } }>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="attackType"
                fontSize={ 10 }
              />
              <YAxis
                label={ {
                  value: "Percentage",
                  angle: -90,
                  position: "insideLeft",
                  dy: 10, // Adjust label positioning
                } }
              />
              <Tooltip />
              <Legend
                wrapperStyle={ { fontSize: "13px", paddingTop: "8px" } }
                formatter={ () => "Category" }
              />
              
              { /* Bar for attack occurrences */ }
              <Bar
                dataKey="count"
                fill="#1F77B4"
                name="Attack Count"
                barSize={ 30 }
              />
            </BarChart>
          </ResponsiveContainer>

        </CardContent>
      </Card>
    </Grid>
  );
};

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
    { title: "Cases were non-malicious", value: nonMalicious },
    { title: "Cases found to be potentially malicious", value: potentiallyMaliciousCount },
    { title: "Cases found to be extremely malicious", value: extremelyMaliciousCount },
  ];
  
  return infoCards;
}
  
const generateBarChart = (interpreterData: InterpreterDataArray) => {
  // Count occurrences of each attack type
  const attackCounts = interpreterData.reduce<Record<string, number>>((acc, item) => {
    item.attack_type.forEach(type => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});
  
  // Transform data into chart-friendly format
  return Object.entries(attackCounts).map(([type, count]) => ({
    attackType: type,
    count,
  }));
};

const InterpreterModel = ({ interpreterData }: { interpreterData: InterpreterDataArray }) => {

  const infoCards = generateInfoCards(interpreterData);
  const attackData = generateBarChart(interpreterData);
  const chartData = processData(interpreterData);

  return (
    <Box sx={ { bgcolor: "#f4f4f4", width: "100%" } }>
      { /* min-width: 1288px; */ }
      <Grid container spacing={ 1 } alignItems="stretch">
        { /* Left Section (MITRE Tests + Info Cards) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 6 } container spacing={ 1 } direction="column" sx={ { display: 'flex' } }>
          <Grid container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
              <Card sx={ { height: "100%", display: "flex", justifyContent: "center", marginLeft: '8px' } }>
                <Typography variant="body2" color="textSecondary" style={ { paddingLeft: "10px" } }>
                  <b>Code Interpreter Tests</b> evaluate the security risks posed by integrating LLMs with code interpreters, specifically assessing how effectively an LLM can prevent malicious attempts to exploit the system or execute harmful code.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title="Interpretation tests processed​" value={ interpreterData.length } />
            </Grid>
          </Grid>

          { /* Info Cards */ }
          <Grid item container spacing={ 1 } sx={ { flex: 1 } }>
            { infoCards.map((card, index) => (
              <Grid item xs={ 12 } md={ 12 } lg={ 4 } key={ index }>
                <InfoCard title={ card.title } value={ card.value } />
              </Grid>
            )) }
          </Grid>
        </Grid>

        { /* Right Section (Pie Charts) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 6 } container spacing={ 2 } justifyContent="center"
          sx={ {
            paddingTop: "8px !important", "@media (max-width:1196px)": {
              marginTop: "-8px",
            }
          } }>
          <CustomStackedBarChart data={ attackData } title="Malicious violations count across different categories" padding={ 16 } />
        </Grid>
      </Grid>

      <Card sx={ { width: "100%", marginTop: "9px", paddingTop: "10px", paddingBottom: "10px" } }>
        <Typography variant="h6" sx={ { mt: 0, textAlign: "center", fontWeight: "bold" } }>
          Ratio of Violation Types Across Different Categories
        </Typography>
        <ResponsiveContainer width="100%" height={ 300 }>
          <BarChart data={ chartData } margin={ { left: 20, right: 20 } } barGap={ 5 }>
            <XAxis dataKey="category" stroke="#555" fontSize={ 12 }/>
            <YAxis stroke="#555" 
              label={ {
                value: "Count",
                angle: -90,
                position: "insideLeft",
                dy: 10, // Adjust label positioning
              } } />
            <Tooltip />
            <Legend wrapperStyle={ { fontSize: "13px", paddingTop: "8px" } } />
            <Bar dataKey="Extremely Malicious" fill="#C23B22" barSize={ 20 } />
            <Bar dataKey="Potentially Malicious" fill="#f28e2c" barSize={ 20 } />
            <Bar dataKey="Non Malicious" fill="#2E7D32" barSize={ 20 } />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default InterpreterModel;
