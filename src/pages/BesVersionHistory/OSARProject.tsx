import React from "react";
import { Card, Typography, Box, Divider, Tooltip } from "@mui/material";
import cyclonedx from '../../assets/images/owasp_cyclonedx_logo.jpg';
import CheckIcon from '../../assets/images/checked.png';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import IconButton from '@mui/material/IconButton';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { generatePdfFromJson } from "../../utils/OsarPdf";

const downloadJson = (osarReport: any, modelName: string) => {
  const jsonContent = JSON.stringify(osarReport);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', modelName);
  document.body.appendChild(link);
  link.click();
};

const InfoCard: React.FC<{ name: string, title: string, osarReport: any, cosigneLink: boolean, selectedOption: string }> = ({ title, osarReport, cosigneLink, name, selectedOption }) => {
  return (
    <Card sx={ {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      flex: 1
    } }>
      <Box sx={ { textAlign: "center", m: 0, flex: 1 } }>
        <Typography variant="h6" gutterBottom sx={ { fontWeight: "bold", m: 0, display: 'inline-flex', alignItems: 'center' } }>
          { title }
          { cosigneLink && (
            <Tooltip title="Attested" arrow>
              <img
                style={ { marginLeft: '8px', position: 'relative', top: '-2px', textAlign: 'left' } }
                src={ CheckIcon }
                alt="Checked Icon"
                width={ 24 }
                height={ 24 }
              />
            </Tooltip>
          ) }
        </Typography>
      </Box>
      <Divider sx={ { m: 1, opacity: 1 } } />
      <Box display="flex" alignItems="center" justifyContent="center" pt={ 1.5 } flex={ 1 }>
        <Tooltip title="CycloneDX" arrow>
          <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center', mr: 2 } }>
            <img
              style={ {
                position: 'relative',
                top: '-2px',
                opacity:  0.5,
                pointerEvents: 'none'
              } }
              src={ cyclonedx }
              alt="Checked Icon"
              width={ 24 }
              height={ 24 }
            />
          </Typography>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={ { height: 28, mx: 2, opacity: 1 } } />

        <Tooltip title={ "Download PDF" } arrow>
          <IconButton
            onClick={ () => generatePdfFromJson(osarReport, `${name}-${selectedOption}-osar`, cosigneLink) }
            style={ { top: '-5px' } }
            color="info"
            disabled={ Object.keys(osarReport).length === 0 }
          >
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={ { height: 28, mx: 2, opacity: 1 } } />

        <Tooltip title={ "Download JSON" } arrow>
          <IconButton
            onClick={ () => downloadJson(osarReport, `${name}-${selectedOption}-osar.json`) }
            style={ { top: '-5px' } }
            color="info"
            disabled={ Object.keys(osarReport).length === 0 }
          >
            <DataObjectIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

const OSARProject = ({ besName, osarReportData, selectedOption, cosignLinkExists }: any) => {
  return <InfoCard title="OSAR" osarReport={ osarReportData } cosigneLink={ cosignLinkExists } name={ besName } selectedOption={ selectedOption } />;
};

export default OSARProject;
