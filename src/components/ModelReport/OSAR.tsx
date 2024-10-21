import React from "react";
import { Card, Typography, Box, Divider } from "@mui/material";
import CheckIcon from '../../assets/images/checked.png';
import DownloadIcon from '@mui/icons-material/Download';

// Custom component for displaying a title and action button with verification
const InfoCard: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Card sx={ { p: 2, height: '100%', display: 'flex', flexDirection: 'column' } }>
      <Box
        sx={ {
          textAlign: "center",
        } }>
        <Typography variant="h6" gutterBottom sx={ { fontWeight: "bold" } }>
          { title }
        </Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center', mr: 2 } }>
          <img style={ { position: 'relative', top: '-2px' } } src={ CheckIcon } title="Attested" alt="Checked Icon" width={ 24 } height={ 24 } />
        </Typography>
        <Divider orientation="vertical" flexItem sx={ { height: 28, mx: 2, opacity: 1 } } />
        <DownloadIcon
          style={ { cursor: "pointer" } }
          fontSize="medium"
          titleAccess="Download OSAR"
        />
      </Box>
    </Card>
  );
};

const OSAR: React.FC = () => {
  return <InfoCard title="OSAR" />;
};

export default OSAR;
