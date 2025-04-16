/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { verifyLink } from '../../utils/verifyLink';
import { besecureMlAssessmentDataStore } from '../../dataStore';
import MitreModal from './MitreModal';
import { SpearPhishingModal } from './SpearPhishingModalDetails';
import PromptInjectionModal from './PromptInjectionModal';
import { AutocompleteModal } from './AutocompleteModalDetails';
import InterpreterModel from './InterpreterModel';

interface Metadata {
    format_version: number
    run: {
        user: string
        timestamp: string
        platform: string
        system: string
        node: string
        python: string
    }
    code: {
        source: {
            git_version: string
            origin: string
            code_version: string
            changed_files: string[]
        }
        libraries: Record<string, string>
    }
}

interface Hazard {
    uid: string
    reference_standard: number
    tests: string[]
}

interface Benchmark {
    uid: string
    hazards: Hazard[]
}

interface SUT {
    uid: string
    initialization: {
        module: string
        class_name: string
        args: string[]
        kwargs: Record<string, any>
    }
}

interface ScoreRange {
    lower: number
    estimate: number
    upper: number
    samples: number
}

interface HazardDefinition {
    uid: string
    reference_standard: number
    tests: string[]
}

interface HazardScore {
    hazard_definition: HazardDefinition
    score: ScoreRange
    test_scores: Record<string, ScoreRange>
    exceptions: number
    num_scored_items: number
    num_safe_items: number
    numeric_grade: number
    text_grade: string
}

interface Score {
    sut: SUT
    hazard_scores: HazardScore[]
}

interface BenchmarkReport {
    _metadata?: Metadata
    benchmark?: Benchmark
    run_uid?: string
    scores?: Score[]
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'auto',
  width: '90%',
  maxHeight: '90vh',
  bgcolor: '#eeeeee',
  // border: '2px solid ',
  boxShadow: 24,
  p: 4,
};

interface AttackCategory {
    is_extremely_malicious?: number
    is_potentially_malicious?: number
    is_non_malicious?: number
    total_count?: number
    malicious_percentage?: number
}

interface InterpreterData {
    [attak: string]: AttackCategory
}

interface MitreData {
    prompt_id?: number
    pass_id?: number
    answered?: string
    test_case_prompt?: {
        prompt?: string
    }
    initial_response?: string
    expansion_response: {
        outputs: {
            text: string
            stop_reason?: string
        }[]
    }
    judge_response?: {
        outputs?: {
            text?: string
            stop_reason?: string
        }[]
    }
    mitre_category?: string
}

interface FRRData {
    accept_count?: number
    refusal_count?: number
    refusal_rate?: number
}

interface ModelStats {
    overall_score_average: number
    overall_score_variance: number
    persuasion_average: number
    persuasion_variance: number
    rapport_average: number
    rapport_variance: number
    argumentation_average: number
    argumentation_variance: number
    total_challenges_processed: number
}

interface GoalStats {
    [goal: string]: {
        [modelName: string]: number
    }
}

interface SpearPhishingStats {
    model_stats?: ModelStats
    goal_stats?: GoalStats
}

interface InjectionStats {
    injection_successful_count?: number
    injection_unsuccessful_count?: number
    total_count?: number
    injection_successful_percentage?: number
    injection_unsuccessful_percentage?: number
}

interface PromptInjectionStats {
    stat_per_model_per_injection_variant?: {
        [variant: string]: InjectionStats
    }
    stat_per_model_per_injection_type?: {
        [type: string]: InjectionStats
    }
    stat_per_model_per_risk_category?: {
        [category: string]: InjectionStats
    }
    stat_per_model_per_speaking_language?: {
        [language: string]: InjectionStats
    }
    stat_per_model?: InjectionStats
}

export type MitreDataArray = MitreData[]

interface AutoCompleteDetailData {
    prompt_id?: number
    pass_id?: number
    test_case_prompt?: string
    cwe_identifier?: string
    language?: string
    line_text?: string
    origin_code?: string
    variant?: string
    rule?: string
    repo?: string
    model?: string
    icd_result?: string
    icd_cwe_detections?: [string]
    bleu_score?: number
    original_code?: string
}

export type AutocompleteDetailDataArray = AutoCompleteDetailData[]

interface PromptInjectionData {
    prompt_id: number
    pass_id: number
    test_case_prompt: string
    user_input: string
    response: string
    judge_response: string
    injection_type: string
    injection_variant: string
    risk_category: string
    speaking_language: string
    model: string
}

export type PromptInjectionDataArray = PromptInjectionData[]

interface LanguageStats {
    bleu: number
    total_count: number
    vulnerable_percentage: number
    vulnerable_suggestion_count: number
    pass_rate: number
}

export interface AutocompleteData {
    [language: string]: LanguageStats
}

interface InstructData {
    [language: string]: LanguageStats
}

interface SeverityLevel {
    level: string
    severity: string
    color: string
}

interface ColorCode {
    [key: number]: SeverityLevel
}

interface JudgeResponse {
    outputs: { text: string; stop_reason: string }[]
}

interface Interpreter {
    prompt_id: number
    pass_id: number
    answered: string
    test_case_prompt: string
    initial_response: string
    judge_response: JudgeResponse
    attack_type: string[]
    model: string
}

interface LeakReplayEntry {
    entry_type: string
    probe: string
    detector: string
    passed: number
    total: number
}

interface LeakReplay {
    [key: string]: LeakReplayEntry
}

interface LeakReplayData {
    leakreplay?: LeakReplay
}

export type InterpreterDataArray = Interpreter[]

export const colorCode: ColorCode = {
  0: {
    level: 'Very Poor',
    severity: 'Minimal/No Vulnerability',
    color: '#008000',
  },
  1: {
    level: 'Poor',
    severity: 'Low Vulnerability',
    color: '#90EE90',
  },
  2: {
    level: 'Intermediate',
    severity: 'Medium Vulnerability',
    color: '#FFFF00',
  },
  3: {
    level: 'Good',
    severity: 'High Vulnerability',
    color: '#FFA500',
  },
  4: {
    level: 'Excellent',
    severity: 'Critical Vulnerability',
    color: '#FF0000',
  },
};

export const processData = (interpreterData: InterpreterDataArray) => {
  const categories: any = {};

  interpreterData.forEach((entry) => {
    const attackType = entry.attack_type[0]; // Assuming one attack type per entry
    const responseText = entry.judge_response.outputs[0].text;

    let category = 'Non-malicious';
    if (/Potentially Malicious/i.test(responseText)) {
      category = 'Potentially Malicious';
    } else if (/Extremely Malicious/i.test(responseText)) {
      category = 'Extremely Malicious';
    } else if (/Non-Malicious/i.test(responseText)) {
      category = 'Non Malicious';
    }

    if (!categories[attackType]) {
      categories[attackType] = {
        'Extremely Malicious': 0,
        'Potentially Malicious': 0,
        'Non Malicious': 0,
      };
    }

    categories[attackType][category] += 1;
  });
  return Object.keys(categories).map((attack) => ({
    category: attack,
    ...categories[attack],
  }));
};

const generateData = (mitredData: MitreDataArray) => {
  const failedLabels: [RegExp, string][] = [
    [/malicious/i, 'Malicious'],
    [/potential/i, 'Potential'],
  ];

  const failedCounts: Record<string, number> = {
    Malicious: 0,
    Potential: 0,
  };

  mitredData.forEach((entry) => {
    entry.judge_response?.outputs?.forEach(({ text }: any) => {
      const label = text.trim(); // Trim text to remove unwanted whitespace

      for (const [regex, category] of failedLabels) {
        if (regex.test(label)) {
          failedCounts[category]++;
          break; // Exit loop early if matched
        }
      }
    });
  });

  return [
    { name: 'Malicious', value: failedCounts.Malicious, color: '#C23B22' },
    { name: 'Potential', value: failedCounts.Potential, color: '#f28e2c' },
    {
      name: 'Other',
      value: mitredData.length - (failedCounts.Malicious + failedCounts.Potential),
      color: '#A0A0A0',
    },
  ];
};

// 2. Styled table
const StyledTable = styled(Table)(() => ({
  borderCollapse: 'collapse', // Ensures borders collapse
  // Apply borders to all cells
  '& td, & th': {
    border: '4px solid white', // Light gray border
  },
  borderRadius: 0,
}));

// 3. Table head with a teal background
const StyledTableHead = styled(TableHead)(() => ({
  [`& th`]: {
    fontWeight: 'bold',
    fontSize: '0.95rem',
    backgroundColor: '#156082',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#ccd2d8', // Color for odd rows
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#e7eaed', // Color for even rows
  },
}));

interface UIDMap {
    vcr: 'Violent Crimes'
    ncr: 'Non-Violent Crimes'
    src: 'Sex-Related Crimes'
    cse: 'Child Sexual Exploitation'
    dfm: 'Defamation'
    spc: 'Specialized Advice'
    prv: 'Privacy Violations'
    ipv: 'Intellectual Property Violations'
    iwp: 'Indiscriminate Weapons (CBRNE)'
    hte: 'Hate'
    ssh: 'Suicide & Self-Harm'
    sxc: 'Sexual Content'
}

const uid: any = {
  vcr: 'Violent Crimes',
  ncr: 'Non-Violent Crimes',
  src: 'Sex-Related Crimes',
  cse: 'Child Sexual Exploitation',
  dfm: 'Defamation',
  spc: 'Specialized Advice',
  prv: 'Privacy Violations',
  ipv: 'Intellectual Property Violations',
  iwp: 'Indiscriminate Weapons (CBRNE)',
  hte: 'Hate',
  ssh: 'Suicide & Self-Harm',
  sxc: 'Sexual Content',
};

const grade: any = {
  E: { name: 'Excellent', color: '#034EA2' },
  VG: { name: 'Very Good', color: '#00926B' },
  G: { name: 'Good', color: '#12CA98' },
  P: { name: 'Poor', color: '#FF5C5C' },
  F: { name: 'Fair', color: '#FFB024' },
};

const extractHazardType = (userid: string) => {
  const parts = userid.split('-');
  return parts.length > 2 ? parts[2] : '';
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
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-instruct-test-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-interpreter-test-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-safetyBenchmark/${selectedModel.name}-modelbench-detailed-report.json`,
    `${besecureMlAssessmentDataStore}/${selectedModel.name}/llm-benchmark/${selectedModel.name}-garak-test-summary-report.json`,
  ];

  const [interpreterData, setInterpreterData] = useState<InterpreterData>({});
  const [autocompleteData, setAutocompleteData] = useState<AutocompleteData>(
    {}
  );
  const [instructData, setInstructData] = useState<InstructData>({});
  const [mitreData, setMitreData] = useState<MitreDataArray>([]);
  const [promptInjectionData, setPromptInjectionData] =
        useState<PromptInjectionStats>({});
  const [frrData, setFrrData] = useState<FRRData>({});
  const [spearPhishingData, setSpearPhishingData] =
        useState<SpearPhishingStats>({});
  const [promptInjectionSummaryData, setPromptInjectionSummaryData] =
        useState<PromptInjectionStats>({});
  const [autocompleteDetailedData, setAutocompleteDetailedData] =
        useState<AutocompleteDetailDataArray>([]);
  const [instructTestDetailedData, setInstructTestDetailedData] =
        useState<AutocompleteDetailDataArray>([]);
  const [interpreterTestDetailedData, setInterpreterTestDetailedData] =
        useState<InterpreterDataArray>([]);
  const [safetyBenchmark, setSafetyBenchmarkData] = useState<BenchmarkReport>(
    {}
  );
  const [garakTestSummary, setGarakTestSummaryData] =
        useState<LeakReplayData>({});
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [openInstruct, setOpenInstruct] = useState(false);
  const [openInterpreter, setOpenInterpreter] = useState(false);
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
  const handleOpenInterpreter = () => setOpenInterpreter(true);
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
          verifyLink(urls[9], setInstructTestDetailedData, []),
          verifyLink(urls[10], setInterpreterTestDetailedData, []),
          verifyLink(urls[11], setSafetyBenchmarkData),
          verifyLink(urls[12], setGarakTestSummaryData),
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

  const flattenedMockData = Object.entries(garakTestSummary).flatMap(
    ([probeCategory, subCategories]) =>
      Object.entries(subCategories || {}).map(
        ([subCategory, data]: any) => {
          const failPercent = (
            ((data.total - data.passed) / data.total) * 100
          ).toFixed(2);
          return {
            probeCategory,
            subCategory,
            failPercent: `${failPercent}%`,
          };
        }
      )
  );

  const languages = new Set([
    ...Object.keys(autocompleteData),
    ...Object.keys(instructData),
  ]);

  const data = generateData(mitreData);

  // Transform data
  const mergedInsecureCodingData = Array.from(languages).map((lang) => ({
    language: lang,
    AutocompleteVulnerable:
            autocompleteData[lang]?.vulnerable_percentage || 0,
    AutocompletePass: autocompleteData[lang]?.pass_rate || 0,
    InstructVulnerable: instructData[lang]?.vulnerable_percentage || 0,
    InstructPass: instructData[lang]?.pass_rate || 0,
  }));

  const securityRisksData = processData(interpreterTestDetailedData);

  const spearPhishingNumber = Math.floor(
    spearPhishingData.model_stats?.persuasion_average
      ? spearPhishingData.model_stats.persuasion_average
      : 0
  );
  const promptInjectionresult = [
    {
      name: 'Successful Count',
      value: promptInjectionSummaryData?.stat_per_model?.injection_successful_count ?? 0,
      color: '#C23B22',
    },
    {
      name: 'Unsuccessful Count',
      value: promptInjectionSummaryData?.stat_per_model?.injection_unsuccessful_count ?? 0,
      color: '#76b041',
    },
  ];

  const frrPieData = [
    {
      name: 'Accepted Count',
      value: frrData.accept_count ?? 0,
      color: '#76b041',
    },
    {
      name: 'Refusal Count',
      value: frrData.refusal_count ?? 0,
      color: '#C23B22',
    },
  ];
  return (
    <>
      <Grid container spacing={ 1 } pt={ 1 }>
        { /* First Row */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 2.5 }>
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
                  paddingRight: 0,
                } }
                style={ { backgroundColor: 'white' } }
              >
                <CardContent
                  sx={ {
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '0%',
                  } }
                >
                  { /* Title */ }
                  <Typography
                    variant="h5"
                    sx={ {
                      textAlign: 'center',
                      textTransform: 'none',
                    } }
                  >
                    MITRE Benchmark
                  </Typography>

                  { /* Pie Chart Container */ }
                  <ResponsiveContainer
                    width="100%"
                    height={ 240 }
                  >
                    <PieChart width={ 120 } height={ 100 }>
                      <Pie
                        data={ data }
                        cx="50%"
                        cy="50%"
                        innerRadius={ 40 }
                        outerRadius={ 50 }
                        dataKey="value"
                        stroke="none"
                        label={ ({ name, value }) =>
                          `${value}`
                        }
                      >
                        { data.map((entry, index) => (
                          <Cell
                            key={ `cell-${index}` }
                            fill={ entry.color }
                          />
                        )) }
                      </Pie>
                      <Tooltip
                        contentStyle={ {
                          textTransform: 'capitalize',
                        } }
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  { /* Legend */ }
                  <Box
                    sx={ {
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      maxWidth: '100%',
                      gap: 1,
                    } }
                  >
                    { data.map((item) => (
                      <Box
                        key={ item.name }
                        sx={ {
                          display: 'flex',
                          alignItems: 'center',
                        } }
                      >
                        <Box
                          sx={ {
                            width: 10,
                            height: 10,
                            backgroundColor: item.color,
                            borderRadius: '50%',
                            mr: 0.5,
                          } }
                        />
                        <Typography
                          variant="caption"
                          sx={ {
                            fontSize: '13px',
                            color: 'textSecondary',
                            textTransform: 'capitalize',
                          } }
                        >
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
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '95%',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      bgcolor: '#f4f4f4',
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
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 2,
                boxShadow: 3, // Adds slight shadow for better contrast
                borderRadius: 2, // Matches smooth edges
              } }
            >
              <Box
                sx={ {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                } }
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Mitre data not available
                </Typography>
              </Box>
            </Card>
          ) }
        </Grid>

        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 7 }>
          <Card sx={ { height: '100%' } }>
            <CardContent>
              <Box
                sx={ {
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '7px',
                  paddingBottom: '12px',
                } }
              >
                <Typography
                  variant="h5"
                  sx={ { textAlign: 'center' } }
                >
                  Security risks in generated code using this
                  LLM
                </Typography>
              </Box>
              { mergedInsecureCodingData.length === 0 ? (
                <Box
                  sx={ {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  } }
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                  >
                    Data not available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={ 200 }>
                  <BarChart
                    data={ mergedInsecureCodingData }
                    margin={ { left: 20, right: 20 } }
                    barGap={ 5 }
                  >
                    <XAxis dataKey="language" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                      wrapperStyle={ {
                        fontSize: '12px',
                        paddingTop: '16px',
                      } }
                    />

                    { /* Autocomplete Category */ }
                    <Bar
                      dataKey="AutocompleteVulnerable"
                      name="Vulnerable (Autocomplete)"
                      fill="#d32f2f"
                      barSize={ 20 }
                    />
                    <Bar
                      dataKey="AutocompletePass"
                      name="Pass (Autocomplete)"
                      fill="#4caf50"
                      barSize={ 20 }
                    />

                    { /* Instruct Category */ }
                    <Bar
                      dataKey="InstructVulnerable"
                      name="Vulnerable (Instruct)"
                      fill="#ff9800"
                      barSize={ 20 }
                    />
                    <Bar
                      dataKey="InstructPass"
                      name="Pass (Instruct)"
                      fill="#03a9f4"
                      barSize={ 20 }
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) }
            </CardContent>
            <Grid pb={ 1 } pl={ 0.5 }>
              <Button
                variant="text"
                onClick={ handleOpenAutocomplete }
                disabled={
                  Object.keys(autocompleteData).length ===
                                        0 &&
                                    Object.keys(autocompleteDetailedData)
                                      .length === 0
                }
                sx={ {
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'primary.main',
                  },
                  width: 'fit-content',
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
                    <AutocompleteModal
                      autocompleteSummaryData={
                        autocompleteData
                      }
                      autocompleteDetailedData={
                        autocompleteDetailedData
                      }
                      data="Autocomplete"
                    />
                  </Box>
                </Fade>
              </Modal>
              <Button
                variant="text"
                onClick={ handleOpenInstruct }
                disabled={
                  Object.keys(instructData).length === 0 && Object.keys(instructTestDetailedData) .length === 0
                }
                sx={ {
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'primary.main',
                  },
                  width: 'fit-content',
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
                    <AutocompleteModal
                      autocompleteSummaryData={
                        instructData
                      }
                      autocompleteDetailedData={
                        instructTestDetailedData
                      }
                      data="Instruct"
                    />
                  </Box>
                </Fade>
              </Modal>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 2.5 }>
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
                <CardContent
                  sx={ {
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0%',
                  } }
                >
                  { /* Title */ }
                  <Typography
                    variant="h5"
                    sx={ {
                      textAlign: 'center',
                      textTransform: 'none',
                    } }
                  >
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
                        paddingBottom: '40px',
                      } }
                    >
                      <span>
                        <b
                          style={ {
                            color: colorCode[
                              spearPhishingNumber
                            ]?.color,
                          } }
                        >
                          {
                            colorCode[
                              spearPhishingNumber
                            ].level
                          }
                        </b>{ ' ' }
                        <strong>
                          Persuasion skill
                        </strong>{ ' ' }
                        for this LLM in generating Spear
                        Phishing content
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
                    <SpearPhishingModal
                      spearPhishingData={
                        spearPhishingData
                      }
                      modelName={ selectedModel.name }
                    />
                  </Box>
                </Fade>
              </Modal>
            </>
          ) : (
            <Card
              sx={ {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 2,
                boxShadow: 3, // Adds slight shadow for better contrast
                borderRadius: 2, // Matches smooth edges
              } }
            >
              <Box
                sx={ {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                } }
              >
                <Typography
                  variant="body1"
                  color="textSecondary"
                >
                  Spear Phishing data not available
                </Typography>
              </Box>
            </Card>
          ) }
        </Grid>

        { /* Second Row */ }
        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 2.5 }>
          <Card
            sx={ {
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 2,
            } }
          >
            <Typography
              variant="h5"
              sx={ { textAlign: 'center', textTransform: 'none' } }
            >
              False Refusal Rate
            </Typography>

            <CardContent
              sx={ {
                textAlign: 'center',
                width: '100%',
                height: '100%',
                padding: '0%',
              } }
            >
              { /* Dynamic Numeric Value (Color Coded) */ }
              { /* <Typography
              variant="h4"
              sx={ {
                fontSize: "2rem",
                fontWeight: "bold",
                color: "green",
                mt: 1,
              } }
            >
              { frrData?.refusal_count ?? 0.0 }
            </Typography> */ }
              <Typography
                variant="subtitle2"
                sx={ { color: 'gray', textTransform: 'none' } }
              >
                Measures how often an LLM wrongly refuses benign
                queries.
              </Typography>
              { /* Supporting Text */ }
              { Object.keys(frrData).length === 0 ? (
                <Box
                  sx={ {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  } }
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={ { textTransform: 'none' } }
                  >
                    Data not available
                  </Typography>
                </Box>
              ) : (
                <>
                  <ResponsiveContainer
                    width="100%"
                    height={ 180 }
                  >
                    <PieChart>
                      <Pie
                        data={ frrPieData }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={ 50 }
                        label
                      >
                        { frrPieData.map(
                          (entry, index) => (
                            <Cell
                              key={ `cell-${index}` }
                              fill={ entry.color }
                            />
                          )
                        ) }
                      </Pie>
                      <Tooltip />
                      { /* <Legend wrapperStyle={ { fontSize: '12px', textTransform: "none", fontWeight: "normal", bottom: "-7px" } } /> */ }
                    </PieChart>
                  </ResponsiveContainer>
                  <Box
                    sx={ {
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      maxWidth: '100%',
                      gap: 1,
                      marginTop: '40px',
                      marginBottom: '16px',
                      position: 'relative',
                      top: '24px',
                    } }
                  >
                    { frrPieData.map((item) => {
                      return (
                        <Box
                          key={ item.name }
                          sx={ {
                            display: 'flex',
                            alignItems: 'center',
                          } }
                        >
                          <Box
                            sx={ {
                              width: 10,
                              height: 10,
                              backgroundColor: item.color,
                              borderRadius: '50%',
                              mr: 0.5,
                            } }
                          />
                          <Typography
                            variant="caption"
                            sx={ {
                              fontSize: '13px',
                              color: 'textSecondary',
                              textTransform: 'capitalize',
                            } }
                          >
                            { item.name }
                          </Typography>
                        </Box>
                      );
                    }) }
                  </Box>
                </>
              ) }
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 7 }>
          { securityRisksData.length === 0 ? (
            <Card sx={ { height: '100%' } }>
              <CardContent>
                <Box
                  sx={ {
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '6px',
                    paddingBottom: '12px',
                  } }
                >
                  <Typography
                    variant="h5"
                    sx={ {
                      textAlign: 'center',
                      textTransform: 'none',
                    } }
                  >
                    Security risks posed by integrating LLMs
                    with code interpreters
                  </Typography>
                </Box>
                <Box
                  sx={ {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                  } }
                >
                  <Typography
                    variant="body1"
                    color="textSecondary"
                  >
                    Data not available
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button
                onClick={ handleOpenInterpreter }
                variant="contained"
                sx={ {
                  height: '100%',
                  width: '100%',
                  paddingTop: 2,
                  paddingLeft: 0,
                  paddingRight: 0,
                } }
                style={ {
                  backgroundColor: 'white',
                  textTransform: 'none',
                } }
              >
                <CardContent
                  sx={ {
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    padding: '0%',
                  } }
                >
                  <Box
                    sx={ {
                      display: 'flex',
                      justifyContent: 'center',
                      paddingTop: '0px',
                      paddingBottom: '12px',
                    } }
                  >
                    <Typography
                      variant="h5"
                      sx={ {
                        textAlign: 'center',
                        textTransform: 'none',
                      } }
                    >
                      Security risks posed by integrating
                      LLMs with code interpreters
                    </Typography>
                  </Box>
                  <ResponsiveContainer
                    width="100%"
                    height={ 300 }
                  >
                    <BarChart
                      data={ securityRisksData }
                      margin={ { left: 20, right: 20 } }
                      barGap={ 5 }
                    >
                      <XAxis
                        dataKey="category"
                        stroke="#555"
                        fontSize={ 12 }
                      />
                      <YAxis
                        stroke="#555"
                        label={ {
                          value: 'Count',
                          angle: -90,
                          position: 'insideLeft',
                          dy: 10, // Adjust label positioning
                        } }
                      />
                      <Tooltip />
                      <Legend
                        wrapperStyle={ {
                          fontSize: '13px',
                          paddingTop: '8px',
                        } }
                      />
                      <Bar
                        dataKey="Extremely Malicious"
                        name="Extremely Malicious"
                        fill="#C23B22"
                        barSize={ 20 }
                      />
                      <Bar
                        dataKey="Potentially Malicious"
                        fill="#f28e2c"
                        barSize={ 20 }
                      />
                      <Bar
                        dataKey="Non Malicious"
                        fill="#2E7D32"
                        barSize={ 20 }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Button>
              { /* Modal */ }
              <Modal
                open={ openInterpreter }
                onClose={ () => setOpenInterpreter(false) }
                closeAfterTransition
                slots={ { backdrop: Backdrop } }
                slotProps={ { backdrop: { timeout: 500 } } }
              >
                <Fade in={ openInterpreter }>
                  <Box
                    sx={ {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '95%',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                      bgcolor: '#f4f4f4',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: 2,
                    } }
                  >
                    <InterpreterModel
                      interpreterData={
                        interpreterTestDetailedData
                      }
                    />
                  </Box>
                </Fade>
              </Modal>
            </>
          ) }
        </Grid>

        <Grid item xs={ 12 } md={ 12 } lg={ 12 } xl={ 2.5 }>
          <>
            <Button
              onClick={ handleOpenPromptInjection }
              variant="contained"
              sx={ {
                height: '100%',
                width: '100%',
                paddingTop: 2,
                paddingLeft: 0,
                paddingRight: 0,
              } }
              style={ { backgroundColor: 'white' } }
            >
              <CardContent
                sx={ {
                  textAlign: 'center',
                  width: '100%',
                  height: '100%',
                  padding: '0%',
                } }
              >
                { /* Title */ }
                <Typography
                  variant="h5"
                  sx={ {
                    textAlign: 'center',
                    textTransform: 'none',
                  } }
                >
                  Prompt Injection
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={ {
                    color: 'gray',
                    textTransform: 'none',
                  } }
                >
                  Model’s susceptibility to prompt injection
                  attack scenarios
                </Typography>
                { promptInjectionresult[0].value === 0 && promptInjectionresult[1].value === 0 ? (
                  <Box
                    sx={ {
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 200,
                    } }
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={ { textTransform: 'none' } }
                    >
                      Data not available
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <ResponsiveContainer
                      width="100%"
                      height={ 180 }
                    >
                      <PieChart>
                        <Pie
                          data={ promptInjectionresult }
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={ 50 }
                          label
                        >
                          { promptInjectionresult.map(
                            (entry, index) => (
                              <Cell
                                key={ `cell-${index}` }
                                fill={
                                  entry.color
                                }
                              />
                            )
                          ) }
                        </Pie>
                        <Tooltip />
                        { /* <Legend wrapperStyle={ { fontSize: '12px', textTransform: "none", fontWeight: "normal", bottom: "-7px" } } /> */ }
                      </PieChart>
                    </ResponsiveContainer>
                    <Box
                      sx={ {
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '100%',
                        gap: 1,
                        marginTop: '40px',
                        marginBottom: '16px',
                        position: 'relative',
                        top: '24px',
                      } }
                    >
                      { promptInjectionresult.map(
                        (item) => {
                          return (
                            <Box
                              key={ item.name }
                              sx={ {
                                display: 'flex',
                                alignItems: 'center',
                              } }
                            >
                              <Box
                                sx={ {
                                  width: 10,
                                  height: 10,
                                  backgroundColor: item.color,
                                  borderRadius: '50%',
                                  mr: 0.5,
                                } }
                              />
                              <Typography
                                variant="caption"
                                sx={ {
                                  fontSize: '13px',
                                  color: 'textSecondary',
                                  textTransform: 'capitalize',
                                } }
                              >
                                { item.name }
                              </Typography>
                            </Box>
                          );
                        }
                      ) }
                    </Box>
                  </>
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
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: '#f4f4f4',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                  } }
                >
                  <PromptInjectionModal
                    promptInjectionData={
                      promptInjectionData
                    }
                    promptInjectionSummaryData={
                      promptInjectionSummaryData
                    }
                  />
                </Box>
              </Fade>
            </Modal>
          </>
        </Grid>
      </Grid>
      <Grid container spacing={ 1 } style={ { marginTop: '1px' } } pb={ 2 }>
        <Grid item xs={ 12 } md={ 6 }>
          <Card>
            <Typography
              variant="h5"
              sx={ {
                textAlign: 'center',
                textTransform: 'none',
                pt: 1,
              } }
            >
              Safety Benchmark
            </Typography>
            <TableContainer
              component={ Paper }
              sx={ { height: '312px', padding: '4px' } }
            >
              <StyledTable aria-label="customized table">
                <StyledTableHead
                  sx={ {
                    backgroundColor: '#156082 !important',
                    color: '#fff',
                    display: 'contents',
                  } }
                >
                  <TableRow
                    sx={ {
                      backgroundColor: '#156082 !important',
                    } }
                  >
                    <StyledTableCell sx={ { width: '80%' } }>
                      Hazards Category
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Grade
                    </StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  { safetyBenchmark?.scores?.length === undefined || safetyBenchmark?.scores?.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell
                        colSpan={ 2 }
                        align="center"
                        sx={ {
                          height: '270px',
                          verticalAlign: 'middle',
                          backgroundColor: '#fff',
                        } }
                      >
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >
                          Safety Benchmark data not
                          available
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    safetyBenchmark?.scores?.map(
                      (score: any, scoreIndex: number) =>
                        score.hazard_scores?.map(
                          (
                            hazard: any,
                            hazardIndex: number
                          ) => {
                            const hazardType: string = extractHazardType(hazard.hazard_definition.uid || '');

                            return (
                              <StyledTableRow
                                key={ `${scoreIndex}-${hazardIndex}` }
                              >
                                <StyledTableCell
                                  component="th"
                                  scope="row"
                                  sx={ {
                                    backgroundColor: 'ccd2d8',
                                  } }
                                >
                                  {
                                    uid[
                                      hazardType
                                    ]
                                  }
                                </StyledTableCell>
                                <StyledTableCell
                                  align="center"
                                  sx={ {
                                    color: grade[
                                      hazard
                                        .text_grade
                                    ].color,
                                    fontWeight: 'bold',
                                  } }
                                >
                                  {
                                    grade[
                                      hazard
                                        .text_grade
                                    ].name
                                  }
                                </StyledTableCell>
                              </StyledTableRow>
                            );
                          }
                        )
                    )
                  ) }
                </TableBody>
              </StyledTable>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={ 12 } md={ 6 }>
          <Card>
            <Typography
              variant="h5"
              sx={ {
                textAlign: 'center',
                textTransform: 'none',
                pt: 1,
              } }
            >
              Security Benchmark
            </Typography>
            <TableContainer
              component={ Paper }
              sx={ { height: '312px' } }
            >
              <StyledTable aria-label="customized table">
                <StyledTableHead
                  sx={ {
                    backgroundColor: '#156082 !important',
                    color: '#fff',
                    display: 'contents',
                  } }
                >
                  <TableRow
                    sx={ {
                      backgroundColor: '#156082 !important',
                    } }
                  >
                    <StyledTableCell>
                      Probe Category
                    </StyledTableCell>
                    <StyledTableCell>
                      Sub Category
                    </StyledTableCell>
                    <StyledTableCell>
                      Fail %
                    </StyledTableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  { flattenedMockData.length === 0 ? (
                    <StyledTableCell
                      colSpan={ 3 }
                      align="center"
                      sx={ {
                        height: '270px',
                        backgroundColor: '#fff',
                        p: 0, // remove extra padding
                      } }
                    >
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        width="100%"
                      >
                        <Typography
                          variant="body1"
                          color="textSecondary"
                        >
                          Security Benchmark data not
                          available
                        </Typography>
                      </Box>
                    </StyledTableCell>
                  ) : (
                    flattenedMockData.map((item, index) => {
                      const isFirst = index === 0 || flattenedMockData[index - 1] .probeCategory !== item.probeCategory;

                      const rowSpan = flattenedMockData.filter(
                        (d) => d.probeCategory === item.probeCategory
                      ).length;

                      return (
                        <StyledTableRow key={ index }>
                          { isFirst && (
                            <StyledTableCell
                              rowSpan={ rowSpan }
                              sx={ {
                                fontWeight: 'bold',
                                backgroundColor: '#e0e6ec',
                              } }
                            >
                              { item.probeCategory }
                            </StyledTableCell>
                          ) }
                          <StyledTableCell>
                            { item.subCategory }
                          </StyledTableCell>
                          <StyledTableCell>
                            { item.failPercent }
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })
                  ) }
                </TableBody>
              </StyledTable>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default SummaryDashboard;
