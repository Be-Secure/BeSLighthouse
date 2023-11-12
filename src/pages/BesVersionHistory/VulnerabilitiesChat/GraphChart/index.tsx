import * as React from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";
// @mui
import useChart from "../../../../examples/Charts/PieChart/useChart";
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../../components/MKTypography";


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
    <>
      <MKBox pt={3} px={3}>
        <MKTypography variant="h5" fontWeight="medium">
          {title}
        </MKTypography>
      </MKBox>

      <MKBox sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData}
          options={chartOptions}
          height={485}
        />
      </MKBox>
    </>
  );
}
