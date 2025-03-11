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
  <Card sx={ { textAlign: "center", p: 2, bgcolor: "#f4f4f4", boxShadow: 2, borderRadius: 2, height: 170 } }>
    <CardContent>
      <Typography variant="h4" fontWeight="bold" color="#333">
        { value }
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
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, title }) => (
  <Grid item xs={ 12 } md={ 12 } lg={ 6 } pl={ 1 } textAlign="center">
    <Typography variant="h6" gutterBottom sx={ { fontSize: "12px" } }>
      { title }
    </Typography>
    <ResponsiveContainer width="100%" height={ 320 }>
      <PieChart>
        <Pie
          data={ data }
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={ 90 }
          label={ ({ percent }) => `${(percent * 100).toFixed(0)}%` }
        >
          { data?.map((entry) => (
            <Cell key={ entry.name } fill={ entry.color } />
          )) }
        </Pie>
        <Tooltip formatter={ (value) => `${value}` } /> { /* Added Tooltip */ }
        <Legend wrapperStyle={ { fontSize: "12px" } } />
      </PieChart>
    </ResponsiveContainer>
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
    Malicious: { value: 0, color: "#FF0000" },
    Potential: { value: 0, color: "#f28e2c" },
    Neutral: { value: 0, color: "#f7dc6f" },
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

const MitreModal = ({ mitreData }: {mitreData: MitreDataArray}) => {
   
  const infoCards = generateInfoCards(mitreData);
  const attackData = generateMitreSummary(mitreData);
  const severityData = generateJudgmentJSON(mitreData);
  const answeredData = generateSummary(mitreData);

  return (
    <Box sx={ { bgcolor: "#fff", width: "100%" } }>
      <Grid container spacing={ 1 }>
        <Grid item xs={ 12 } md={ 6 } container spacing={ 1 } direction="column">
          { /* MITRE Tests Introduction */ }
          <Grid container spacing={ 1 }>
            <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
              <Typography variant="body1" color="textSecondary">
                <b>MITRE Tests</b> The MITRE ATT&CK framework is used to evaluate an LLM’s compliance when asked to assist in cyberattacks.
              </Typography>
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title="Test cases with harmful intent executed on model" value={ mitreData.length } />
            </Grid>
          </Grid>

          { /* Info Cards */ }
          <Grid item container spacing={ 1 }>
            { infoCards.map((card, index) => (
              <Grid item xs={ 12 } md={ 12 } lg={ 4 } key={ index }>
                <InfoCard title={ card.title } value={ card.value } />
              </Grid>
            )) }
          </Grid>
        </Grid>

        { /* Pie Charts */ }
        <Grid item xs={ 12 } md={ 6 } container spacing={ 2 } justifyContent="center">
          <CustomPieChart data={ severityData } title="Total Prompt Severity Distribution" />
          <CustomPieChart data={ answeredData } title="Distribution of Answered vs. Unanswered Prompts" />
        </Grid>
      </Grid>
      <Typography variant="h6" pt={ 4 } sx={ { mt: 4, textAlign: "center", fontWeight: "bold" } }>
        Prompt Severity Across Attack Categories
      </Typography>
      <ResponsiveContainer width="100%" height={ 300 }>
        <BarChart data={ attackData } margin={ { left: 20, right: 20 } } barGap={ 5 }>
          <XAxis dataKey="category" stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip />
          <Legend wrapperStyle={ { fontSize: "12px" } } />
          <Bar dataKey="Malicious" stackId="a" fill="#FF0000" barSize={ 20 } />
          <Bar dataKey="Potential" stackId="a" fill="#f28e2c" barSize={ 20 } />
          <Bar dataKey="Neutral" stackId="a" fill="#f7dc6f" barSize={ 20 } />
          <Bar dataKey="Benign" stackId="a" fill="#76b041" barSize={ 20 } />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MitreModal;
