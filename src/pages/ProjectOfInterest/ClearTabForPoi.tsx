import * as React from "react";
import Tab from "@mui/material/Tab";
import { SecurityDomain } from "./filter/SecurityDomain";
import { TechnologyDomain } from "./filter/TechnologyDomain";
import { Industry } from "./filter/Industry";
import { TechnologyDomainComposition } from "./filter/TechnologyDomainComposition";
import { OpenSourceProjectType } from "./filter/OpenSourceProjectType";
import { Languages } from "./filter/Languages";
import { BeSTechnologyStack } from "./filter/BeSTechnologyStack";
import { Licensees } from "./filter/Licensees";

export function ClearTabForPoi({ filter, setFilter }: any) {
  return (
    <>
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <BeSTechnologyStack filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <SecurityDomain filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <TechnologyDomain filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "250px"
        } }
        label={ <Industry filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={
          <TechnologyDomainComposition filter={ filter } setFilter={ setFilter } />
        }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <OpenSourceProjectType filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px"
        } }
        label={ <Languages filter={ filter } setFilter={ setFilter } /> }
      />
      <Tab
        style={ {
          margin: "0",
          padding: "0",
          backgroundColor: "white",
          borderRadius: "1",
          paddingRight: "12px",
          minWidth: "302px"
        } }
        label={ <Licensees filter={ filter } setFilter={ setFilter } /> }
      />
    </>
  );
}
