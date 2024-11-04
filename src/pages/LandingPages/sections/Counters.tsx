import * as React from "react";
import Grid from "@mui/material/Grid";
import MKBox from "../../../components/MKBox";
import DefaultCounterCard from "../../../components/Cards/CounterCards/DefaultCounterCard";
import { counterCardsData } from "../../../utils/counterCardConfig";

const Counters: React.FC = () => {
  return (
    <MKBox component="section" py={ 3 }>
      <Grid container spacing={ 2 }>
        { counterCardsData.map((card) => (
          <Grid item xs={ 12 } md={ 2.3 } key={ card.count }>
            <DefaultCounterCard
              count={ card.count }
              title={ card.title }
              description={ card.description }
            />
          </Grid>
        )) }
      </Grid>
    </MKBox>
  );
};

export default Counters;
