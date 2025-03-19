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
      <Box ref={ textRef } sx={ { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 5, overflow: "hidden", whiteSpace: "normal", lineHeight: "1.2em", position: "relative", top: "-8px", marginRight: "30px", textAlign: "justify" } } >
        <Typography variant="body1" sx={ { fontSize: 14, display: "inline" } } >
          <strong>{ firstWord }</strong> { remainingWords.join(" ") }
        </Typography>
      </Box>
    </Tooltip>
  );
};

const InfoBadge = ({ title, value = "N/A", Icon }: { title: string; value?: string | string[]; Icon: string }) => {
  // Remove unused state since it's not being used
  useEffect(() => {
    const handleResize = debounce(() => {
      window.innerWidth; // Keep resize listener for potential future use
    }, 200); // Debounce for performance

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayValue = Array.isArray(value) ? value : value?.trim() || "N/A";
  return (
    <Box display="flex" alignItems="center" gap={ 1 }>
      <img src={ Icon } alt="icon" style={ { width: "27px" } } />
      <Tooltip title={ Array.isArray(value) ? value.join(" | ") : `${title} : ${value}` } arrow>
        <Box>
          { Array.isArray(displayValue) ? (
            displayValue.map((line, index) => (
              <Typography
                key={ index }
                sx={ {
                  fontSize: 14,
                  color: "black",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px",
                  lineHeight: "1.2",
                } }
              >
                { line }
              </Typography>
            ))
          ) : (
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
              { displayValue.length > 9 ? `${displayValue.substring(0, 8)}...` : value }
            </Typography>
          ) }
        </Box>
      </Tooltip>
    </Box>
  );
};

function processText(input: string): string[] {
  if (!input) {
    return ["input: N/A", "output: N/A"];
  }
  const parts = input.split(";");
  return [
    `input: ${parts[0]?.trim() || "N/A"}​​​​​​`,
    `output: ${parts[1]?.trim() || "N/A"}​​​​​​`
  ];
}


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

  const modalityInputOutput = processText(selectedModel.modality);

  return (
    <Grid container spacing={ 1 } sx={ { height: "100%", alignItems: "stretch" } }>
      <Grid item xs={ 12 } xl={ 9.5 } sx={ { display: "flex", flexDirection: "column" } }>
        <Card sx={ { flex: 1, display: "flex", flexDirection: "column", pt: 1.5 } }>
          <Grid container spacing={ 2 } pl={ 2 } pr={ 2 }>
            { /* Description - 80% width */ }
            <Grid item xs={ 12 } xl={ 9 } pl={ 2 } pr={ 2 } container>
              <TruncatedText text={ selectedModel.description || "No description available" } />
            </Grid>
            { /* Info Badges - 10% width */ }
            <Grid item xs={ 12 } xl={ 1.5 }>
              <Grid
                container
                spacing={ 1 }
                gap={ 2 }
                pt={ 1 }
                flexDirection={ { xs: "row", lg: "column" } }
                alignItems={ { xs: "center", lg: "flex-start" } }
              >
                <InfoBadge title="Size" value={ selectedModel.size } Icon={ MaximizeIcon } />
                <InfoBadge title="Modality(Input type; Output type)" value={ modalityInputOutput } Icon={ UpAndDownIcon } />
                <InfoBadge title="License" value={ selectedModel.license } Icon={ GavelIcon } />
              </Grid>
            </Grid>
            { /* Date, Organization, and Links - 10% width */ }
            <Grid item xs={ 12 } xl={ 1.5 }>
              <Grid
                container
                spacing={ 1 }
                gap={ 2 }
                pt={ 1 }
                flexDirection={ { xs: "row", lg: "column" } }
                alignItems={ { xs: "center", lg: "flex-start" } }
              >
                <InfoBadge
                  title="Date"
                  value={ selectedModel.created_date ? new Date(selectedModel.created_date).toLocaleDateString() : "N/A" }
                  Icon={ CalendarMonthIcon }
                />
                <InfoBadge title="Organization" value={ selectedModel.organization } Icon={ BusinessIcon } />
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={ 2 }
                  sx={ { height: "40px", position: "relative" } }
                >
                  <IconLink
                    url={ selectedModel.model_url }
                    icon={ <img src={ HuggingFaceIcon } alt="Hugging Face" width={ 40 } height={ 40 } /> }
                    name="Hugging Face"
                  />
                  <IconLink
                    url={ selectedModel.url }
                    icon={ <img src={ GitHubIcon } alt="GitHub" width={ 30 } height={ 30 } /> }
                    name="GitHub"
                  />
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
