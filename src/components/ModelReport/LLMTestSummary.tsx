import React, { useEffect, useState } from "react";
import { Card, Typography, Box, Divider, Grid, Chip, Tooltip } from "@mui/material";
import { besecureMlAssessmentDataStore } from "../../dataStore";
import { verifyLink } from "../../utils/verifyLink";

interface CustomButtonProps {
  text: string;
  successCount?: number; // Optional success count
  failCount?: number;    // Optional fail count
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, successCount, failCount }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%">
      <label
        style={ {
          backgroundColor: '#CCF2FF',
          color: 'black',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s, opacity 0.3s',
          width: '100%',
        } }
        onMouseEnter={ (e) => {
          e.currentTarget.style.backgroundColor = '#99D6FF';
          e.currentTarget.style.opacity = '0.9';
        } }
        onMouseLeave={ (e) => {
          e.currentTarget.style.backgroundColor = '#CCF2FF';
          e.currentTarget.style.opacity = '1';
        } }
      >
        <Typography variant="button" display="block" sx={ { flexGrow: 1 } }>
          { text }
        </Typography>
        <Box sx={ { display: 'flex', alignItems: 'center', ml: 1 } }>
          { successCount !== undefined && (
            <Tooltip title="Success Count" arrow>
              <Chip
                label={ successCount }
                sx={ { backgroundColor: '#4CAF50', color: 'white', mr: 0.5, width: '40px' } }
              />
            </Tooltip>
          ) }
          { failCount !== undefined && (
            <Tooltip title="Fail Count" arrow>
              <Chip
                label={ failCount }
                sx={ { backgroundColor: '#F44336', color: 'white', width: '40px' } }
              />
            </Tooltip>
          ) }
        </Box>
      </label>
    </Box>
  );
};

const LLMTestSummary: React.FC<{ name: string }> = ({ name }) => {
  const [autocompleteData, setAutocompleteData] = useState({});
  const [miterData, setMiterData] = useState([]);
  const [instructData, setInstructData] = useState({});

  const count = {
    miter: { success: 0, fail: 0 },
    autocomplete: { success: 0, fail: 0 },
    instruct: { success: 0, fail: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      const links = {
        autocomplete: `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-autocomplete-test-summary-report.json`,
        instruct: `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-instruct-test-summary-report.json`,
        mitre: `${besecureMlAssessmentDataStore}/${name}/llm-benchmark/${name}-mitre-test-detailed-report.json`,
      };

      await Promise.all([
        verifyLink(links.autocomplete, setAutocompleteData),
        verifyLink(links.mitre, setMiterData),
        verifyLink(links.instruct, setInstructData),
      ]);
    };

    fetchData();
  }, [name]);

  const calculateCounts = (data: any, category: keyof typeof count) => {
    if (Object.keys(data).length === 0) return;

    Object.values(data).forEach((item: any) => {
      if (item.vulnerable_suggestion_count === 0) {
        count[category].success += 1;
      } else {
        count[category].fail += item.vulnerable_suggestion_count;
      }
    });
  };

  calculateCounts(autocompleteData, "autocomplete");
  calculateCounts(instructData, "instruct");

  if (miterData.length > 0) {
    miterData.forEach((data: any) => {
      const outputs = data.judge_response?.outputs; // Use optional chaining
    
      if (Array.isArray(outputs)) {
        outputs.forEach((output: any) => {
          const stopReason = output.stop_reason;
    
          if (stopReason === "stop") {
            count.miter.fail++;
          } else {
            count.miter.success++;
          }
        });
      } else {
        count.miter.success++;
      }
    });
  }

  return (
    <Card sx={ { p: 3, minHeight: '422px', backgroundColor: '#F3F9FB', display: 'flex' } }>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" height="50%" textAlign="left">
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>LLM Benchmark</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Grid container direction="column" spacing={ 2 } sx={ { mt: 2 } }>
        <Grid item>
          <CustomButton text="MITRE Test" successCount={ count.miter.success } failCount={ count.miter.fail } />
        </Grid>
        <Grid item>
          <CustomButton text="Instruct Test" successCount={ count.instruct.success } failCount={ count.instruct.fail } />
        </Grid>
        <Grid item>
          <CustomButton text="Autocomplete Test" successCount={ count.autocomplete.success } failCount={ count.autocomplete.fail } />
        </Grid>
      </Grid>
    </Card>
  );
};

export default LLMTestSummary;


// import React from "react";
// import { Card, Typography, Box, Divider, Grid, Tooltip, Chip } from "@mui/material";

// interface CustomButtonProps {
//   text: string;
//   successCount?: number; // Optional success count
//   failCount?: number;    // Optional fail count
// }

// const CustomButton: React.FC<CustomButtonProps> = ({ text, successCount, failCount }) => {
//   return (
//     <label
//       style={ {
//         backgroundColor: '#CCF2FF',
//         color: 'black',
//         padding: '10px 20px',
//         display: 'flex',
//         alignItems: 'center',
//         cursor: 'pointer',
//         transition: 'background-color 0.3s, opacity 0.3s',
//         width: '100%',
//       } }
//     >
//       <Typography variant="button" display="block" sx={ { flexGrow: 1 } }>
//         { text }
//       </Typography>
//       { /* Chips for success and fail counts with tooltips */ }
//       <Box sx={ { display: 'flex', alignItems: 'center', ml: 1 } }>
//         { successCount !== undefined && (
//           <Tooltip title="Success Count" arrow>
//             <Chip
//               label={ successCount }
//               sx={ { backgroundColor: '#4CAF50', color: 'white', mr: 0.5, width: '40px' } } // Set a width for the chip
//             />
//           </Tooltip>
//         ) }
//         { failCount !== undefined && (
//           <Tooltip title="Fail Count" arrow>
//             <Chip
//               label={ failCount }
//               sx={ { backgroundColor: '#F44336', color: 'white', width: '40px' } } // Set a width for the chip
//             />
//           </Tooltip>
//         ) }
//       </Box>
//     </label>
//   );
// };

// const LLMTestSummary: React.FC<{ name: string }> = () => {
//   const successCount = 42; // Replace with actual success count
//   const failCount = 5; // Replace with actual fail count

//   return (
//     <Card sx={ { p: 3, minHeight: '422px', backgroundColor: '#F3F9FB', display: 'flex' } }>
//       <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" height="50%" textAlign="left">
//         <Typography variant="h6" sx={ { fontWeight: 'bold' } }>LLM Benchmark</Typography>
//       </Box>
//       <Divider sx={ { mb: 2, opacity: 1 } } />
//       <Grid container direction="column" spacing={ 2 } sx={ { mt: 2 } }>
//         <Grid item>
//           <CustomButton text="MITRE Test" successCount={ successCount } failCount={ failCount } />
//         </Grid>
//         <Grid item>
//           <CustomButton text="Instruct Test" successCount={ successCount } failCount={ failCount }/>
//         </Grid>
//         <Grid item>
//           <CustomButton text="Autocomplete Test" successCount={ successCount } failCount={ failCount }/>
//         </Grid>
//       </Grid>
//     </Card>
//   );
// };

// export default LLMTestSummary;

