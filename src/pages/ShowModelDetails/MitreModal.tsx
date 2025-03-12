import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MitreDataArray } from "./SummaryDashboard";

interface InfoCardProps {
  title: string;
  value: string | number;
}


const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <Card sx={ { textAlign: "center", bgcolor: "#fff", boxShadow: 2, borderRadius: 2, height: "100%" } }>
    <CardContent>
      <Typography variant="h3">
        <b>{ value }</b>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        { title }
      </Typography>
    </CardContent>
  </Card>
);


interface CustomPieChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
  padding: number;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, title, padding }) => (
  <Grid item xs={ 12 } md={ 12 } lg={ 6 } sx={ { paddingTop: "8px !important", paddingLeft: `${padding}px !important`, display: "flex" } }>
    <Card sx={ {
      p: 0,
      boxShadow: 3,
      borderRadius: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      width: '100%',
      // minWidth: '311px'
    } }>
      <Typography variant="h6" sx={ { textAlign: "center", fontWeight: "bold", margin: "1px", mt: "8px" } }>
        { title }
      </Typography>
      <CardContent sx={ { flexGrow: 1, p: 0 } }>
        <ResponsiveContainer width="100%" height={ 240 }>
          <PieChart>
            <Pie
              data={ data }
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={ 80 }
              label={ ({ percent }) => `${(percent * 100).toFixed(0)}%` }
            >
              { data.map((entry) => (
                <Cell key={ entry.name } fill={ entry.color } />
              )) }
            </Pie>
            <Tooltip formatter={ (value, name) => [`${value}`, `${name}`] } />
            { /* <Legend wrapperStyle={ { fontSize: "12px", textAlign: "center" } } /> */ }
          </PieChart>
        </ResponsiveContainer>

        { /* Legend */ }
        <Box sx={ {
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "100%",
          gap: 1,
        } }>
          { data.map((item) => (
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
              <Typography variant="caption" sx={ { fontSize: "13px", color: "textSecondary" } }>
                { item.name }
              </Typography>
            </Box>
          )) }
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

function generateInfoCards(mitredata: MitreDataArray) {
  let benignCount = 0;
  let harmfulCount = 0;
  let maliciousCount = 0;

  mitredata.forEach((entry: any) => {
    if (entry.judge_response && entry.judge_response.outputs) {
      entry.judge_response.outputs.forEach((output: { text: string; }) => {
        if (output.text.trim().toLowerCase() === "benign.") {
          benignCount++;
        } else if (output.text.trim().toLowerCase() === "potential.") {
          harmfulCount++;
        } else if (output.text.trim().toLowerCase() === "malicious.") {
          maliciousCount++;
        }
      });
    }
  });

  const infoCards = [
    { title: "responses generated were benign in nature", value: benignCount },
    { title: "responses generated were potentially harmful", value: harmfulCount },
    { title: "responses generated were malicious", value: maliciousCount },
  ];

  return infoCards;
}

function generateMitreSummary(mitreData: MitreDataArray) {
  let summary: any = {};

  mitreData.forEach((entry: any) => {
    let category = entry.mitre_category;
    let judgment = entry.judge_response?.outputs[0].text.trim();

    if (!summary[category]) {
      summary[category] = { Malicious: 0, Potential: 0, Neutral: 0, Benign: 0 };
    }

    if (judgment === "Malicious.") {
      summary[category].Malicious++;
    } else if (judgment === "Potential.") {
      summary[category].Potential++;
    } else if (judgment === "Neutral.") {
      summary[category].Neutral++;
    } else if (judgment === "Benign.") {
      summary[category].Benign++;
    }
  });

  return Object.entries(summary).map(([category, counts]: any) => ({ category, ...counts }));
}

function generateJudgmentJSON(mitreData: MitreDataArray) {
  const categories: any = {
    Malicious: { value: 0, color: "#C23B22" },
    Potential: { value: 0, color: "#f28e2c" },
    Neutral: { value: 0, color: "#1f77b4" },
    Benign: { value: 0, color: "#76b041" }
  };

  // Iterate through mitreData to extract judge_response
  mitreData.forEach((entry: any) => {
    if (entry.judge_response && entry.judge_response.outputs) {
      entry.judge_response.outputs.forEach((response: any) => {
        const text = response.text.trim().replace(".", ""); // Remove trailing dot
        if (categories.hasOwnProperty(text)) {
          categories[text].value += 1;
        }
      });
    }
  });

  // Convert the object to an array format
  return Object.entries(categories).map(([name, data]: any) => ({
    name,
    value: data.value,
    color: data.color
  }));
}

function generateSummary(mitreData: MitreDataArray) {
  const summary = [
    { name: "Answered", value: 0, color: "#1f77b4" },
    { name: "Unanswered", value: 0, color: "#ff7f0e" }
  ];

  mitreData.forEach(item => {
    if (item.answered === "yes") {
      summary[0].value++;
    } else if (item.answered === "no") {
      summary[1].value++;
    }
  });

  return summary;
}

const MitreModal = ({ mitreData }: { mitreData: MitreDataArray }) => {

  const infoCards = generateInfoCards(mitreData);
  const attackData = generateMitreSummary(mitreData);
  const severityData = generateJudgmentJSON(mitreData);
  const answeredData = generateSummary(mitreData);

  return (
    <Box sx={ { bgcolor: "#f4f4f4", width: "100%" } }>
      { /* min-width: 1288px; */ }
      <Grid container spacing={ 1 } alignItems="stretch">
        { /* Left Section (MITRE Tests + Info Cards) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 6 } container spacing={ 1 } direction="column" sx={ { display: 'flex' } }>
          { /* MITRE Tests Introduction */ }
          <Grid container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
              <Card sx={ { height: "100%", display: "flex", justifyContent: "center", marginLeft: '8px' } }>
                <Typography variant="body2" color="textSecondary" style={ { paddingLeft: "10px" } }>
                  <b>MITRE Tests</b> uses the MITRE ATT&CK framework to evaluate an LLM’s compliance when asked to assist in cyberattacks.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title="test cases with harmful intent executed on the model" value={ mitreData.length } />
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
          <CustomPieChart data={ severityData } title="Prompt Severity Distribution" padding={ 16 } />
          <CustomPieChart data={ answeredData } title="Answered vs Unanswered Prompts" padding={ 8 } />
        </Grid>
      </Grid>

      <Card sx={ { width: '100%', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px" } }>
        <Typography variant="h6" pt={ 0 } sx={ { mt: 0, textAlign: "center", fontWeight: "bold" } }>
          Prompt Severity Across Attack Categories
        </Typography>
        <ResponsiveContainer width="100%" height={ 300 }>
          <BarChart data={ attackData } margin={ { left: 20, right: 20 } } barGap={ 5 }>
            <XAxis dataKey="category" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Legend wrapperStyle={ { fontSize: "13px", paddingTop: "8px" } } />
            <Bar dataKey="Malicious" stackId="a" fill="#C23B22" barSize={ 20 } />
            <Bar dataKey="Potential" stackId="a" fill="#f28e2c" barSize={ 20 } />
            <Bar dataKey="Neutral" stackId="a" fill="#1f77b4" barSize={ 20 } />
            <Bar dataKey="Benign" stackId="a" fill="#76b041" barSize={ 20 } />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default MitreModal;
