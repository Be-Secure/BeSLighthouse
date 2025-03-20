import React, { useEffect, useRef, useState } from "react";
import { Grid, Tooltip, Card, Typography, Box, debounce } from "@mui/material";
import OSAR from "./OSAR";
import BusinessIcon from "../../assets/images/organization.png";
import CalendarMonthIcon from "../../assets/images/calendar.png";
import GavelIcon from "../../assets/images/gavel.png";
import HuggingFaceIcon from "../../assets/images/hf-logo.png";
import MaximizeIcon from "../../assets/images/maximize.png";
import UpAndDownIcon from "../../assets/images/up-and-down.png";
import GitHubIcon from "../../assets/images/github-mark.png";

const TruncatedText = ({ text }: any) => {
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
  }, [text]);

  const [firstWord, ...remainingWords] = text.split(" ");
  
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
          { text }
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
      <Box ref={ textRef } sx={ { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 5, overflow: "hidden", whiteSpace: "normal", lineHeight: "1.2em", position: "relative", top: "-8px", marginRight: "43px", marginLeft: "5px" } }>
        <Typography variant="body1" sx={ { fontSize: 14, display: "inline"} }>
          <strong>{ firstWord }</strong> { remainingWords.join(" ") }
        </Typography>
      </Box>
    </Tooltip>
  );
};

const InfoBadge = ({ title, value = "N/A", Icon }: { title: string; value?: string; Icon: string }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200); // Debounce for performance

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Truncation logic
  let displayValue = value?.trim() || "N/A";
  if ((windowWidth <= 1520 && value.length > 12) || value.length > 14) {
    displayValue = `${value.substring(0, 9)}...`;
  }
  return (
    <Box display="flex" alignItems="center" gap={ 1 }>
      <img src={ Icon } alt="icon" style={ { width: "27px" } } />
      <Tooltip title={ `${title}: ${value}` } arrow>
        <Typography
          sx={ {
            fontSize: 14,
            color: "black",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          } }
        >
          { displayValue }
        </Typography>
      </Tooltip>
    </Box>
  );
};

const IconLink = ({ url, icon, name }: any) => (
  <Tooltip title={ name }>
    <span> { /* Wrapping in <span> to prevent invalid DOM nesting issues */ }
      <a
        href={ url || undefined }
        target={ url ? "_blank" : undefined }
        rel={ url ? "noopener noreferrer" : undefined }
        style={ {
          pointerEvents: url ? "auto" : "none",
          opacity: url ? 1 : 0.5,
          textDecoration: url ? "none" : "line-through",
        } }
      >
        { icon }
      </a>
    </span>
  </Tooltip>
);

export default function ModelCardDetails({ model }: any) {
  const selectedModel = model[0] || {};

  return (
    <Grid container spacing={ 1 } sx={ { height: "100%", alignItems: "stretch" } }>
      <Grid item xs={ 12 } xl={ 9.5 } sx={ { display: "flex", flexDirection: "column" } }>
        <Card sx={ { flex: 1, display: "flex", flexDirection: "column", pt: 1.5 } }>
          <Grid container spacing={ 2 } pl={ 2 }>
            <Grid item xs={ 12 } xl={ 9 } container>
              <TruncatedText text={ selectedModel.description || "No description available" } />
            </Grid>

            <Grid item xs={ 12 } xl={ 1.5 }>
              <Grid container spacing={ 1 } gap={ 2 } pt={ 1 } flexDirection={ { xs: "row", lg: "column" } } alignItems={ { xs: "center", lg: "flex-start" } }>
                <InfoBadge title="Size" value={ selectedModel.size } Icon={ MaximizeIcon } />
                <InfoBadge title="Modality(Input type; Output type)" value={ selectedModel.modality } Icon={ UpAndDownIcon } />
                <InfoBadge title="License" value={ selectedModel.license } Icon={ GavelIcon } />
              </Grid>
            </Grid>

            <Grid item xs={ 12 } xl={ 1.5 }>
              <Grid container spacing={ 1 } gap={ 2 } pt={ 1 } flexDirection={ { xs: "row", lg: "column" } } alignItems={ { xs: "center", lg: "flex-start" } }>
                <InfoBadge title="Date" value={ selectedModel.created_date ? new Date(selectedModel.created_date).toLocaleDateString() : "N/A" } Icon={ CalendarMonthIcon } />
                <InfoBadge title="Organization" value={ selectedModel.organization } Icon={ BusinessIcon } />
                <Box display="flex" justifyContent="center" alignItems="center" gap={ 2 } sx={ {height: "40px", left: '-6px', position: 'relative'} }>
                  <IconLink url={ selectedModel.model_url } icon={ <img src={ HuggingFaceIcon } alt="Hugging Face" width={ 40 } height={ 40 } /> } name={ "Hugging Face" } />
                  <IconLink url={ selectedModel.url } icon={ <img src={ GitHubIcon } alt="GitHub" width={ 30 } height={ 30 } /> } name={ "GitHub" } />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={ 12 } xl={ 2.5 } sx={ { display: "flex", flexDirection: "column" } }>
        <OSAR name={ selectedModel.name } />
      </Grid>
    </Grid>
  );
}
