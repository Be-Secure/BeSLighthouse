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
import PromptInjectionModal from "./PromptInjectionModal";
import { AutocompleteModal } from "./AutocompleteModalDetails";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'auto',
  width: '90%',
  maxHeight: "90vh",
  bgcolor: "#eeeeee",
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

interface AutoCompleteDetailData {
  prompt_id?: number;
  pass_id?: number;
  test_case_prompt?: string;
  cwe_identifier?: string;
  language?: string;
  line_text?: string;
  origin_code?: string;
  variant?: string;
  rule?: string;
  repo?: string;
  model?: string;
  icd_result?: string;
  icd_cwe_detections?: [ string ];
  bleu_score?: number;
  original_code?: string;
}

export type AutocompleteDetailDataArray = AutoCompleteDetailData[];


interface PromptInjectionData {
  prompt_id: number;
  pass_id: number;
  test_case_prompt: string;
  user_input: string;
  response: string;
  judge_response: string;
  injection_type: string;
  injection_variant: string;
  risk_category: string;
  speaking_language: string;
  model: string;
}

export type PromptInjectionDataArray = PromptInjectionData[];

interface LanguageStats {
  bleu: number;
  total_count: number;
  vulnerable_percentage: number;
  vulnerable_suggestion_count: number;
  pass_rate: number;
}

export interface AutocompleteData {
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

const generateData = (mitredata: MitreDataArray) => {
  const failedLabels: [RegExp, string][] = [
    [/malicious/i, "Malicious"],
    [/potential/i, "Potential"]
  ];

  const failedCounts: Record<string, number> = {
    Malicious: 0,
    Potential: 0
  };

  mitredata.forEach((entry) => {
    entry.judge_response?.outputs?.forEach(({ text }: any) => {
      const label = text.trim();

      for (const [regex, category] of failedLabels) {
        if (regex.test(label)) {
          failedCounts[category]++;
        }
      }
    });
  });

  return [
    { name: "Malicious", value: failedCounts.Malicious, color: "#C23B22" },
    { name: "Potential", value: failedCounts.Potential, color: "#f28e2c" },
    {
      name: "Other",
      value: mitredata.length - (failedCounts.Malicious + failedCounts.Potential),
      color: "#A0A0A0"
    }
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
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-prompt-injection-test-summary-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-prompt-injection-test-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-autocomplete-test-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-instruct-test-detailed-report.json`
  ];
  const [interpreterData, setInterpreterData] = useState<InterpreterData>({});
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteData>({});
  const [instructData, setInstructData] = useState<InstructData>({});
  const [mitreData, setMitreData] = useState<MitreDataArray>([]);
  const [promptInjectionData, setPromptInjectionData] = useState<PromptInjectionStats>({});
  const [frrData, setFrrData] = useState<FRRData>({});
  const [spearPhishingData, setSpearPhishingData] = useState<SpearPhishingStats>({});
  const [promptInjectionSummaryData, setPromptInjectionSummaryData] = useState<PromptInjectionStats>({});
  const [autocompleteDetailedData, setAutocompleteDetailedData] = useState<AutocompleteDetailDataArray>([]);
  const [instructTestDetailedData, setInstructTestDetailedData] = useState<AutocompleteDetailDataArray>([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [openInstruct, setOpenInstruct] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPromptInjection, setOpenPromptInjection] = useState(false);
  const [openSpear, setOpenSpear] = useState(false);
  const handleOpen = () => setOpenSpear(true);
  const handleClose = () => setOpenSpear(false);
  const handleOpenMitre = () => setOpen(true);
  const handleOpenPromptInjection = () => setOpenPromptInjection(true);
  const handleOpenAutocomplete = () => setOpenAutocomplete(true);
  const handleCloseAutocomplete = () => setOpenAutocomplete(false);
  const handleOpenInstruct = () => setOpenInstruct(true);
  const handleCloseInstruct = () => setOpenInstruct(false);

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
          verifyLink(urls[6], setPromptInjectionSummaryData),
          verifyLink(urls[7], setPromptInjectionData, []),
          verifyLink(urls[8], setAutocompleteDetailedData, []),
          verifyLink(urls[9], setInstructTestDetailedData, [])
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
    "Extremely Malicious": values.is_extremely_malicious,
    "Potentially Malicious": values.is_potentially_malicious,
    "Non-Malicious": values.is_non_malicious,
  }));

  const spearPhishingNumber = spearPhishingData.model_stats?.persuasion_average ? spearPhishingData.model_stats.persuasion_average : 0;

  const promptInjectionresult = [
    { name: "Injection Successful", value: promptInjectionSummaryData?.stat_per_model?.injection_successful_count ?? 0, color: "#C23B22" },
    { name: "Injection Unsuccessful", value: promptInjectionSummaryData?.stat_per_model?.injection_unsuccessful_count ?? 0, color: "#76b041" },
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
                width: '100%',
                paddingTop: 2,
                paddingLeft: 0,
                paddingRight: 0
              } }
              style={ { backgroundColor: 'white' } }
            >
              <CardContent sx={ { textAlign: "center", width: "100%", height: '100%', padding: '0%' } }>
                { /* Title */ }
                <Typography variant="subtitle1" sx={ { fontWeight: 600, letterSpacing: 1, color: "gray", textTransform: "none" } }>
                  MITRE Benchmark
                </Typography>

                { /* Pie Chart Container */ }
                <ResponsiveContainer width="100%" height={ 180 }>
                  <PieChart width={ 120 } height={ 100 }>
                    <Pie
                      data={ data }
                      cx="50%"
                      cy="50%"
                      innerRadius={ 40 }
                      outerRadius={ 50 }
                      dataKey="value"
                      stroke="none"
                      label={ ({ name, value }) => `${value}` }
                    >
                      { data.map((entry, index) => (
                        <Cell key={ `cell-${index}` } fill={ entry.color } />
                      )) }
                    </Pie>
                    <Tooltip contentStyle={ { textTransform: 'capitalize' } } />
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
                      <Typography variant="caption" sx={ { fontSize: "13px", color: "textSecondary", textTransform: 'capitalize' } }>
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
                    width: "95%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    bgcolor: "#f4f4f4",
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
            <Box sx={ { display: "flex", justifyContent: "center", paddingTop: "6px", paddingBottom: "12px" } }>
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
                  <Legend wrapperStyle={ { fontSize: '12px', paddingTop: "16px" } } />

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
          <Grid pb={ 1 } pl={ 0.5 }>

            <Button
              variant="text"
              onClick={ handleOpenAutocomplete }
              disabled={ (Object.keys(autocompleteData).length === 0) && Object.keys(autocompleteDetailedData).length === 0 }
              sx={ {
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'primary.main'
                },
                width: "fit-content",
    
              } }
            >
              Autocomplete Test Summary
            </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={ openAutocomplete }
              onClose={ handleCloseAutocomplete }
              closeAfterTransition
              slots={ { backdrop: Backdrop } }
              slotProps={ {
                backdrop: {
                  timeout: 500,
                },
              } }
            >
              <Fade in={ openAutocomplete }>
                <Box sx={ modalStyle }>
                  <AutocompleteModal autocompleteSummaryData = { autocompleteData } autocompleteDetailedData = { autocompleteDetailedData } data = "Autocomplete"
                  />
 
  
                </Box>
              </Fade>
            </Modal>
            <Button
              variant="text"
              onClick={ handleOpenInstruct }
              disabled={ (Object.keys(instructData).length === 0) && Object.keys(instructTestDetailedData).length === 0 }

              sx={ {
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'primary.main'
                },
                width: "fit-content",
    
              } }
            >
              Instruct Test Summary
            </Button>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={ openInstruct }
              onClose={ handleCloseInstruct }
              closeAfterTransition
              slots={ { backdrop: Backdrop } }
              slotProps={ {
                backdrop: {
                  timeout: 500,
                },
              } }
            >
              <Fade in={ openInstruct }>
                <Box sx={ modalStyle }>
                  <AutocompleteModal autocompleteSummaryData = { instructData } autocompleteDetailedData = { instructTestDetailedData } data = "Instruct"
                  />
  
                </Box>
              </Fade>
            </Modal>
          </Grid> 
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
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textTransform: 'none',
              } }
              style={ { backgroundColor: 'white' } }
            >
              <CardContent sx={ {
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0%',
              } }>
                { /* Title */ }
                <Typography variant="subtitle1" sx={ {
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: 'gray',
                  mb: 2,
                } }>
                  Spear Phishing
                </Typography>

                { /* Bold Persuasion Skill */ }
                <Box
                  sx={ {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                  } }
                >
                  <Typography
                    variant="body1"
                    sx={ {
                      fontSize: '1rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: "40px"
                    } }
                  >
                    <span>
                      <b style={ { color: colorCode[spearPhishingNumber]?.color } }>
                        { colorCode[spearPhishingNumber].level }
                      </b>{ ' ' }
                      <strong>Persuasion skill</strong> for this LLM in generating Spear Phishing content
                    </span>
                  </Typography>
                </Box>
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
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: 2,
          } }
        >
          <Typography variant="h5" sx={ { fontWeight: 600, letterSpacing: 1, color: "gray" } }>
            False Refusal Rate
          </Typography>

          <CardContent sx={ {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center", // Centers content inside CardContent
            flexGrow: 1, // Takes up available space
          } }>
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
            <Box sx={ { display: "flex", justifyContent: "center", paddingTop: "6px", paddingBottom: "12px" } }>
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
                  <XAxis dataKey="category" style={ { fontSize: "12px" } } />
                  <YAxis />
                  <Tooltip />
                  <Legend wrapperStyle={ { fontSize: '12px', paddingTop: "16px" } } />
                  <Bar dataKey="Extremely Malicious" stackId="a" fill="#C23B22" barSize={ 20 } />
                  <Bar dataKey="Potentially Malicious" stackId="a" fill="#f28e2c" barSize={ 20 } />
                  <Bar dataKey="Non-Malicious" stackId="a" fill="#2ca02c" barSize={ 20 } />
                </BarChart>
              </ResponsiveContainer>
            ) }
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={ 12 } md={ 12 } lg={ 3 }>
        <>
          <Button
            onClick={ handleOpenPromptInjection }
            variant="contained"
            sx={ {
              height: '100%',
              width: '100%',
              paddingTop: 2,
              paddingLeft: 0,
              paddingRight: 0
            } }
            style={ { backgroundColor: 'white' } }
          >
            <CardContent>
              <Typography variant="h5" sx={ { fontWeight: 600, letterSpacing: 1, color: "gray", textTransform: "none" } }>
                Prompt Injection
              </Typography>
              <Typography variant="subtitle2" sx={ { color: "gray", textTransform: "none" } }>
                Model’s susceptibility to prompt injection attack scenarios
              </Typography>
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
                    <Legend wrapperStyle={ { fontSize: '12px', textTransform: "none", fontWeight: "normal", bottom: "-7px" } } />
                  </PieChart>
                </ResponsiveContainer>
              ) }
            </CardContent>
          
          </Button>

          <Modal
            open={ openPromptInjection }
            onClose={ () => setOpenPromptInjection(false) }
            closeAfterTransition
            slots={ { backdrop: Backdrop } }
            slotProps={ { backdrop: { timeout: 500 } } }
          >
            <Fade in={ openPromptInjection }>
              <Box
                sx={ {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "95%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  bgcolor: "#f4f4f4",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                } }
              >
                <PromptInjectionModal promptInjectionData={ promptInjectionData } promptInjectionSummaryData={ promptInjectionSummaryData } />
              </Box>
            </Fade>
          </Modal>
        </>
      </Grid>
    </Grid>
  );
};

export default SummaryDashboard;
