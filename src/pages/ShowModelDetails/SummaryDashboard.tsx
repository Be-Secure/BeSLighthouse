import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { verifyLink } from "../../utils/verifyLink";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import MitreModal from "./MitreModal";
import { SpearPhishingModal } from "./SpearPhishingModalDetails";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: 'fit-content',
  overflow: 'auto',
  maxWidth: '90%',
  width: 1200,
  height: 800,
  bgcolor: 'background.paper',
  // border: '2px solid ',
  boxShadow: 24,
  p: 4,
};

interface AttackCategory {
  is_extremely_malicious?: number;
  is_potentially_malicious?: number;
  is_non_malicious?: number;
  total_count?: number;
  malicious_percentage?: number;
};

interface InterpreterData {
  [attak: string]: AttackCategory;
};

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

export type MitreDataArray = MitreData[];

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

// eslint-disable-next-line no-unused-vars
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const colorCode: ColorCode = {
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


// eslint-disable-next-line no-unused-vars
function countMalicious(judgeResponse: MitreDataArray) {
  return judgeResponse?.reduce((count, item) => {
    return count + (item.judge_response?.outputs || []).filter(output => output?.text?.trim() === "Malicious.").length;
  }, 0);
}

const generateData = (mitredata: any) => {
  const failedLabels = ["Malicious.", "Potential."];
  let failedCount = 0;

  mitredata.forEach((entry: any) => {
    if (entry.judge_response && entry.judge_response.outputs) {
      entry.judge_response.outputs.forEach((output: any) => {
        if (failedLabels.includes(output.text.trim())) {
          failedCount++; // Count failed responses
        }
      });
    }
  });

  return [
    { name: "Failed", value: failedCount, color: "#E87D3E" },
    { name: "Total", value: mitredata.length, color: "#1C4E80" }
  ];
};

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
  const [open, setOpen] = useState(false);
  const [openSpear, setOpenSpear] = useState(false);
  const handleOpen = () => setOpenSpear(true);
  const handleClose = () => setOpenSpear(false);
  const handleOpenMitre = () => setOpen(true);

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

  const data = generateData(mitreData);

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

  const spearPhishingNumber = spearPhishingData.model_stats?.persuasion_average ? spearPhishingData.model_stats.persuasion_average : 0;

  const promptInjectionresult = [
    { name: "Successful", value: promptInjectionData?.stat_per_model?.injection_successful_count ?? 0, color: "#1f77b4" },
    { name: "Unsuccessful", value: promptInjectionData?.stat_per_model?.injection_unsuccessful_count ?? 0, color: "#ff7f0e" },
  ];

  return (
    <Grid container spacing={ 1 } pt={ 1 } pb={ 2 }>
      { /* First Row */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        { mitreData.length > 0 ? (
          <>
            <Button
              onClick={ handleOpenMitre }
              variant="contained"
              sx={ {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'none',
                width: '100%'
              } }
              style={ { backgroundColor: 'white' } }
            >
              <CardContent sx={ { textAlign: "center", width: "100%", paddingBottom: "8px" } }>
                { /* Title */ }
                <Typography variant="subtitle1" sx={ { fontWeight: "bold" } }>
                  MITRE
                </Typography>
                <Typography variant="subtitle2" sx={ { fontWeight: "bold" } }>
                  Benchmark Tests
                </Typography>

                { /* Pie Chart Container */ }
                <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", mt: 1 } }>
                  <PieChart width={ 100 } height={ 100 }>
                    <Pie
                      data={ data }
                      cx="50%"
                      cy="50%"
                      innerRadius={ 30 }
                      outerRadius={ 45 }
                      dataKey="value"
                      stroke="none"
                    >
                      { data.map((entry, index) => (
                        <Cell key={ `cell-${index}` } fill={ entry.color } />
                      )) }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </Box>

                { /* Legend */ }
                <Box sx={ { display: "flex", justifyContent: "center", gap: 1, mt: 1 } }>
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
                      <Typography variant="caption" sx={ { fontSize: "14px", color: "textSecondary" } }>
                        { item.name }
                      </Typography>
                    </Box>
                  )) }
                </Box>
              </CardContent>
              { /* </Card> */ }
            </Button>

            { /* Modal */ }
            <Modal
              open={ open }
              onClose={ () => setOpen(false) }
              closeAfterTransition
              slots={ { backdrop: Backdrop } }
              slotProps={ { backdrop: { timeout: 500 } } }
            >
              <Fade in={ open }>
                <Box
                  sx={ {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                  } }
                >
                  <MitreModal mitreData={ mitreData } />
                </Box>
              </Fade>
            </Modal>
          </>
        ) : (
          <Card
            sx={ {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 2,
              boxShadow: 3, // Adds slight shadow for better contrast
              borderRadius: 2, // Matches smooth edges
            } }
          >
            <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", height: 200 } }>
              <Typography variant="body1" color="textSecondary">
                Mitre data not available
              </Typography>
            </Box>
          </Card>
        ) }
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 7 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Box sx={ { display: "flex", justifyContent: "center" } }>
              <Typography variant="h6" sx={ { textAlign: "center" } }>
                Security risks in generated code using this LLM
              </Typography>
            </Box>
            { mergedInsecureCodingData.length === 0 ? (
              <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", height: 200 } }>
                <Typography variant="body1" color="textSecondary">
                  Data not available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={ 200 }>
                <BarChart data={ mergedInsecureCodingData } margin={ { left: 20, right: 20 } } barGap={ 5 }>
                  <XAxis dataKey="language" />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={ { fontSize: '12px' } } />

                  { /* Autocomplete Category */ }
                  <Bar dataKey="AutocompleteVulnerable" name="Vulnerable (Autocomplete)" fill="#d32f2f" barSize={ 20 } />
                  <Bar dataKey="AutocompletePass" name="Pass (Autocomplete)" fill="#4caf50" barSize={ 20 } />

                  { /* Instruct Category */ }
                  <Bar dataKey="InstructVulnerable" name="Vulnerable (Instruct)" fill="#ff9800" barSize={ 20 } />
                  <Bar dataKey="InstructPass" name="Pass (Instruct)" fill="#03a9f4" barSize={ 20 } />
                </BarChart>
              </ResponsiveContainer>
            ) }
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 3 }>
        { Object.keys(spearPhishingData).length > 0 ? (
          <>
            <Button
              onClick={ handleOpen }
              variant="contained"
              sx={ {
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'none',
              } }
              style={ { backgroundColor: 'white' } }
            >
              <CardContent sx={ { textAlign: "center" } }>
                { /* Bold Persuasion Skill */ }
                <Typography variant="body1" sx={ { fontSize: "1rem", mb: 1 } }>
                  <strong>Persuasion skill</strong> of this LLM to generate Spear Phishing content
                </Typography>

                { /* Dynamic Rating (Color Coded) */ }
                <Typography
                  variant="h4"
                  sx={ {
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: colorCode[spearPhishingNumber]?.color,
                    mt: 1,
                  } }
                >
                  { colorCode[spearPhishingNumber].level }
                </Typography>
              </CardContent>
            </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={ openSpear }
              onClose={ handleClose }
              closeAfterTransition
              slots={ { backdrop: Backdrop } }
              slotProps={ {
                backdrop: {
                  timeout: 500,
                },
              } }
            >
              <Fade in={ openSpear }>
                <Box sx={ modalStyle }>
                  <SpearPhishingModal spearPhishingData={ spearPhishingData } modelName={ selectedModel.name } />
                  { /* <Typography id="transition-modal-description" sx={{ mt: 2 }}> */ }

                  { /* </Typography> */ }
                </Box>
              </Fade>
            </Modal>
          </>
        ) : (
          <Card
            sx={ {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 2,
              boxShadow: 3, // Adds slight shadow for better contrast
              borderRadius: 2, // Matches smooth edges
            } }
          >
            <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", height: 200 } }>
              <Typography variant="body1" color="textSecondary">
                Spear Phishing data not available
              </Typography>
            </Box>
          </Card>
        ) }
      </Grid>

      { /* Second Row */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 2 }>
        <Card
          sx={ {
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            boxShadow: 3, // Soft shadow
            borderRadius: 2, // Rounded edges
          } }
        >
          <CardContent sx={ { textAlign: "center" } }>
            { /* Bold "False Refusal Rate" */ }
            <Typography variant="body1" sx={ { fontSize: "1rem", fontWeight: "bold", mb: 1 } }>
              False Refusal Rate
            </Typography>

            { /* Dynamic Numeric Value (Color Coded) */ }
            <Typography
              variant="h4"
              sx={ {
                fontSize: "2rem",
                fontWeight: "bold",
                color: "green", // Matches the reference image
                mt: 1,
              } }
            >
              { frrData?.refusal_count ?? 0.0 }
            </Typography>

            { /* Supporting Text */ }
            <Typography variant="body2" sx={ { mt: 1 } }>
              on misinterpreting the prompt as a malicious request
            </Typography>
          </CardContent>
        </Card>
      </Grid>


      <Grid item xs={ 12 } md={ 12 } lg={ 7 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>

            <Box sx={ { display: "flex", justifyContent: "center" } }>
              <Typography variant="h6" sx={ { textAlign: "center" } }>
                Security risks posed by integrating LLMs with code interpreters
              </Typography>
            </Box>
            { securityRisksData.length === 0 ? (
              <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", height: 200 } }>
                <Typography variant="body1" color="textSecondary">
                  Data not available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={ 240 }>
                <BarChart data={ securityRisksData } margin={ { left: 20, right: 20 } }>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={ { fontSize: '12px' } } />
                  <Bar dataKey="ExtremelyMalicious" stackId="a" fill="#1f77b4" barSize={ 20 } />
                  <Bar dataKey="PotentiallyMalicious" stackId="a" fill="#ff7f0e" barSize={ 20 } />
                  <Bar dataKey="NonMalicious" stackId="a" fill="#2ca02c" barSize={ 20 } />
                </BarChart>
              </ResponsiveContainer>
            ) }
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 3 }>
        <Card sx={ { height: "100%" } }>
          <CardContent>
            <Typography variant="h2" sx={ { fontSize: "2rem", textAlign: "center" } }>Prompt Injection</Typography>
            <Typography variant="body2">Model’s susceptibility to prompt injection attack scenarios</Typography>
            { promptInjectionresult[0].value === 0 && promptInjectionresult[1].value === 0 ? (
              <Box sx={ { display: "flex", justifyContent: "center", alignItems: "center", height: 200 } }>
                <Typography variant="body1" color="textSecondary">
                  Data not available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={ 180 }>
                <PieChart>
                  <Pie data={ promptInjectionresult } dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={ 50 } label>
                    { promptInjectionresult.map((entry, index) => (
                      <Cell key={ `cell-${index}` } fill={ entry.color } />
                    )) }
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={ { fontSize: '12px' } } />
                </PieChart>
              </ResponsiveContainer>
            ) }
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryDashboard;
