import React, { useEffect, useRef, useState } from "react";
import { Grid, Tooltip, Card, Typography, Box } from "@mui/material";
import MKTypography from "../MKTypography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import OSAR from "./OSAR";

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
        <RedirectLink value={ value } label={ label }/>
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
        <Typography variant="body1" sx={ { fontSize: 14 } }>
          <strong>{ firstWord }</strong> { words.join(" ") }
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default function ModelCardDetails({ model }: any) {
  const selectedModel = model.length > 0 ? model[0] : {};

  return (
    <Grid container spacing={ 2 } sx={ { height: "100%", alignItems: "stretch" } }>
      { /* Model Details Section */ }
      <Grid item xs={ 12 } md={ 10 } sx={ { display: "flex", flexDirection: "column" } }>
        <Card key={ `TOPCARD9~9` } sx={ { flex: 1, display: "flex", flexDirection: "column", pt: 3.5 } }>
          <Grid container spacing={ 2 } pl={ 4 }>
            { /* Model Description - Takes 1/3 width */ }
            <Grid item xs={ 12 } md={ 4 }>
              <Grid container spacing={ 1 } pt={ 0.2 }>
                <ModelDescription description={ selectedModel?.description || "No description available" } />
              </Grid>
            </Grid>

            { /* Model Details - Takes 2/3 width */ }
            <Grid item xs={ 12 } md={ 8 }>
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
          </Grid>
        </Card>
      </Grid>

      { /* OSAR Section */ }
      <Grid item xs={ 12 } md={ 2 } sx={ { display: "flex", flexDirection: "column" } }>
        <OSAR name={ selectedModel.name } />
      </Grid>
    </Grid>
  );
}
