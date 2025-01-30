import React from "react";
import { Box, Typography, Grid } from "@mui/material";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const DetailedEnvironment = ({ environmentMetadata, envName }: any) => {
  // Find the environment that matches envName
  const environment = environmentMetadata.environments.find(
    (env: any) => env.name === envName
  );

  // If environment not found, show a message
  if (!environment) {
    return (
      <Box sx={ { p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 } }>
        <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
          Environment Details
        </Typography>
        <Typography variant="body2" color="error" textAlign="center">
          Environment "{ envName }" not found.
        </Typography>
      </Box>
    );
  }

  // Define metadata structure
  const details = [
    { label: "Environment Name", value: environment.name },
    { label: "Version", value: environment.version.tag },
    { label: "Author", value: `${environment.author.name} (${environment.author.type})` },
    { label: "Creation Date", value: environment.date_of_creation },
    { label: "Last Update Date", value: environment.last_update_date },
    { label: "Last Execution", value: `${environment.last_execution.name} (${environment.last_execution.status})` },
    { label: "Execution Timestamp", value: environment.last_execution.timestamp },
  ];

  return (
    <Box sx={ { p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 } }>
      <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
        Environment Details
      </Typography>
      <Grid container spacing={ 2 } >
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

export default DetailedEnvironment;
