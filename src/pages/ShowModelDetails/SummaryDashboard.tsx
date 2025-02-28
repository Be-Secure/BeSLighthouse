import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { verifyLink } from "../../utils/verifyLink";
import { besecureMlAssessmentDataStore } from "../../dataStore";

interface AttackCategory {
  is_extremely_malicious?: number;
  is_potentially_malicious?: number;
  is_non_malicious?: number;
  total_count?: number;
  malicious_percentage?: number;
};

interface InterpreterData {
  [attak: string]: AttackCategory;
}

interface MitreData {
  prompt_id?: number;
  pass_id?: number;
  answered?: string;
  test_case_prompt?: {
    prompt?: string;
  };
  initial_response?: string;
  expansion_response?: {
    outputs?: {
      text?: string;
      stop_reason?: string;
    }[];
  };
  judge_response?: {
    outputs?: {
      text?: string;
      stop_reason?: string;
    }[];
  };
  mitre_category?: string;
}

interface FRRData {
  accept_count?: number;
  refusal_count?: number;
  refusal_rate?: number;
}

interface ModelStats {
  overall_score_average: number;
  overall_score_variance: number;
  persuasion_average: number;
  persuasion_variance: number;
  rapport_average: number;
  rapport_variance: number;
  argumentation_average: number;
  argumentation_variance: number;
  total_challenges_processed: number;
}

interface GoalStats {
  [goal: string]: {
    [modelName: string]: number;
  };
}

interface SpearPhishingStats {
  model_stats?: ModelStats;
  goal_stats?: GoalStats;
}

interface InjectionStats {
  injection_successful_count?: number;
  injection_unsuccessful_count?: number;
  total_count?: number;
  injection_successful_percentage?: number;
  injection_unsuccessful_percentage?: number;
}

interface PromptInjectionStats {
  stat_per_model_per_injection_variant?: {
    [variant: string]: InjectionStats;
  };
  stat_per_model_per_injection_type?: {
    [type: string]: InjectionStats;
  };
  stat_per_model_per_risk_category?: {
    [category: string]: InjectionStats;
  };
  stat_per_model_per_speaking_language?: {
    [language: string]: InjectionStats;
  };
  stat_per_model?: InjectionStats;
}

type MitreDataArray = MitreData[];

interface LanguageStats {
  bleu: number;
  total_count: number;
  vulnerable_percentage: number;
  vulnerable_suggestion_count: number;
  pass_rate: number;
}

interface AutocompleteData {
  [language: string]: LanguageStats;
}

interface InstructData {
  [language: string]: LanguageStats;
}

interface SeverityLevel {
  level: string;
  severity: string;
  color: string;
}

interface ColorCode {
  [key: number]: SeverityLevel;
}

const colorCode: ColorCode = {
  0: {
    "level": "Very Poor",
    "severity": "Minimal/No Vulnerability",
    "color": "#008000"
  },
  1: {
    "level": "Poor",
    "severity": "Low Vulnerability",
    "color": "#90EE90"
  },
  2: {
    "level": "Intermediate",
    "severity": "Medium Vulnerability",
    "color": "#FFFF00"
  },
  3: {
    "level": "Good",
    "severity": "High Vulnerability",
    "color": "#FFA500"
  },
  4: {
    "level": "Excellent",
    "severity": "Critical Vulnerability",
    "color": "#FF0000"
  }
};


function countMalicious(judgeResponse: MitreDataArray) {
  return judgeResponse?.reduce((count, item) => {
    return count + (item.judge_response?.outputs || []).filter(output => output?.text?.trim() === "Malicious.").length;
  }, 0);
}

function aggregateInjectionResults(data: PromptInjectionStats, promptInjectionresult: any) {
  Object.values(data).forEach((category) => {
    if (typeof category === "object") {
      Object.values(category).forEach((stats: any) => {
        if (stats.injection_successful_count !== undefined) {
          promptInjectionresult[0].value += stats.injection_successful_count;
        }
        if (stats.injection_unsuccessful_count !== undefined) {
          promptInjectionresult[1].value += stats.injection_unsuccessful_count;
        }
      });
    }
  });
}

const SummaryDashboard = ({ model }: any) => {

  const selectedModel = model.length > 0 ? model[0] : {};
  const urls = [
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-interpreter-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-autocomplete-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-instruct-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-mitre-test-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-frr-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-spear-phishing-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-prompt-injection-test-summary-report.json`
  ];
  const [interpreterData, setInterpreterData] = useState<InterpreterData>({});
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteData>({});
  const [instructData, setInstructData] = useState<InstructData>({});
  const [mitreData, setMitreData] = useState<MitreDataArray>([]);
  const [frrData, setFrrData] = useState<FRRData>({});
  const [spearPhishingData, setSpearPhishingData] = useState<SpearPhishingStats>({});
  const [promptInjectionData, setPromptInjectionData] = useState<PromptInjectionStats>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          verifyLink(urls[0], setInterpreterData),
          verifyLink(urls[1], setAutocompleteData),
          verifyLink(urls[2], setInstructData),
          verifyLink(urls[3], setMitreData, []),
          verifyLink(urls[4], setFrrData),
          verifyLink(urls[5], setSpearPhishingData),
          verifyLink(urls[6], setPromptInjectionData)
        ]);
      } catch (err) {
        // Fix me later
      } finally {
        // Fix me later
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel.name]);

  const languages = new Set([...Object.keys(autocompleteData), ...Object.keys(instructData)]);

  const maliciousCount = countMalicious(mitreData);

  // Transform data
  const mergedInsecureCodingData = Array.from(languages).map(lang => ({
    language: lang,
    AutocompleteVulnerable: autocompleteData[lang]?.vulnerable_percentage || 0,
    AutocompletePass: autocompleteData[lang]?.pass_rate || 0,
    InstructVulnerable: instructData[lang]?.vulnerable_percentage || 0,
    InstructPass: instructData[lang]?.pass_rate || 0
  }));

  const securityRisksData = Object.entries(interpreterData).map(([category, values]) => ({
    category,
    ExtremelyMalicious: values.is_extremely_malicious,
    PotentiallyMalicious: values.is_potentially_malicious,
    NonMalicious: values.is_non_malicious,
  }));

  const spearPhishingNUmber = spearPhishingData.model_stats?.persuasion_average ? spearPhishingData.model_stats.persuasion_average : 0;

  const promptInjectionresult = [
    { name: "Successful", value: 0, color: "#1f77b4" },
    { name: "Unsuccessful", value: 0, color: "#ff7f0e" },
  ];

  aggregateInjectionResults(promptInjectionData, promptInjectionresult);

  return (
    <Grid container spacing={ 2 } pt={ 2 } pb={ 2 }>
      { /* First Row */ }
      <Grid item xs={ 12 } md={ 3 } lg={ 1.5 }>
        <Card sx={ { height: "100%", display: "flex", alignItems: "center", justifyContent: "center" } }>
          <CardContent sx={ { textAlign: "center" } }>
            <Typography variant="h2" sx={ { fontSize: "5rem" } }>{ maliciousCount }</Typography>
            <Typography variant="body2">malicious scenarios in MITRE benchmark test</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 6 } lg={ 7.5 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Box sx={ { display: "flex", justifyContent: "center" } }>
              <Typography variant="h6" sx={ { textAlign: "center" } }>
                Security risks in generated code using this LLM
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={ 200 }>
              <BarChart data={ mergedInsecureCodingData } margin={ { left: 20, right: 20 } } barGap={ 5 }>
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Legend />

                { /* Autocomplete Category */ }
                <Bar dataKey="AutocompleteVulnerable" name="Vulnerable (Autocomplete)" fill="#d32f2f" barSize={ 20 } />
                <Bar dataKey="AutocompletePass" name="Pass (Autocomplete)" fill="#4caf50" barSize={ 20 } />

                { /* Instruct Category */ }
                <Bar dataKey="InstructVulnerable" name="Vulnerable (Instruct)" fill="#ff9800" barSize={ 20 } />
                <Bar dataKey="InstructPass" name="Pass (Instruct)" fill="#03a9f4" barSize={ 20 } />

              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 3 } lg={ 3 }>
        <Card sx={ { height: "100%", display: "flex", alignItems: "center", justifyContent: "center" } }>
          <CardContent sx={ { textAlign: "center" } }>
            <Typography variant="h2" sx={ { fontSize: "2rem", color: colorCode[spearPhishingNUmber]?.color } }>{ colorCode[spearPhishingNUmber].level }</Typography>
            <Typography variant="body2">
              persuasion skill by this LLM on a victim LLM to generate Spear Phishing content
            </Typography>
          </CardContent>
        </Card>
      </Grid>


      { /* Second Row */ }
      <Grid item xs={ 12 } md={ 3 } lg={ 1.5 }>
        <Card sx={ { height: "100%", display: "flex", alignItems: "center", justifyContent: "center" } }>
          <CardContent sx={ { textAlign: "center" } }>
            <Typography variant="h2" sx={ { fontSize: "5rem" } }>{ frrData?.refusal_count ?? 0.0 }</Typography>
            <Typography variant="body2">
              False Refusal Rate on misinterpreting the prompt as a malicious request
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 6 } lg={ 7.5 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>

            <Box sx={ { display: "flex", justifyContent: "center" } }>
              <Typography variant="h6" sx={ { textAlign: "center" } }>
                Security risks posed by integrating LLMs with code interpreters
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={ 240 }>
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

      <Grid item xs={ 12 } md={ 3 } lg={ 3 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h2" sx={ { fontSize: "2rem", textAlign: "center" } }>Prompt Injection</Typography>
            <Typography variant="body2">Model’s susceptibility to prompt injection attack scenarios</Typography>
            <ResponsiveContainer width="100%" height={ 180 }>
              <PieChart>
                <Pie data={ promptInjectionresult } dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={ 50 } label>
                  { promptInjectionresult.map((entry, index) => (
                    <Cell key={ `cell-${index}` } fill={ entry.color } />
                  )) }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryDashboard;
