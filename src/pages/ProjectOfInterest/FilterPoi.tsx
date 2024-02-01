import * as React from "react";
import Box from "@mui/material/Box";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { BeSTechnologyStack } from "./filter/BeS-TechnologyStack";
import { SecurityDomain } from "./filter/SecurityDomain";
import { TechnologyDomain } from "./filter/TechnologyDomain";
import { Industry } from "./filter/Industry";
import { TechnologyDomainComposition } from "./filter/TechnologyDomainComposition";
import { OpenSourceProjectType } from "./filter/OpenSourceProjectType";
import { Grid } from "@mui/material";
import MKButton from "../../components/MKButton";
import { Languages } from "./filter/Languages";

export default function ScrollableTabsButtonVisible({
  filter,
  setFilter
}: any) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: "100%",
        mx: { xs: 2, lg: 3 }
      }}
      pt={1}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 }
          }
        }}
      >
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={<BeSTechnologyStack filter={filter} setFilter={setFilter} />}
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={<SecurityDomain filter={filter} setFilter={setFilter} />}
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={<TechnologyDomain filter={filter} setFilter={setFilter} />}
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={<Industry filter={filter} setFilter={setFilter} />}
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={
            <TechnologyDomainComposition
              filter={filter}
              setFilter={setFilter}
            />
          }
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={
            <OpenSourceProjectType filter={filter} setFilter={setFilter} />
          }
        />
        <Tab
          style={{
            margin: "0",
            padding: "0",
            backgroundColor: "#f8f9fa",
            borderRadius: "1",
            paddingRight: "12px"
          }}
          label={
            <Languages filter={filter} setFilter={setFilter} />
          }
        />
      </Tabs>
    </Box>
  );
}
