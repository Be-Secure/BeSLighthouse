import React from "react";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import OSAR from "../../components/ModelReport/OSAR";
import MKTypography from "../../components/MKTypography";

// Custom component for displaying a card with a title and description
const DescriptionCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <Card
      sx={ {
        p: 1,
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        height: "100%"
      } }
    >
      { /* Title Section */ }
      <Box
        sx={ {
          textAlign: "center",
          m: 0
        } }
      >
        <Typography variant="h6" gutterBottom sx={ { fontWeight: "bold", m: 0 } }>
          { title }
        </Typography>
      </Box>

      <Divider sx={ { m: 1, opacity: 1 } } />

      { /* Description Section */ }
      <MKTypography
        variant="body1"
        sx={ {
          fontSize: "15px",
          textAlign: "justify",
          color: "black",
          maxHeight: "103px", // Restrict max height
          overflowY: "auto", // Enable vertical scrolling
          padding: "0 10px", // Add padding for readability
        } }
      >
        { description }
      </MKTypography>
    </Card>
  );
};

const ModelDescription = ({ description, name }: { description: string, name: string }) => {
  return (
    <Grid container spacing={ 2 }>
      <Grid item xs={ 12 } md={ 10 }>
        <DescriptionCard title="Model Description" description={ description } />
      </Grid>
      <Grid item xs={ 12 } md={ 2 }>
        <OSAR name={ name }/>
      </Grid>
    </Grid>
  );
};

export default ModelDescription;


// delete me
