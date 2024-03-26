import * as React from "react";
// @mui material components
import Grid from "@mui/material/Grid";

// React components
import MKBox from "../../../components/MKBox";
import DefaultCounterCard from "../../../components/Cards/CounterCards/DefaultCounterCard";

function Counters() {
  return (
    <MKBox component="section" py={ 3 }>
      <Grid container item xs={ 12 } lg={ 12 }>
        <Grid item xs={ 12 } md={ 2.3 }>
          <DefaultCounterCard
            count={ 1 }
            title="Security Risk"
            description="Understand the security risk of an OSS project before consuming the code."
          />
        </Grid>
        <Grid item xs={ 12 } md={ 2.3 }>
          <DefaultCounterCard
            count={ 2 }
            title="Roadmap"
            description="Stay aligned to a well-defined security roadmap."
          />
        </Grid>
        <Grid item xs={ 12 } md={ 2.3 }>
          <DefaultCounterCard
            count={ 3 }
            title="Visibility"
            description="Gain visibility into threat vectors and proactively manage security."
          />
        </Grid>
        <Grid item xs={ 12 } md={ 2.3 }>
          <DefaultCounterCard
            count={ 4 }
            title="Patching"
            description="Improve timely patching of OSS, driven by a defined security roadmap."
          />
        </Grid>
        <Grid item xs={ 12 } md={ 2.8 }>
          <DefaultCounterCard
            count={ 5 }
            title="Risk Mitigation"
            description="Empower developers to define risk mitigation measures for OSS components based on their security levels."
          />
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default Counters;
