

import * as React from "react";

import Card from "@mui/material/Card";

import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import useChart from "./useChart";
import MKBox from "../../MKBox";
import { fNumber } from "../../../utils/formatNumber";
import { Typography } from "@mui/material";
import MKTypography from "../../MKTypography";

function PieChart({ title, chartColors, chartData, height }: any) {
  const theme = useTheme();

  const chartLabels = chartData.map((i: { label: any }) => i.label);

  const chartSeries = chartData.map((i: { value: any }) => i.value);

  const chartOptions = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { position: "right", offsetY: -20 },
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
    <Card>
      <MKBox pt={ 1 } pb={ 1 } px={ 1 }>
        {
          (title === "Risk Posture") ? <MKTypography
            variant="h6"
            fontWeight="bold"
            color="text"
            textTransform="capitalize"
            style={ {
              fontSize: "15px",
              display: "flex",
              position: "relative",
              left: "-44px",
              placeContent: "center",
            } }
          >
            { title }
          </MKTypography> : <Typography
            display="flex"
            justifyContent="left"
            alignItems="left"
            color="black"
            fontSize="20px"
            variant="h6"
            pl={ 2 }
            textTransform="capitalize"
          >
            { title }
          </Typography>
        }

        <ReactApexChart
          type="pie"
          series={ chartSeries }
          options={ chartOptions }
          height={ height ?? 195 }
        />
      </MKBox>
    </Card>
  );
}

export default PieChart;
