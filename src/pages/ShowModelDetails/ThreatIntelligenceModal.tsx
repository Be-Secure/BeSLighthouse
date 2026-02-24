import React, { useMemo } from "react";
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

const STACK_ID = "a";

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

const ThreatIntelligenceModal = ({ threatIntelligenceSummary }: any) => {

  const series = useMemo(
    () => [
      { key: "correct_mc_count", label: "Correct", fill: "#D32F2F" },
      { key: "incorrect_mc_count", label: "Incorrect", fill: "#388E3C" },
      { key: "response_parsing_error_count", label: "Parsing Errors", fill: "#1F77B4" },
      { key: "fail_to_query_count", label: "Fail to Query", fill: "#9467BD" },
    ],
    []
  );

  const sourceData = useMemo(() => {
    const perSource = threatIntelligenceSummary?.stat_per_model_per_source;

    if (!perSource) return [];

    return Object.entries(perSource).map(([sourceName, stats]: any) => ({
      source: sourceName,
      correct_mc_count: stats?.correct_mc_count ?? 0,
      incorrect_mc_count: stats?.incorrect_mc_count ?? 0,
      response_parsing_error_count: stats?.response_parsing_error_count ?? 0,
      fail_to_query_count: stats?.fail_to_query_count ?? 0,
    }));
  }, [threatIntelligenceSummary]);

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
                  <b>Threat Intelligence Reasoning</b> uses the MITRE ATT&CK framework to evaluate an LLM’s compliance when asked to assist in cyberattacks.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title="test cases with harmful intent executed on the model" value={ 123 } />
            </Grid>
          </Grid>
  
          { /* Info Cards */ }
          <Grid item container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title={ "ssssss" } value={ "ssssdddd" } />
            </Grid>
          </Grid>
        </Grid>
  
        { /* Right Section (Pie Charts) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 6 } container spacing={ 2 } justifyContent="center"
          sx={ {
            paddingTop: "8px !important", "@media (max-width:1196px)": {
              marginTop: "-8px",
            }
          } }>
          <Card>sudhir</Card>
        </Grid>
      </Grid>

      <Card sx={ { width: '100%', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px", height: "380px" } }>
        <Typography variant="h6" pt={ 0 } sx={ { mt: 0, textAlign: "center", fontWeight: "bold" } }>
          Threat Intelligence Reasoning - Source Wise Distribution of Violations
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sourceData}
            margin={{ top: 10, right: 20, left: 20, bottom: 55 }}
            barGap={3}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="source"
              stroke="#555"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis stroke="#555" />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
            />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stackId={STACK_ID}
                fill={s.fill}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
};

export default ThreatIntelligenceModal;
