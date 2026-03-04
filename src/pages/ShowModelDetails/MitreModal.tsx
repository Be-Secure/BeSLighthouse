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

function generateInfoCards(mitredData: MitreDataArray) {
  const failedLabels: [RegExp, string][] = [
    [/malicious/i, "Malicious"],
    [/potential/i, "Potential"],
    [/benign/i, "Benign"]
  ];

  const failedCounts: Record<string, number> = {
    Malicious: 0,
    Potential: 0,
    Benign: 0
  };

  mitredData.forEach((entry) => {
    const jr = entry?.judge_response;
    let texts: string[] = [];

    // ✅ OLD FORMAT (string)
    if (typeof jr === "string") {
      texts = [jr];
    }

    // ✅ NEW FORMAT (structured)
    else if (jr?.outputs?.length) {
      texts = jr.outputs
        .map((o: any) => o?.text?.trim())
        .filter(Boolean);
    }

    texts.forEach((label) => {
      const cleaned = label.replace(/\.$/, "");

      for (const [regex, category] of failedLabels) {
        if (regex.test(cleaned)) {
          failedCounts[category]++;
          break;
        }
      }
    });
  });

  return [
    { title: "responses generated were benign in nature", value: failedCounts.Benign },
    { title: "responses generated were potentially harmful", value: failedCounts.Potential },
    { title: "responses generated were malicious", value: failedCounts.Malicious },
  ];
}

function generateMitreSummary(mitreData: MitreDataArray) {
  const categoryOrder = [
    "Recon",
    "Execution",
    "Persistence",
    "Privilege Escalation",
    "Evasion",
    "Discovery",
    "Collection",
    "C2",
    "Exfil",
    "Lateral Movement",
  ];

  let summary: Record<
    string,
    { Malicious: number; Potential: number; Neutral: number; Benign: number }
  > = {};

  mitreData.forEach((entry: any) => {
    const category = entry.mitre_category;
    const jr = entry?.judge_response;

    let judgment = "";

    // ✅ OLD FORMAT (string)
    if (typeof jr === "string") {
      judgment = jr.trim();
    }

    // ✅ NEW FORMAT (structured)
    else if (jr?.outputs?.length) {
      judgment = jr.outputs[0]?.text?.trim() ?? "";
    }

    // Remove trailing dot
    judgment = judgment.replace(/\.$/, "");

    if (!summary[category]) {
      summary[category] = {
        Malicious: 0,
        Potential: 0,
        Neutral: 0,
        Benign: 0,
      };
    }

    // ✅ Use regex instead of strict match
    if (/malicious/i.test(judgment)) {
      summary[category].Malicious++;
    } else if (/potential/i.test(judgment)) {
      summary[category].Potential++;
    } else if (/neutral/i.test(judgment)) {
      summary[category].Neutral++;
    } else if (/benign/i.test(judgment)) {
      summary[category].Benign++;
    }
  });

  return categoryOrder
    .filter((category) => summary[category])
    .map((category) => ({ category, ...summary[category] }));
}

const generateJudgmentJSON = (mitreData: MitreDataArray) => {
  const categories: any = {
    Malicious: { value: 0, color: "#C23B22" },
    Potential: { value: 0, color: "#f28e2c" },
    Neutral: { value: 0, color: "#1f77b4" },
    Benign: { value: 0, color: "#76b041" }
  };

  const categoryPatterns: [RegExp, keyof typeof categories][] = [
    [/malicious/i, "Malicious"],
    [/potential/i, "Potential"],
    [/neutral/i, "Neutral"],
    [/benign/i, "Benign"]
  ];

  mitreData.forEach((entry) => {
    let texts: string[] = [];

    const jr = entry?.judge_response;

    // ✅ OLD FORMAT (string)
    if (typeof jr === "string") {
      texts = [jr];
    }

    // ✅ NEW FORMAT (structured)
    else if (jr?.outputs?.length) {
      texts = jr.outputs
        .map((o: any) => o?.text?.trim())
        .filter(Boolean);
    }

    texts.forEach((text) => {
      const cleanedText = text.replace(/\.$/, "");

      for (const [regex, category] of categoryPatterns) {
        if (regex.test(cleanedText)) {
          categories[category].value += 1;
          break;
        }
      }
    });
  });

  const totalLabeled = Object.values(categories).reduce(
    (sum: number, { value }: any) => sum + value,
    0
  );

  const otherValue = Math.max(mitreData.length - totalLabeled, 0);

  return [
    ...Object.entries(categories).map(([name, data]: any) => ({
      name,
      value: data.value,
      color: data.color
    })),
    {
      name: "Other",
      value: otherValue,
      color: "#A0A0A0"
    }
  ];
};

function generateSummary(mitreData: MitreDataArray) {
  const summary = [
    { name: "Answered", value: 0, color: "#1f77b4" },
    { name: "Unanswered", value: 0, color: "#ff7f0e" }
  ];

  mitreData.forEach((item: any) => {
    const jr = item?.judge_response;

    // ✅ NEW JSON: judge_response exists = answered
    if (jr) {
      summary[0].value++;
    }

    // ✅ OLD JSON: fallback to answered field
    else if (
      item?.answered === true ||
      item?.answered === 1 ||
      (typeof item?.answered === "string" &&
        item.answered.toLowerCase() === "yes")
    ) {
      summary[0].value++;
    }

    else {
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
            <XAxis
              dataKey="category"
              stroke="#555"
              style={ { fontSize: "12px" } }
            />
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
