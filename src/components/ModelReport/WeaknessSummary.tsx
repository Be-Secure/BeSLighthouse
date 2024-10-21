import React from "react";
import { Card, Typography, Grid, Box, Divider, Button } from "@mui/material";

// Custom component for displaying severity level info
const SeverityBox: React.FC<{ title: string; count: number }> = ({ title, count }) => {
  return (
    <Grid item xs={ 6 }>
      <Box sx={ { backgroundColor: '#F3F6F4', p: 2, borderRadius: '8px' } }>
        <Typography variant="body1" sx={ { color: '#283593' } }>{ title }</Typography>
        <Typography variant="h4" sx={ { fontWeight: 'bold', color: '#283593' } }>{ count }</Typography>
      </Box>
    </Grid>
  );
};

const WeaknessSummary: React.FC = () => {
  return (
    <Card sx={ {
      p: 3,
      minHeight: '422px',
      backgroundColor: '#F3F9FB',
      display: 'flex',
      flexDirection: 'column',
    } }>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center" // Align to center vertically
      >
        <Typography variant="h6" sx={ { position: 'relative', fontWeight: 'bold', top: '-7px' } }>Weakness Summary</Typography>
        <Button
          sx={ {
            top: '-12px',
            backgroundColor: '#CCF2FF',
            color: 'black',
            '&:hover': {
              backgroundColor: '#99D6FF',
              opacity: 0.9,
            },
          } }
        >
          Report
        </Button>
      </Box>
      <Divider sx={ { my: 2, opacity: 1, position: 'relative', top: '-14px' } } />

      { /* Main container with F3F9FB background, surrounding grid items */ }
      <Box sx={ { backgroundColor: '#F3F9FB', width: '100%', textAlign: 'center', p: 2, borderRadius: '8px' } }>
        <Grid container spacing={ 2 } sx={ { textAlign: 'center' } }>

          { /* Critical and High */ }
          <SeverityBox title="Critical" count={ 0 } />
          <SeverityBox title="High" count={ 2 } />

          { /* Gap for spacing */ }
          <Grid item xs={ 12 }>
            <Box sx={ { height: '8px' } } />
          </Grid>

          { /* Medium and Low */ }
          <SeverityBox title="Medium" count={ 4 } />
          <SeverityBox title="Low" count={ 9 } />

        </Grid>
      </Box>
    </Card>
  );
};

export default WeaknessSummary;
