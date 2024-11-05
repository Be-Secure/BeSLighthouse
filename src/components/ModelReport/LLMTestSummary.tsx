import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Divider, Grid, Chip, Tooltip } from "@mui/material";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../../utils/verifyLink";

interface CustomButtonProps {
  text: string;
  successCount?: number;
  failCount?: number;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, successCount, failCount, disabled }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
      <label
        style={ {
          backgroundColor: disabled ? '#E0E0E0' : '#CCF2FF',
          color: disabled ? '#9E9E9E' : 'black',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s, opacity 0.3s',
          width: '100%',
        } }
        onMouseEnter={ (e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#99D6FF';
            e.currentTarget.style.opacity = '0.9';
          }
        } }
        onMouseLeave={ (e) => {
          if (!disabled) {
            e.currentTarget.style.backgroundColor = '#CCF2FF';
            e.currentTarget.style.opacity = '1';
          }
        } }
      >
        <Typography variant="button" display="block" sx={ { flexGrow: 1 } }>
          { text }
        </Typography>
        { !disabled && (
          <Box sx={ { display: 'flex', alignItems: 'center', ml: 1 } }>
            { successCount !== undefined && (
              <Tooltip title="Success Count" arrow>
                <Chip
                  label={ successCount }
                  sx={ { backgroundColor: '#F3F6F4', color: 'white', mr: 0.5, width: '40px' } }
                />
              </Tooltip>
            ) }
            { failCount !== undefined && (
              <Tooltip title="Fail Count" arrow>
                <Chip
                  label={ failCount }
                  sx={ { backgroundColor: '#F3F6F4', color: 'white', width: '40px' } }
                />
              </Tooltip>
            ) }
          </Box>
        ) }
      </label>
    </Box>
  );
};

const LLMTestSummary: React.FC<{ name: string }> = ({ name }) => {
  const [testData, setTestData] = useState<any>({});

  const tests = [
    { key: "miter", label: "MITRE Test" },
    { key: "autocomplete", label: "Autocomplete Test" },
    { key: "instruct", label: "Instruct Test" },
    { key: "frr", label: "False Refusal Rate (FRR) Test" },
    { key: "textualPromptInjection", label: "Textual Prompt Injection Test" },
    { key: "visualPromptInjection", label: "Visual Prompt Injection Test" },
    { key: "codeInterpreter", label: "Code Interpreter Test" },
    { key: "vulnerabilityExploitation", label: "Vulnerability Exploitation Test" },
    { key: "spearPhishing", label: "Spear Phishing Capability Test" },
    { key: "autonomousCyberOps", label: "Autonomous Offensive Cyber Ops Test" },
  ];

  const count: any = tests.reduce((acc, test) => ({ ...acc, [test.key]: { success: 0, fail: 0 } }), {});

  useEffect(() => {
    const fetchData = async () => {
      const links: any = tests.reduce((acc, test) => ({
        ...acc,
        [test.key]: `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-${test.key.replace(/([A-Z])/g, '-$1').toLowerCase()}-test-summary-report.json`,
      }), {});
      const dataPromises = tests.map((test) =>
        verifyLink(links[test.key], (data: any) =>
          setTestData((prev: any) => ({ ...prev, [test.key]: data }))
        )
      );

      await Promise.all(dataPromises);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const calculateCounts = (data: any, category: string) => {
    if (!data) return;

    Object.values(data).forEach((item: any) => {
      if (item.vulnerable_suggestion_count === 0) {
        count[category].success += 1;
      } else {
        count[category].fail += item.vulnerable_suggestion_count;
      }
    });
  };

  tests.forEach((test) => calculateCounts(testData[test.key], test.key));

  return (
    <Card sx={ { p: 3, minHeight: '422px', backgroundColor: '#F3F9FB', display: 'flex' } }>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" height="50%" textAlign="left">
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>LLM Benchmark</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Box sx={ { flexGrow: 1, maxHeight: '300px', overflowY: 'auto' } }>
        <Grid container direction="column" spacing={ 2 } sx={ { mt: 2 } }>
          { tests.map((test) => (
            <Grid item key={ test.key }>
              <CustomButton
                text={ test.label }
                successCount={ count[test.key].success }
                failCount={ count[test.key].fail }
                disabled={ !testData[test.key] || Object.keys(testData[test.key]).length === 0 } // Disable if data is empty
              />
            </Grid>
          )) }
        </Grid>
      </Box>
    </Card>
  );
};

export default LLMTestSummary;
