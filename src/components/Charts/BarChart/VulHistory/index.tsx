 
import * as React from "react";
import Card from "@mui/material/Card";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import useChart from "../useChart";
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../MKTypography";

function VulHistory({ vuldata, title }: any) {
  const theme = useTheme();
  const chartLabels = vuldata.map((i: { label: any }) => i.label);
  const chartData = vuldata.map((i: { value: any }) => i.value);
  const chartSeries = [{ name: `CVEs Reported`, data: chartData }];

  const chartOptions = useChart({
    xaxis: {
      categories: chartLabels
    },
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "center" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle"
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        borderRadiusApplication: "around",
        borderRadiusWhenStacked: "last",
        columnWidth: "20%",
        barHeight: "100%",
        distributed: false,
        rangeBarOverlap: true,
        rangeBarGroupRows: false,
        hideZeroBarsWhenGrouped: false,
        isDumbbell: false,
        dumbbellColors: undefined,
        isFunnel: false,
        isFunnel3d: true,
        fill: {
          colors: ["#F44336", "#E91E63", "#9C27B0"]
        },
        colors: {
          ranges: [
            {
              from: "#0000",
              to: "#fffff",
              color: "undefined"
            }
          ],
          backgroundBarColors: [],
          backgroundBarOpacity: 1,
          backgroundBarRadius: 0
        },
        dataLabels: {
          position: "top",
          maxItems: 100,
          hideOverflowingLabels: true,
          orientation: "horizontal",
          total: {
            enabled: false,
            formatter: undefined,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: "#373d3f",
              fontSize: "12px",
              fontFamily: undefined,
              fontWeight: 600
            }
          }
        }
      }
    }
  });

  return (

    <Card style={ { height: "100%" } }>
      <MKBox>
        <MKBox pt={ 1 } pb={ 1 } px={ 1 }>
          {
            (title === "Known Vulnerabilities") ? <MKTypography
              variant="h6"
              fontWeight="bold"
              color="text"
              textTransform="capitalize"
              style={ {
                fontSize: "15px",
                display: "flex",
                placeContent: "center",
              } }
            >
              { title }
            </MKTypography> : <></>
          }
          <ReactApexChart
            type="bar"
            series={ chartSeries }
            options={ chartOptions }
            height={ 218 }
          />
        </MKBox>
      </MKBox>
    </Card>

  );
}
export default VulHistory;
