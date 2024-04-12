import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Link, To } from "react-router-dom";
import MKBox from "../../../components/MKBox";
import FetchSastReport from "./FetchSastReport";

function switchSast(
  newSast: any,
  myObjectCodeql: To,
  myObjectSonar: To,
  codeQlData: string | any[],
  sonarqubeData: any
) {
  switch (newSast) {
  case "codeql":
    return (
      <>
        { /* Codeql score */ }
        <Typography
          variant="h6"
          key="SASCQTMAINHEADING"
          color="inherit"
          style={ {
            fontSize: "13px",
            display: "flex",
            justifyContent: "center"
          } }
        >
          <Link
            to={ myObjectCodeql }
            key={ `LinkSC1` }
            style={ {
              fontSize: "13px",
              display: "flex",
              justifyContent: "center"
            } }
          >
            CodeQL: { codeQlData.length }
          </Link>
        </Typography>
        <MKBox key="MKBOXSASTCQMAINBODY">
          <FetchSastReport
            cqData={ codeQlData }
            // sqData={sonarqubeData}
          />
        </MKBox>
      </>
    );
  case "sonarqube":
    const issues: any = Object.values(sonarqubeData)[5];
    return (
      <>
        <Typography
          variant="h6"
          key="SASSQTMAINHEADING"
          color="inherit"
          style={ {
            fontSize: "13px",
            display: "flex",
            justifyContent: "center"
          } }
        >
          <Link
            to={ myObjectSonar }
            key={ `LinkSC1` }
            style={ {
              fontSize: "13px",
              display: "flex",
              justifyContent: "center"
            } }
          >
            Sonarqube: { sonarqubeData.total }
          </Link>
        </Typography>
        <MKBox key="MKBOXSASTSQMAINBODY">
          <FetchSastReport cqData={ codeQlData } sqData={ issues } />
        </MKBox>
      </>
    );
  default:
    break;
  }
}

export default function SastToggleButton({
  myObjectCodeql,
  myObjectSonar,
  codeQlData,
  sonarqubeData
}: any) {
  const [sastReport, setSastReport]: any = React.useState("codeql");

  const handleChange = (event: React.MouseEvent<HTMLElement>, sast: string) => {
    setSastReport(sast);
  };

  return (
    <>
      { switchSast(
        sastReport,
        myObjectCodeql,
        myObjectSonar,
        codeQlData,
        sonarqubeData
      ) }
      <MKBox
        style={ {
          display: "flex",
          placeContent: "center",
          height: "100%",
          position: "relative",
          top: "45px"
        } }
      >
        <ToggleButtonGroup
          color="standard"
          value={ sastReport }
          exclusive
          onChange={ handleChange }
          aria-label="Platform"
          size="medium"
        // style={{ display: "flex", position: "relative", top: "45px", left: "18%" }}
        >
          <ToggleButton disabled={ sastReport === "codeql" } value="codeql">
            CodeQL
          </ToggleButton>
          <ToggleButton disabled={ sastReport === "sonarqube" } value="sonarqube">
            Sonarqube
          </ToggleButton>
        </ToggleButtonGroup>
      </MKBox>
    </>
  );
}
