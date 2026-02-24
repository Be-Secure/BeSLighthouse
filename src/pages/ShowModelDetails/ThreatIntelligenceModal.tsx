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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const STACK_ID = "a";

interface InfoCardProps {
  title: string;
  value: string | number;
}

type SourceStats = {
  correct_mc_count: number;
  incorrect_mc_count: number;
  response_parsing_error_count: number;
  fail_to_query_count: number;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => (
  <Card sx={ { textAlign: "center", bgcolor: "#fff", display: "flex", justifyContent: "center", boxShadow: 2, borderRadius: 2, height: "100%" } }>
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
  <Grid item xs={ 12 } md={ 12 } lg={ 12 } sx={ { paddingTop: "8px !important", paddingLeft: `${padding}px !important`, display: "flex" } }>
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

  const buildSourcePieData = (
    perSource: Record<string, SourceStats>,
    colorMap: Record<string, string> = {}
  ) => {
    const defaultColors = [
      "#1976d2", "#9c27b0", "#2e7d32", "#ed6c02",
      "#d32f2f", "#0288d1", "#6d4c41", "#455a64",
    ];

    let i = 0;
    return Object.entries(perSource).map(([source, s]) => {
      const total =
        (s.correct_mc_count ?? 0) +
        (s.incorrect_mc_count ?? 0) +
        (s.response_parsing_error_count ?? 0) +
        (s.fail_to_query_count ?? 0);

      const color = colorMap[source] ?? defaultColors[i++ % defaultColors.length];

      return { name: source, value: total, color };
    });
  };

  const pieData = buildSourcePieData(threatIntelligenceSummary.stat_per_model_per_source, {
    CISA: "#D32F2F",
    NSA: "#388E3C",
    IC3: "#1976D2",
    CrowdStrike: "#FBC02D",
  });

  return (
    <Box sx={ { bgcolor: "#f4f4f4", width: "100%" } }>
      { /* min-width: 1288px; */ }
      <Grid container spacing={ 1 } alignItems="stretch">
        { /* Left Section (MITRE Tests + Info Cards) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 8 } container spacing={ 1 } direction="column" sx={ { display: 'flex' } }>
          <Grid container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 8 }>
              <Card sx={ { height: "100%", display: "flex", justifyContent: "center", marginLeft: '8px' } }>
                <Typography variant="body2" color="textSecondary" style={ { paddingLeft: "10px"} }>
                  <b>Threat Intelligence Reasoning</b> uses the MITRE ATT&CK framework to evaluate an LLM’s compliance when asked to assist in cyberattacks.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title={ "Total score" } value={ Number(threatIntelligenceSummary?.stat_per_model?.total_score ?? 0).toFixed(2) } />
            </Grid>
          </Grid>
  
          { /* Info Cards */ }
          <Grid item container spacing={ 1 } sx={ { flex: 1 } }>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title={ "MCQs were answered incorrectly" } value={ threatIntelligenceSummary?.stat_per_model?.incorrect_mc_count ?? 0 } />
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title="MCQs were answered correctly" value={ threatIntelligenceSummary?.stat_per_model?.correct_mc_count ?? 0 } />
            </Grid>
            <Grid item xs={ 12 } md={ 12 } lg={ 4 }>
              <InfoCard title={ "Avg score" } value={ Number(threatIntelligenceSummary?.stat_per_model?.avg_score ?? 0).toFixed(2) } />
            </Grid>
          </Grid>
        </Grid>
  
        { /* Right Section (Pie Charts) */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 4 } container spacing={ 2 } justifyContent="center"
          sx={ {
            paddingTop: "8px !important", "@media (max-width:1196px)": {
              marginTop: "-8px",
            }
          } }>
          <CustomPieChart data={ pieData } title="Total items per source" padding={ 16 } />
        </Grid>
      </Grid>

      <Card sx={ { width: '100%', marginTop: '9px', paddingTop: "10px", paddingBottom: "10px" } }>
        <Typography variant="h6" pt={ 0 } sx={ { mt: 0, textAlign: "center", fontWeight: "bold" } }>
          Threat Intelligence Reasoning - Source Wise Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sourceData}
            margin={ { left: 20, right: 20 } }
            barGap={ 5 }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="source"
              stroke="#555"
              style={{ fontSize: "12px" }}
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
