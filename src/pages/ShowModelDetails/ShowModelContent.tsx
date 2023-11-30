import Card from "@mui/material/Card";
import * as React from "react";
import { useLocation } from "react-router-dom";
import MKTypography from "../../components/MKTypography";
import MKBox from "../../components/MKBox";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const SkipContent: any = {
  analysis: true,
  training_emissions: true,
  training_time: true,
  training_hardware: true,
  quality_control: true,
  intended_uses: true,
  prohibited_uses: true,
  monitoring: true,
  feedback: true,
  type: true
};

export const dividerDiv = (index: number) => {
  if (index !== 0)
    return (
      <Divider style={{ position: "absolute", width: "91%", margin: "0" }} />
    );
};

function tableRowForModel(keyName: any, value: any, index: number) {
  return (
    <>
      {dividerDiv(index)}
      <tr>
        <td>
          <Typography variant="subtitle1" color="inherit">
            {keyName}
          </Typography>
        </td>
        <td>
          <Typography variant="subtitle1" color="inherit">
            {value}
          </Typography>
        </td>
      </tr>
    </>
  );
}

function ShowModelContent() {
  const location = useLocation();
  const selectedMenu = location.state.selectedMenu;
  const key = Object.keys(selectedMenu);
  let count = 0;
  return (
    <Card>
      <MKBox pt={2} px={3}>
        <MKTypography
          style={{ textAlign: "center" }}
          variant="h5"
          fontWeight="medium"
        >
          {selectedMenu.name}
        </MKTypography>
      </MKBox>
      <MKBox p={2}>
        <table>
          <tbody>
            {key.map((keyValue, index) => {
              if (SkipContent[keyValue]) return <></>;
              if (keyValue === "created_date" || keyValue === "license") {
                tableRowForModel(
                  keyValue,
                  selectedMenu[keyValue].value,
                  count++
                );
              }
              if (keyValue === "dependencies") {
                tableRowForModel(
                  keyValue,
                  selectedMenu[keyValue].join(" | "),
                  count++
                );
              }
              if (keyValue === "url") {
                return (
                  <>
                    {dividerDiv(index)}
                    <tr>
                      <td>
                        <Typography variant="subtitle1" color="inherit">
                          {keyValue}{" "}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle1" color="inherit">
                          <a
                            href={selectedMenu[keyValue]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#587f2f" }}
                          >
                            {selectedMenu[keyValue]}
                          </a>
                        </Typography>
                      </td>
                    </tr>
                  </>
                );
              }
              return tableRowForModel(
                keyValue,
                selectedMenu[keyValue],
                count++
              );
            })}
          </tbody>
        </table>
      </MKBox>
    </Card>
  );
}

export default ShowModelContent;
