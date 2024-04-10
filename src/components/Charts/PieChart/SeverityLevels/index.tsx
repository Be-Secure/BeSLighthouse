
 
import * as React from "react";

import Card from "@mui/material/Card";

import { StyledChartWrapper } from "../StyledChartWrapper";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import useChart from "../useChart";
import MKBox from "../../../../components/MKBox";
import { fNumber } from "../../../../utils/formatNumber";

function SeverityLevels({ chartColors, chartData }: any) {
  const theme = useTheme();
  // console.log("chartData="+JSON.stringify(chartData));

  const chartLabels = chartData.map((i: { label: any }) => i.label);
  const chartSeries = chartData.map((i: { value: any }) => i.value);
  // console.log("chartLabels="+JSON.stringify(chartLabels));
  // console.log("chartSeries="+JSON.stringify(chartSeries));

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "center" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: any) => fNumber(seriesName),
        title: {
          formatter: (seriesName: any) => `${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card style={ { height: "328px", width: "100%" } }>
      <MKBox>
        <MKBox pt={ 1 } pb={ 1 } px={ 1 }>
          <StyledChartWrapper dir="ltr">
            <ReactApexChart
              type="pie"
              series={ chartSeries }
              options={ chartOptions }
              height={ 250 }
            />
          </StyledChartWrapper>
        </MKBox>
      </MKBox>
    </Card>
  );
}
export default SeverityLevels;
