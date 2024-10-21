import React, { useEffect } from "react";
import { Card, Typography, Box, Divider } from "@mui/material";
import CheckIcon from '../../assets/images/checked.png';
import { checkFileExists } from "../../utils/checkFileExists";
import { verifyLink } from "../../utils/verifyLink";
import MKButton from "../MKButton";
import { generatePdfFromJson } from "../../utils/OsarPdf";

const InfoCard: React.FC<{ name: string, title: string, osarReport: any, cosigneLink: boolean }> = ({ title, osarReport, cosigneLink, name }) => {
  return (
    <Card sx={ { p: 2, height: '100%', display: 'flex', flexDirection: 'column' } }>
      <Box sx={ { textAlign: "center" } }>
        <Typography variant="h6" gutterBottom sx={ { fontWeight: "bold" } }>
          { title }
        </Typography>
      </Box>
      <Divider sx={ { mb: 2, opacity: 1 } } />
      <Box display="flex" alignItems="center" justifyContent="center">
        { cosigneLink && (
          <>
            <Typography variant="body1" sx={ { display: 'flex', alignItems: 'center', mr: 2 } }>
              <img style={ { position: 'relative', top: '-2px' } } src={ CheckIcon } title="Attested" alt="Checked Icon" width={ 24 } height={ 24 } />
            </Typography>
            <Divider orientation="vertical" flexItem sx={ { height: 28, mx: 2, opacity: 1 } } />
          </>
        ) }
        <MKButton
          onClick={ () => generatePdfFromJson(osarReport, `${name}-osar.json`, cosigneLink) }
          style={ { top: '-5px' } }
          variant="gradient"
          color="info"
          size="small"
          endIcon={ <i className="fa fa-download" /> }
          disabled={ Object.keys(osarReport).length === 0 }
        >
          OSAR
        </MKButton>
      </Box>
    </Card>
  );
};

const OSAR = ({ name }: { name: string }) => {
  const [getOsarReport, setOsarReportData] = React.useState({});
  const [getCosignLink, setCosignLink] = React.useState(false);

  useEffect(() => {
    const osarReportLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/${name}-osar.json`;
    const cosignLink = `https://raw.githubusercontent.com/Be-Secure/besecure-ml-assessment-datastore/main/models/${name}/cosign.pub`;
    
    const fetchData = async () => {
      await verifyLink(osarReportLink, setOsarReportData);
      await checkFileExists(cosignLink, setCosignLink);
    };

    fetchData();
  }, [name]); // Add `name` to the dependency array to re-run on name change

  return <InfoCard title="OSAR" osarReport={ getOsarReport } cosigneLink={ getCosignLink } name={ name } />;
};

export default OSAR;
