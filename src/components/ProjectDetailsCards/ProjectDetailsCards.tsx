import * as React from "react";
import { Card } from "@mui/material";
import MKTypography from "../../components/MKTypography";
import { projectTags } from "../../pages/BesVersionHistory/tags";

export const DescriptionCard = ({ title, content }: any) => (
  <Card style={ { width: "100%", paddingBottom: "8px", paddingTop: "5px" } }>
    <MKTypography variant="h6" fontWeight="bold" color="text" textTransform="capitalize" style={ { fontSize: "15px", display: "flex", placeContent: "center" } }>
      { title }
    </MKTypography>
    <MKTypography variant="h6" fontWeight="regular" style={ { fontSize: "15px", display: "flex", textAlign: "justify", paddingLeft: "5%", paddingRight: "5%", paddingTop: "15px", placeContent: "center", color: "black" } }>
      { content }
    </MKTypography>
  </Card>
);

export const LanguagesCard = ({ languages }: any) => (
  <Card style={ { marginTop: "3px", paddingBottom: "8px", paddingTop: "5px" } }>
    <MKTypography variant="h6" textTransform="capitalize" color="text" style={ { fontSize: "15px", display: "flex", placeContent: "center" } }>
      Languages
    </MKTypography>
    <div style={ {
      display: "flex",
      flexWrap: "wrap",
      padding: "0 5%",
      justifyContent: "center"
    } }>
      { languages.map((language: any, index: any) => (
        <span key={ index } style={ {
          padding: "4px 6px",  // Slightly reduced padding to make chips closer
          border: "1px solid #ccc",
          borderRadius: "16px",
          backgroundColor: "#e0e0e0",
          fontSize: "14px",
          color: "black",
          display: "inline-block",
          margin: "2px"  // Optional: very minimal margin for slight separation
        } }>
          { language }
        </span>
      )) }
    </div>
  </Card>
);

export const TagsCard = ({ tags }: any) => {
  const filteredTags = Object.keys(projectTags).filter(key => tags.includes(projectTags[key]));
  
  return (
    <Card style={ { marginTop: "12px", paddingBottom: "8px", paddingTop: "5px" } }>
      <MKTypography
        variant="h6"
        textTransform="capitalize"
        color="text"
        style={ { fontSize: "15px", display: "flex", placeContent: "center" } }
      >
        Tags
      </MKTypography>
      <MKTypography
        variant="h6"
        fontWeight="regular"
        style={ { fontFamily: "Arial", fontSize: "15px", display: "flex", textAlign: "justify", placeContent: "center", paddingLeft: "5%", paddingRight: "5%", color: "black" } }
      >
        { filteredTags.map((tag, index) => (
          <span
            key={ index }
            style={ {
              marginRight: "5px",
              padding: "4px 8px", // Increased padding for a better chip appearance
              border: "1px solid #ccc",
              borderRadius: "16px", // Rounded corners for chip-like effect
              backgroundColor: "#e0e0e0", // Background color for the chip
              display: "inline-block", // Display inline for proper layout
            } }
          >
            { tag }
          </span>
        )) }
      </MKTypography>
    </Card>
  );
};
