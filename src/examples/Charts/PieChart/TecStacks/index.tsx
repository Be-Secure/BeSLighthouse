import * as React from "react";

import Card from "@mui/material/Card";


import { useTheme } from "@mui/material/styles";
import ReactApexChart from "react-apexcharts";
import useChart from "../useChart";
import { fNumber } from "../../../../utils/formatNumber";
import { StyledChartWrapper } from "../StyledChartWrapper";
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../../components/MKTypography";

function TecStack({ title, chartColors, chartData }: any) {
  const theme = useTheme();

  const chartLabels = chartData.map((i: { label: any }) => i.label);

  const chartSeries = chartData.map((i: { value: any }) => i.value);

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
          formatter: (seriesName: any) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });
  return (
    <Card sx={{ height: "100%" }}>
      <MKBox>
        <MKBox pt={1} pb={1} px={1}>
          <MKTypography
            display="flex"
            justifyContent="center"
            alignItems="center"
            variant="h5"
            textTransform="capitalize"
          >
            {title}
          </MKTypography>
          <StyledChartWrapper dir="ltr">
            <ReactApexChart
              type="pie"
              series={chartSeries}
              options={chartOptions}
              height={260}
            />
          </StyledChartWrapper>
        </MKBox>
      </MKBox>
    </Card>
  );
}

export default TecStack;
