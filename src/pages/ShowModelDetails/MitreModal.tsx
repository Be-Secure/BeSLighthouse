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

interface InfoCardProps {
  title: string;
  value: string | number;
}

 
const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <Card sx={ { textAlign: "center", p: 2, bgcolor: "#f4f4f4", boxShadow: 2, borderRadius: 2, height: 155 } }>
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

const severityData = [
  { name: "Malicious", value: 672, color: "#004c97" },
  { name: "Potential", value: 96, color: "#f28e2c" },
  { name: "Neutral", value: 25, color: "#76b041" },
  { name: "Benign", value: 25, color: "#e15759" },
];

const answeredData = [
  { name: "Answered", value: 900, color: "#1f77b4" },
  { name: "Unanswered", value: 196, color: "#ff7f0e" },
];
 
 
const attackData = [
  { category: "C2", Malicious: 5, Potential: 2, Neutral: 3, Benign: 1 },
  { category: "Collection", Malicious: 10, Potential: 3, Neutral: 2, Benign: 0 },
  { category: "Discovery", Malicious: 15, Potential: 4, Neutral: 3, Benign: 2 },
  { category: "Evasion", Malicious: 12, Potential: 5, Neutral: 2, Benign: 1 },
  { category: "Execution", Malicious: 14, Potential: 3, Neutral: 2, Benign: 1 },
  { category: "Exfil", Malicious: 13, Potential: 4, Neutral: 3, Benign: 1 },
  { category: "Lateral Movement", Malicious: 8, Potential: 3, Neutral: 2, Benign: 1 },
  { category: "Persistence", Malicious: 9, Potential: 3, Neutral: 2, Benign: 1 },
  { category: "Privilege Escalation", Malicious: 7, Potential: 3, Neutral: 2, Benign: 1 },
  { category: "Recon", Malicious: 11, Potential: 4, Neutral: 3, Benign: 2 },
];

interface CustomPieChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, title }) => (
  <Grid item xs={ 12 } md={ 12 } lg={ 6 } pl={ 1 } textAlign="center">
    <Typography variant="h6" gutterBottom sx={ { fontSize: "12px" } }>
      { title }
    </Typography>
    <ResponsiveContainer width="100%" height={ 290 }>
      <PieChart>
        <Pie
          data={ data }
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={ 90 }
          label={ ({ percent }) => `${(percent * 100).toFixed(0)}%` } // ✅ Fixed label function
        >
          { data?.map((entry) => (
            <Cell key={ entry.name } fill={ entry.color } />
          )) }
        </Pie>
        <Legend wrapperStyle={ { fontSize: "12px" } } />
      </PieChart>
    </ResponsiveContainer>
  </Grid>
);

const MitreModal: React.FC = () => {
   
  const infoCards = [
    { title: "Successful exploit attempts", value: "567" },
    { title: "Detected threats mitigated", value: "312" },
    { title: "Unmitigated threats", value: "89" },
  ];

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
              <InfoCard title="Test cases with harmful intent executed" value="1096" />
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
          <Bar dataKey="Malicious" stackId="a" fill="#004c97" barSize={ 20 } />
          <Bar dataKey="Potential" stackId="a" fill="#f28e2c" barSize={ 20 } />
          <Bar dataKey="Neutral" stackId="a" fill="#76b041" barSize={ 20 } />
          <Bar dataKey="Benign" stackId="a" fill="#e15759" barSize={ 20 } />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MitreModal;
