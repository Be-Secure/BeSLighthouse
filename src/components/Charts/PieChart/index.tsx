import * as React from "react";
import Card from "@mui/material/Card";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { useTheme } from "@mui/material/styles";
import useChart from "./useChart";
import MKBox from "../../MKBox";
import { Typography } from "@mui/material";

function PieChart({ title, chartColors, chartData, height }: any) {
  const theme = useTheme();
  const chartId = `${title}-chart`;

  const chartLabels = chartData.map((i: any) => i.label);
  const chartSeries = chartData.map((i: any) => i.value);

  const chartOptions = useChart({
    chart: {
      id: chartId
    },

    colors: chartColors,
    labels: chartLabels,

    legend: { show: false },

    stroke: { colors: [theme.palette.background.paper] },

    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false }
    },

    states: {
      hover: {
        filter: { type: "none" }
      },
      active: {
        filter: { type: "none" }
      },
      inactive: {
        opacity: 0.25
      }
    },

    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          labels: { show: false }
        }
      }
    }
  });

  const highlightSlice = (index: number) => {
    ApexCharts.exec(chartId, "highlightSeries", index);
  };

  const resetSlice = () => {
    ApexCharts.exec(chartId, "resetSeries");
  };

  return (
    <Card sx={{ height: "244px", display: "flex", flexDirection: "column" }}>
      <MKBox pt={1} pb={1} px={1} sx={{ flex: 1 }}>

        {/* TITLE */}
        <Typography color="black" fontSize="20px" variant="h6" pl={2}>
          {title}
        </Typography>

        <MKBox
          sx={{
            display: "flex",
            alignItems: "center",
            height: height ?? 195
          }}
        >

          {/* PIE CHART */}
          <MKBox
            sx={{
              width: "60%",
              display: "flex",
              justifyContent: "center"
            }}
          >
            <ReactApexChart
              type="pie"
              series={chartSeries}
              options={chartOptions}
              height={height ?? 195}
            />
          </MKBox>

          {/* LEGEND */}
          <MKBox
            sx={{
              width: "40%",
              maxHeight: (height ?? 185) - 5,
              overflowY: "auto",
              pl: 2,
              pr: 1,
              pb: 1.5
            }}
          >
            {chartLabels.map((label: string, index: number) => (
              <MKBox
                key={index}
                onMouseEnter={() => highlightSlice(index)}
                onMouseLeave={resetSlice}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  mb: 1.3,
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "#444",

                  "& .legend-text": {
                    display: "block",
                    maxWidth: "110px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "all 0.25s ease"
                  },

                  "&:hover .legend-text": {
                    whiteSpace: "normal",
                    overflow: "visible",
                    textOverflow: "unset",
                    maxWidth: "100%"
                  }
                }}
              >

                {/* COLOR DOT */}
                <MKBox
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: chartColors[index],
                    flexShrink: 0
                  }}
                />

                {/* LEGEND TEXT */}
                <span className="legend-text">
                  {label}
                </span>

              </MKBox>
            ))}
          </MKBox>

        </MKBox>

      </MKBox>
    </Card>
  );
}

export default PieChart;
