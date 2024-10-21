import React from "react";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";

// Custom component for displaying test case info
const InfoBox: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <Grid item xs={ 12 }>
      <Box sx={ { backgroundColor: '#F3F6F4', p: 2, borderRadius: '8px' } }>
        <Typography variant="body1" sx={ { color: '#283593' } }>{ title }</Typography>
        <Typography variant="h4" sx={ { fontWeight: 'bold', color: '#283593' } }>{ count }</Typography>
      </Box>
    </Grid>
  );
};

const InsecureCodeDetection: React.FC = () => {
  return (
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#F3F9FB',
      display: 'flex'
    } }>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="left"
        height="50%"
        textAlign="left"
      >
        <Typography variant="h6" sx={ { fontWeight: 'bold' } }>Insecure Code Detection</Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />

      { /* Main container with F3F9FB background surrounding grid items */ }
      <Box sx={ { backgroundColor: '#F3F9FB', width: '100%', textAlign: 'center', p: 2, borderRadius: '8px' } }>
        <Grid container spacing={ 2 } justifyContent="center">

          { /* Test Cases */ }
          <InfoBox title="Test Cases" count={ 5 } />

          { /* Spacer with F3F9FB color */ }
          <Grid item xs={ 12 }>
            <Box sx={ { height: '16px' } } />
          </Grid>

          { /* Insecure Code */ }
          <InfoBox title="Insecure Code" count={ 3 } />

        </Grid>
      </Box>
    </Card>
  );
};

export default InsecureCodeDetection;
