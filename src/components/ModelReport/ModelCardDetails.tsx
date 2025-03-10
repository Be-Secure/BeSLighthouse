import React, { useEffect, useRef, useState } from "react";
import { Grid, Tooltip, Card, Typography, Box } from "@mui/material";
import MKTypography from "../MKTypography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import OSAR from "./OSAR";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GavelIcon from "@mui/icons-material/Gavel";
import { ReactComponent as HuggingFaceIcon } from "../../assets/images/svgexport-1.svg";
import GitHubIcon from "../../assets/images/github-mark.png";


interface RedirectLinkProps {
  value?: string;
  label?: string;
}

const RedirectLink: React.FC<RedirectLinkProps> = ({ value = "", label = "" }) => {
  if (value.trim()) {
    return (
      <a
        href={ value }
        target="_blank"
        rel="noopener noreferrer"
        style={ {
          textDecoration: "none",
          color: "inherit",
          top: "-3px",
          position: "relative",
        } }
      >
        <Tooltip title={ label === "Model URL" ? "Open Model Link" : "Open Repository" } arrow>
          <OpenInNewIcon style={ { fontSize: "15px", color: "blue" } } />
        </Tooltip>
      </a>
    );
  }

  return (
    <Tooltip title="" arrow>
      <span style={ { opacity: 0.5, pointerEvents: "none" } }>
        <OpenInNewIcon style={ { fontSize: "15px", color: "gray" } } />
      </span>
    </Tooltip>
  );
};

// Reusable component for model detail entries

// eslint-disable-next-line no-unused-vars
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
        <RedirectLink value={ value } label={ label } />
      ) : (
        <Tooltip title={ value?.length > 40 ? value : "" } arrow>
          <MKTypography variant="h6" fontWeight="regular" style={ { fontSize: "15px" } }>
            { value?.length > 40 ? `${value.substring(0, 40)}...` : value }
          </MKTypography>
        </Tooltip>
      ) }
    </Grid>
  );
};

const ModelDescription = ({ description }: any) => {
  const textRef: any = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight);
      }
    };
    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [description]);

  const words = description.split(" ");
  const firstWord = words.shift();

  return (
    <Tooltip
      title={
        <Box
          sx={ {
            maxWidth: "800px",
            backgroundColor: "black",
            color: "white",
            fontSize: 14
          } }
        >
          { description }
        </Box>
      }
      arrow
      placement="bottom"
      PopperProps={ {
        modifiers: [
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ],
        disablePortal: true,
        sx: {
          "& .MuiTooltip-tooltip": {
            opacity: 1,  // Ensure visibility
            transition: "opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
            width: "800px",
            maxWidth: "800px",
          },
          "& .MuiTooltip-arrow": {
            color: "black", // Match tooltip background
          },
        },
      } }
    >
      <Box
        ref={ textRef }
        sx={ {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          cursor: "pointer",
          whiteSpace: "normal",
        } }
      >
        <Typography variant="body1" sx={ { fontSize: 14, top: "-5px", position: "relative" } }>
          <strong>{ firstWord }</strong> { words.join(" ") }
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default function ModelCardDetails({ model }: any) {
  const selectedModel = model.length > 0 ? model[0] : {};
  return (
    <Grid container spacing={ 1 } sx={ { height: "100%", alignItems: "stretch" } }>
      { /* Model Details Section */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 9 } sx={ { display: "flex", flexDirection: "column" } }>
        <Card key={ `TOPCARD9~9` } sx={ { flex: 1, display: "flex", flexDirection: "column", pt: 3.5 } }>
          <Grid container spacing={ 2 } pl={ 2 } sx={ { "& > .MuiGrid-item": { paddingTop: "0px" } } }>
            { /* Model Description - Takes 1/3 width */ }
            <Grid
              item
              xs={ 12 }
              md={ 12 }
              lg={ 7 }
              container
              justifyContent="center"
              alignItems="center"
            >
              <ModelDescription description={ selectedModel?.description || "No description available" } />
            </Grid>

            <Grid
              item xs={ 12 } md={ 12 } lg={ 2.5 }
            >
              <Grid
                container
                spacing={ 1 }
                pl={ 4 }
                pt={ 0 }
                sx={ {
                  flexDirection: { xs: "row", md: "row", lg: "column" },  // Row for small & medium, column for large
                  alignItems: { xs: "center", md: "center", lg: "flex-start" },
                  gap: 1
                } }
              >
                { /* Size */ }
                <Grid item style={ {
                  paddingTop: "6px"
                } }>
                  <Tooltip title={ 'Size' } arrow>
                    <Typography
                      variant="h6"
                      sx={ {
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#3A81A8",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        display: "inline-block",
                        width: "120px",
                        textAlign: "center"
                      } }
                    >
                      { selectedModel.size === '' || selectedModel.size === undefined ? 'N/A' : selectedModel.size }
                    </Typography>
                  </Tooltip>
                </Grid>
                { /* modality */ }
                <Grid item style={ {
                  paddingTop: "0px"
                } }>
                  <Tooltip title={ 'modality' } arrow>
                    <Typography
                      sx={ {
                        fontWeight: "bold",
                        color: "white",
                        backgroundColor: "#007BFF",
                        padding: "4px 8px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        display: "inline-block",
                        width: "120px",
                        textAlign: "center"
                      } }
                    >
                      { selectedModel.modality === '' || selectedModel.modality === undefined ? 'N/A' : selectedModel.modality }
                    </Typography>
                  </Tooltip>
                </Grid>
                { /* Icons */ }
                <Grid
                  item
                  style={ {
                    paddingTop: "0px"
                  } }
                >
                  { selectedModel.model_url ? (
                    <a href={ selectedModel.model_url } target="_blank" rel="noopener noreferrer">
                      <HuggingFaceIcon width={ 30 } height={ 30 } style={ { marginRight: "18px", marginLeft: "18px" } } />
                    </a>
                  ) : (
                    <HuggingFaceIcon width={ 30 } height={ 30 } style={ { opacity: 0.5, pointerEvents: "none", marginRight: "18px", marginLeft: "18px" } } />
                  ) }
                  { selectedModel.url ? (
                    <a href={ selectedModel.url } target="_blank" rel="noopener noreferrer">
                      <img src={ GitHubIcon } alt="GitHub Icon" width={ 30 } height={ 30 } />
                    </a>
                  ) : (
                    <img src={ GitHubIcon } alt="GitHub Icon" width={ 30 } height={ 30 } style={ { opacity: 0.5, pointerEvents: "none" } } />
                  ) }
                </Grid>
              </Grid>
            </Grid>
            { /* Second Column */ }
            <Grid
              item xs={ 12 } md={ 12 } lg={ 2.5 }
            >
              <Grid
                container
                spacing={ 1 }
                pl={ 4 }
                sx={ {
                  flexDirection: { xs: "row", md: "row", lg: "column" },  // Row for small & medium, column for large
                  alignItems: { xs: "center", md: "center", lg: "flex-start" },
                  gap: 1
                } }
              >
                <Grid item style={ {
                  paddingTop: "8px"
                } }>
                  <Grid container direction="row" alignItems="center" spacing={ 1 }>
                    <Grid item>
                      <CalendarMonthIcon sx={ { fontSize: 30, color: "black" } } />
                    </Grid>
                    <Grid item>
                      <Typography sx={ { fontSize: "14px", color: "black", top: '-3px', position: 'relative' } }>{ selectedModel.created_date === '' || selectedModel.created_date === undefined ? 'N/A' : new Date(selectedModel.created_date).toLocaleDateString() }</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item style={ {
                  paddingTop: "0px"
                } }>
                  <Grid container direction="row" alignItems="center" spacing={ 1 }>
                    <Grid item>
                      <GavelIcon sx={ { fontSize: 20, color: "black" } } />
                    </Grid>
                    <Grid item>
                      <Tooltip title={ 'license' } arrow>
                        <Typography sx={ { fontSize: "14px", color: "black", top: '-3px', position: 'relative' } }>
                          { selectedModel.license === '' || selectedModel.license === undefined ? 'N/A' : selectedModel.license }</Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item style={ {
                  paddingTop: "0px"
                } }>
                  <Grid container direction="row" alignItems="center" spacing={ 1 }>
                    <Grid item>
                      <BusinessIcon sx={ { fontSize: 20, color: "black" } } />
                    </Grid>
                    <Grid item>
                      <Tooltip title={ 'organization' } arrow>
                        <Typography sx={ { fontSize: "14px", color: "black", top: '-3px', position: 'relative' } }>{ selectedModel.organization === '' || selectedModel.organization === undefined ? 'N/A' : selectedModel.organization }</Typography>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      { /* OSAR Section */ }
      <Grid item xs={ 12 } md={ 12 } lg={ 3 } sx={ { display: "flex", flexDirection: "column" } }>
        <OSAR name={ selectedModel.name } />
      </Grid>
    </Grid>
  );
}
