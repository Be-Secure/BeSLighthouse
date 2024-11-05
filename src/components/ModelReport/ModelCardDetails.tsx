import React from "react";
import { Grid, Card, Chip, Tooltip, Divider, Box } from "@mui/material";
import MKTypography from "../MKTypography";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Reusable component for model detail entries
const ModelDetail: React.FC<{ label: string; value: string; isLink?: boolean }> = ({ label, value, isLink }) => {
  return (
    <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "6px" } }>
      <MKTypography
        variant="h6"
        textTransform="capitalize"
        color="text"
        style={ { fontSize: "15px", fontWeight: "normal" } }
      >
        { label }: &nbsp;
      </MKTypography>
      { isLink ? (
        <a href={ value } target="_blank" rel="noopener noreferrer" style={ {
          textDecoration: 'none', color: 'inherit', top: '-3px',
          position: 'relative'
        } }>
          <Tooltip title={ label === "Model URL" ? "Open Model Link" : "Open Repository" } arrow>
            <OpenInNewIcon style={ { fontSize: "15px", color: 'blue' } } />
          </Tooltip>
        </a>
      ) : (
        <Tooltip title={ value?.length > 40 ? value : '' } arrow>
          <MKTypography variant="h6" fontWeight="regular" style={ { fontSize: "15px" } }>
            { value?.length > 40 ? `${value.substring(0, 40)}...` : value }
          </MKTypography>
        </Tooltip>
      ) }
    </Grid>
  );
};

export default function ModelCardDetails({ model }: any) {
  const selectedModel = model.length > 0 ? model[0] : {};

  return (
    <Card key={ `TOPCARD12` } sx={ { mb: 2, p: 3 } }>
      <Grid container spacing={ 2 } sx={ { height: '100%', alignItems: 'stretch' } }>
        { /* Model Details Section */ }
        <Grid item xs={ 9 }>
          <Grid container spacing={ 1 } pl={ 4 }>
            { [
              { label: "Name", value: selectedModel.name },
              { label: "Model URL", value: selectedModel.model_url, isLink: true },
              { label: "Size", value: selectedModel.size },
              { label: "License", value: selectedModel.license },
              { label: "Organization", value: selectedModel.organization },
              { label: "Repository URL", value: selectedModel.url, isLink: true },
              { label: "Modality", value: selectedModel.modality },
              { label: "Created Date", value: new Date(selectedModel.created_date).toLocaleDateString() },
            ].map((detail, idx) => (
              <ModelDetail key={ `GRID${idx}` } { ...detail } />
            )) }
          </Grid>
        </Grid>

        { /* Divider */ }
        <Grid item>
          <Box sx={ { height: '100%', display: 'flex', alignItems: 'stretch' } }>
            <Divider orientation="vertical" flexItem sx={ { mx: 2, opacity: 1 } } />
          </Box>
        </Grid>

        { /* Dependencies Section */ }
        <Grid item xs={ 2 } style={ { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0px', height: '100%' } }>
          <MKTypography
            variant="h6"
            textTransform="capitalize"
            color="text"
            style={ { fontSize: '15px', fontWeight: 'normal', marginBottom: '8px' } }
          >
            Dependency
          </MKTypography>

          <Box sx={ { flexGrow: 1, maxHeight: '70px', overflowY: 'auto', width: '100%' } }>
            { selectedModel.dependencies?.map((dep: string, idx: number) => (
              <Tooltip key={ idx } title={ dep.length > 20 ? dep : '' } arrow>
                <Chip
                  label={ dep.length > 20 ? `${dep.substring(0, 20)}...` : dep }
                  variant="outlined"
                  size="small"
                  sx={ { width: '100%' } }
                />
              </Tooltip>
            )) }
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
