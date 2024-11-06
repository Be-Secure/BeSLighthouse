import * as React from "react";
import { Grid, MenuItem, Select, Tooltip } from "@mui/material";
import MKTypography from "../../components/MKTypography";
import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '../../assets/images/owasp_cyclonedx_logo.jpg';
import { generatePdfFromJson } from "../../utils/OsarPdf";

export const InfoGridItem = ({ label, value }: any) => (
  <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "12px" } }>
    <MKTypography variant="h6" color="text" style={ { fontSize: "15px", fontWeight: "normal" } }>
      { label }: &nbsp;
    </MKTypography>
    <MKTypography variant="h6" fontWeight="regular" style={ { fontSize: "15px" } }>
      { value }
    </MKTypography>
  </Grid>
);

export const InfoGridSelect = ({ label, value, onChange, options, key }: any) => (
  <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "12px" } }>
    <MKTypography variant="h6" style={ { fontSize: "15px", fontWeight: "normal" } }>
      { label }: &nbsp;
    </MKTypography>
    <Select key={ key } value={ value } onChange={ onChange } style={ { fontSize: "15px", height: "fit-content" } }>
      { options.map((option: any, index: any) => (
        <MenuItem key={ `TOPMENUITEM${index}` } value={ option }>{ option }</MenuItem>
      )) }
    </Select>
  </Grid>
);

export const OSARGridItem = ({ osarReportData, besName, selectedOption, cosignLinkExists }: any) => (
  <Grid item xs={ 6 } md={ 3 } style={ { display: "flex", paddingTop: "12px" } }>
    <MKTypography
      variant="h6"
      color="text"
      style={ { fontSize: "15px", fontWeight: "normal" } }
      title="Open Source Assessment Summary Report"
    >
      OSAR: &nbsp;
    </MKTypography>
    <div style={ { display: 'flex' } }>
      { Object.keys(osarReportData).length === 0 ? (
        <MKTypography variant="h6" fontWeight="regular" style={ { fontSize: "15px" } }>
          Not Available
        </MKTypography>
      ) : (
        <Tooltip title="Download OSAR">
          <DownloadIcon
            onClick={ () => generatePdfFromJson(osarReportData, `${besName.slice(1)}-${selectedOption}-osar.json`, cosignLinkExists) }
            style={ { cursor: "pointer" } }
          />
        </Tooltip>
      ) }
      { cosignLinkExists && (
        <img src={ CheckIcon } alt="Checked Icon" width={ 24 } height={ 24 } style={ { position: 'relative', top: '-2px' } } />
      ) }
    </div>
  </Grid>
);
