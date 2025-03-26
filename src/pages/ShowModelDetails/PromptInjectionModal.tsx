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
import { PromptInjectionDataArray } from "./SummaryDashboard";

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
      lg={ 6 }
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
              <XAxis dataKey="category"/>
              <YAxis label={ { value: "Count", angle: -90, position: "insideLeft" } } />
              <Tooltip />
              <Legend wrapperStyle={ { fontSize: "13px", paddingTop: "8px" } }/>
              <Bar dataKey="Total Count" stackId="a" fill="#1F77B4" name="Total" barSize={ 20 }  />
              <Bar dataKey="Injection Unsuccessful" stackId="a" fill="#388E3C" name="Injection Unsuccessful" barSize={ 20 }  />
              <Bar dataKey="Injection Successful" stackId="a" fill="#D32F2F" name="Injection Successful" barSize={ 20 }  />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Grid>
  );
};

function generateInfoCards(promptInjectionData: PromptInjectionDataArray, promptInjectionSummaryData: any) {

  const infoCards = [
    { title: "prompt injection attempts processed", value: promptInjectionData.length },
    { title: "prompt injections were successful", value: promptInjectionSummaryData?.stat_per_model.injection_successful_count }
  ];

  return infoCards;
}

function generateChartData(statsObject: any, categoryLabels: Record<string, string>) {
  return Object.entries(statsObject).map(([category, stats]: any) => ({
    category: categoryLabels[category] || category.replace(/_/g, " "),
    "Injection Successful": stats.injection_successful_count,
    "Injection Unsuccessful": stats.injection_unsuccessful_count,
    "Total Count": stats.total_count,
  }));
}

const categoryLabels = {
  "security-violating": "Security Violating",
  "logic-violating": "Logic Violating",
  "direct": "Direct",
  "indirect": "Indirect"
};


function generateInjectionSummary(promptInjectionData: any[], promptInjectionSummaryData: any) {
  let summary: Record<string, { category: string; "Injection Successful": number; "Injection Unsuccessful": number; "Total Count": number }> = {};

  promptInjectionData.forEach((entry) => {
    const variant = entry.injection_variant; // Extract injection variant

    if (!summary[variant]) {
      summary[variant] = { category: variant, "Injection Successful": 0, "Injection Unsuccessful": 0, "Total Count": 0 };
    }

    // Check if the variant exists in `promptInjectionSummaryData.stat_per_model_per_injection_variant`
    if (promptInjectionSummaryData.stat_per_model_per_injection_variant[variant]) {
      const stats = promptInjectionSummaryData.stat_per_model_per_injection_variant[variant];

      summary[variant]["Injection Successful"] = stats.injection_successful_count;
      summary[variant]["Injection Unsuccessful"] = stats.injection_unsuccessful_count;
      summary[variant]["Total Count"] = stats.total_count;
    }
  });

  return Object.values(summary); // Convert object into an array
}

const PromptInjectionModal = ({ promptInjectionData, promptInjectionSummaryData }: any) => {
  const infoCards = generateInfoCards(promptInjectionData, promptInjectionSummaryData);
  const attackData = generateInjectionSummary(promptInjectionData, promptInjectionSummaryData);
  const riskCategoryData = generateChartData(promptInjectionSummaryData.stat_per_model_per_risk_category, categoryLabels);
  const injectionTypeData = generateChartData(promptInjectionSummaryData.stat_per_model_per_injection_type, categoryLabels);

  return (
    <Box sx={ { bgcolor: "#f4f4f4", width: "100%" } }>
      { /* min-width: 1288px; */ }
      <Grid container spacing={ 1 } alignItems="stretch">
        { /* Left Section (MITRE Tests + Info Cards) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 4 } container spacing={ 1 } direction="column" sx={ { display: 'flex' } }>
          { /* MITRE Tests Introduction */ }
          <Grid container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 12 }>
              <Card sx={ { height: "100%", display: "flex", justifyContent: "center", marginLeft: '8px' } }>
                <Typography variant="body2" color="textSecondary" style={ { paddingLeft: "10px" } }>
                  <b>Prompt Injection Tests</b> assess an LLM’s susceptibility to “prompt injection attacks” in which a portion of the LLM prompt coming from untrusted user input contains malicious instructions intended to override the LLM’s original task.
                </Typography>
              </Card>
            </Grid>
          </Grid>

          { /* Info Cards */ }
          <Grid item container spacing={ 1 } sx={ { flex: 1 } }>
            { infoCards.map((card, index) => (
              <Grid item xs={ 12 } md={ 12 } lg={ 6 } key={ index }>
                <InfoCard title={ card.title } value={ card.value } />
              </Grid>
            )) }
          </Grid>
        </Grid>

        { /* Right Section (Pie Charts) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 8 } container spacing={ 2 } justifyContent="center"
          sx={ {
            paddingTop: "8px !important", "@media (max-width:1196px)": {
              marginTop: "-8px",
            }
          } }>
          <CustomStackedBarChart title="Risk category wise violations" data={ riskCategoryData } padding={ 16 } />
          <CustomStackedBarChart title="Injection type wise violations" data={ injectionTypeData } padding={ 8 } />
        </Grid>
      </Grid>

      <Card sx={ { width: '100%', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px", height: "380px" } }>
        <Typography variant="h6" pt={ 0 } sx={ { mt: 0, textAlign: "center", fontWeight: "bold" } }>
          Prompt injection variant wise distribution of violations
        </Typography>
        <ResponsiveContainer width="100%" height={ 300 }>
          <BarChart data={ attackData } margin={ { left: 20, right: 20 } } barGap={ 3 }>
            <XAxis
              dataKey="category"
              stroke="#555"
              style={ { fontSize: "12px" } }
              angle={ 45 }
              textAnchor="start"
            />
            <YAxis stroke="#555" />
            <Tooltip />
            <Legend wrapperStyle={ { fontSize: "13px", paddingTop: "15px", marginTop: "40px", bottom: "-33px" } } />
            <Bar dataKey="Injection Successful" stackId="a" fill="#D32F2F" barSize={ 20 }/>
            <Bar dataKey="Injection Unsuccessful" stackId="a" fill="#388E3C" barSize={ 20 } />
            <Bar dataKey="Total Count" stackId="a" fill="#1F77B4" barSize={ 20 } />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default PromptInjectionModal;
