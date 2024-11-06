import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Divider, Grid, Tooltip, Chip } from "@mui/material";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../../utils/verifyLink";
import { NavLink } from "react-router-dom";

interface CustomButtonProps {
  text: string;
  disabled?: boolean;
  modelName?: string;
  totalReportCount?: number;
  integrityName?: string
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, disabled, modelName, totalReportCount, integrityName }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
      <NavLink
        to={ {
          pathname: `/BeSLighthouse/model_integrity_suite/:${integrityName}/:${modelName}`,
          search: ""
        } }
        style={ { textDecoration: 'none', width: '100%' } }
      >
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
          { totalReportCount !== 0 && (
            <Box sx={ { display: 'flex', alignItems: 'center', ml: 1 } }>
              <Tooltip title="Total Report" arrow>
                <Chip
                  label={ totalReportCount }
                  sx={ { backgroundColor: '#F3F6F4', color: 'white', mr: 0.5, width: '40px' } }
                />
              </Tooltip>
            </Box>
          ) }
        </label>
      </NavLink>
    </Box>
  );
};

const isEmptyObject = (obj: any) => {
  if (!obj || typeof obj !== 'object') {
    return true; // Return true if obj is undefined, null, or not an object
  }
  return Object.keys(obj).length === 0;
};

const countReports = (data: any, key: string) => {
  if (!data[key] || typeof data[key] !== 'object' || Object.keys(data[key]).length === 0) {
    return 0;
  }

  let totalReports = 0;
  Object.keys(data[key]).forEach(subKey => {
    if (Array.isArray(data[key][subKey])) {
      totalReports += data[key][subKey].length;
    }
  });

  return totalReports;
};


const ModelIntegritySuite: React.FC<{ name: string }> = ({ name }) => {
  const [testData, setTestData] = useState<any>({});

  const tests = [
    { key: "DataLeakageDetector", label: "Data Leakage Detector" },
    { key: "PerformanceBiasDetector", label: "Performance Bias Detector" },
    { key: "EthicalBiasDetector", label: "Ethical Bias Detector" },
    { key: "TextPerturbationDetector", label: "Text Perturbation Detector" },
    { key: "StochasticityDetector", label: "Stochasticity Detector" },
    { key: "SpuriousCorrelationDetector", label: "Spurious Correlation Detector" },
    { key: "OverconfidenceDetector", label: "Overconfidence Detector" },
    { key: "UnderconfidenceDetector", label: "Underconfidence Detector" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const links: any = `${besecureMlAssessmentDataStore}/${name}/model-integrity-suite/${name}-model-integrity-suite-detailed-report.json`;
      verifyLink(links, setTestData);
    };
    fetchData();
  }, [name]);

  // Sort tests to move enabled ones to the top
  const sortedTests = [...tests].sort((a, b) => {
    const aIsEmpty: any = isEmptyObject(testData[a.key]);
    const bIsEmpty: any = isEmptyObject(testData[b.key]);
    return aIsEmpty - bIsEmpty; // Sort by empty status (false = 0, true = 1)
  });

  return (
    <Card sx={ { p: 3, minHeight: '422px', backgroundColor: '#fffff', display: 'flex' } }>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" height="50%" textAlign="left">
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>Model Integrity Suite</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Box sx={ { flexGrow: 1, maxHeight: '300px', overflowY: 'auto' } }>
        <Grid container direction="column" spacing={ 2 }>
          { sortedTests.map((test) => {
            const totalReportCount = countReports(testData, test.key);
            return (
              <Grid item key={ test.key }>
                <CustomButton
                  modelName={ name }
                  integrityName={ test.key }
                  text={ test.label }
                  totalReportCount={ totalReportCount }
                  disabled={ isEmptyObject(testData[test.key]) }
                />
              </Grid>
            );
          }) }
        </Grid>
      </Box>
    </Card>
  );
};

export default ModelIntegritySuite;
