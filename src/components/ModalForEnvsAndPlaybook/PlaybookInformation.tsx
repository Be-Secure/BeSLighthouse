import React from "react";
import { Box, Typography, Grid } from "@mui/material";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const PlaybookInformation = ({ playbookMetadata, playbookName }: any) => {
  // Find the playbook that matches playbookName
  const playbook = playbookMetadata?.playbooks.find(
    (playbookDetail: any) => playbookDetail.name === playbookName
  );

  // If playbook not found, show a message
  if (!playbook) {
    return (
      <Box sx={ { p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 } }>
        <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
          Playbook Details
        </Typography>
        <Typography variant="body2" color="error" textAlign="center">
          Playbook "{ playbookName }" not found.
        </Typography>
      </Box>
    );
  }

  // Define metadata structure
  const details = [
    { label: "Playbook Name", value: playbook.name },
    { label: "Version", value: playbook.version }, // Fix: Access version directly
    { label: "Type", value: playbook.type },
    { label: "Author", value: `${playbook.author.name} (${playbook.author.type})` },
    { label: "Creation Date", value: playbook.date_of_creation },
    { label: "Last Update Date", value: playbook.last_update_date },
    { label: "Last Execution", value: `${playbook.last_execution.name} (${playbook.last_execution.status})` },
    { label: "Execution Timestamp", value: playbook.last_execution.timestamp },
    { label: "Execution Environment", value: playbook.last_execution.environment },
    { label: "Detailed Report Path", value: playbook.detailed_report_path || "N/A" },
  ];

  return (
    <Box sx={ { p: 2, backgroundColor: "#f5f5f5", borderRadius: 1, margin: "auto" } }>
      <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
        Playbook Details
      </Typography>
      <Grid container spacing={ 2 }>
        { details.map((detail, index) => (
          <Grid item xs={ 12 } sm={ 6 } key={ index }>
            <Typography variant="body2">
              <strong>{ detail.label }:</strong> { detail.value }
            </Typography>
          </Grid>
        )) }
      </Grid>
    </Box>
  );
};

export default PlaybookInformation;
