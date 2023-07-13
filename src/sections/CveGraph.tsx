import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import { Card, CardHeader, Box } from "@mui/material";
import useChart from "../components/chart/useChart";
// components

// ----------------------------------------------------------------------

CveGraph.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function CveGraph({
  title,
  subheader,
  chartLabels,
  chartData,
  ...other
}: any) {
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "16%" } },
    fill: { type: chartData.map((i: any) => i.fill) },
    labels: chartLabels,
    xaxis: {
      title: {
        text: "Years",
      },
      type: "datetime",
      labels: {
        formatter: function (value: any) {
          const date = new Date(value);
          return date.getFullYear().toString();
        },
      },
      tooltip: {
        x: {
          formatter: function (value: any) {
            const date = new Date(value);
            return date.getFullYear().toString();
          },
        },
      },
    },
    yaxis: {
      title: {
        text: "# Of Vulns",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y: any) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)}`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData}
          options={chartOptions}
          height={385}
        />
      </Box>
    </Card>
  );
}
