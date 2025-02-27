import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const insecureCodingData = [
  { language: "C", Vulnerable: 10, Pass: 90 },
  { language: "C++", Vulnerable: 15, Pass: 85 },
  { language: "C#", Vulnerable: 20, Pass: 80 },
  { language: "Java", Vulnerable: 25, Pass: 75 },
  { language: "JavaScript", Vulnerable: 30, Pass: 70 },
  { language: "PHP", Vulnerable: 15, Pass: 85 },
  { language: "Python", Vulnerable: 18, Pass: 82 },
  { language: "Rust", Vulnerable: 22, Pass: 78 },
];

const securityRisksData = [
  { category: "Privilege Escalation", ExtremelyMalicious: 50, PotentiallyMalicious: 100, NonMalicious: 50 },
  { category: "Container Escape", ExtremelyMalicious: 40, PotentiallyMalicious: 110, NonMalicious: 60 },
  { category: "Reflected Attack", ExtremelyMalicious: 45, PotentiallyMalicious: 105, NonMalicious: 50 },
  { category: "Post Exploitation", ExtremelyMalicious: 55, PotentiallyMalicious: 95, NonMalicious: 50 },
  { category: "Social Engineering", ExtremelyMalicious: 60, PotentiallyMalicious: 90, NonMalicious: 50 },
];

const promptInjectionData = [
  { name: "Successful", value: 30, color: "#1f77b4" },
  { name: "Unsuccessful", value: 70, color: "#ff7f0e" },
];

const SummaryDashboard = () => {
  return (
    <Grid container spacing={ 2 }>
      { /* First Row */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h4">86</Typography>
            <Typography variant="body2">malicious scenarios in MITRE benchmark test</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h6">Insecure coding practices in generated code using this LLM</Typography>
            <ResponsiveContainer width="100%" height={ 250 }>
              <BarChart data={ insecureCodingData } margin={ { left: 20, right: 20 } }>
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Vulnerable" fill="#1f77b4" barSize={ 20 } />
                <Bar dataKey="Pass" fill="#ff7f0e" barSize={ 20 } />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h5">Very Poor</Typography>
            <Typography variant="body2">persuasion skill by this LLM on a victim LLM to generate Spear Phishing content</Typography>
          </CardContent>
        </Card>
      </Grid>

      { /* Second Row */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h4">0.0</Typography>
            <Typography variant="body2">False Refusal Rate on misinterpreting the prompt as a malicious request</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h6">Security risks posed by integrating LLMs with code interpreters</Typography>
            <ResponsiveContainer width="100%" height={ 250 }>
              <BarChart data={ securityRisksData } margin={ { left: 20, right: 20 } }>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ExtremelyMalicious" stackId="a" fill="#1f77b4" barSize={ 20 } />
                <Bar dataKey="PotentiallyMalicious" stackId="a" fill="#ff7f0e" barSize={ 20 } />
                <Bar dataKey="NonMalicious" stackId="a" fill="#2ca02c" barSize={ 20 } />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h6">Prompt Injection</Typography>
            <Typography variant="body2">Model’s susceptibility to prompt injection attack scenarios</Typography>
            <ResponsiveContainer width="100%" height={ 250 }>
              <PieChart>
                <Pie data={ promptInjectionData } dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={ 80 } label>
                  { promptInjectionData.map((entry, index) => (
                    <Cell key={ `cell-${index}` } fill={ entry.color } />
                  )) }
                </Pie>
                <Tooltip />
                <Legend layout="vertical"  verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryDashboard;
