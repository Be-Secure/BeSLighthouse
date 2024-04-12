import * as React from "react";
import Card from "@mui/material/Card";
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
  type: true,
  id: true,
  bes_tracking_id: true,
  issue_url: true,
  model_url: true,
  data_url: true,
  label_url: true
};

export const dividerDiv = (index: number) => {
  if (index !== 0)
    return (
      <Divider style={ { position: "absolute", width: "91%", margin: "0" } } />
    );
};

function underScoreToSentence(underScoreString: string) {
  const wordsArray = underScoreString.split("_");
  const capitalizeWords = wordsArray.map(
    (word, index) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const sentence = capitalizeWords.join(" ");
  return sentence;
}

function tableRowForModel(keyName: any, value: any, index: number) {
  return (
    <>
      { dividerDiv(index) }
      <tr>
        <td>
          <Typography variant="subtitle1" pr={ 2 } color="inherit">
            { keyName }
          </Typography>
        </td>
        <td>
          <Typography variant="subtitle1" color="inherit">
            { value }
          </Typography>
        </td>
      </tr>
    </>
  );
}

function ShowModelContent({ model }: any) {
  const selectedModel = model.length > 0 ? model[0] : {};

  const modelObject = Object.keys(selectedModel);
  let count = 0;
  return (
    <Card style={ { height: "100%" } }>
      <MKBox pt={ 2 } px={ 3 }>
        <MKTypography
          style={ { textAlign: "center" } }
          variant="h5"
          fontWeight="medium"
        >
          Model Card
        </MKTypography>
      </MKBox>
      <MKBox p={ 2 }>
        <table>
          <tbody>
            { modelObject.map((key, index) => {
              if (SkipContent[key]) return <></>;
              if (key === "created_date" || key === "license") {
                tableRowForModel(
                  underScoreToSentence(key),
                  selectedModel[key].value,
                  count++
                );
              }
              if (key === "dependencies") {
                tableRowForModel(
                  underScoreToSentence(key),
                  selectedModel[key].join(" | "),
                  count++
                );
              }
              if (key === "url") {
                return (
                  <>
                    { dividerDiv(index) }
                    <tr>
                      <td>
                        <Typography variant="subtitle1" color="inherit">
                          { underScoreToSentence(key) }{ " " }
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="subtitle1" color="inherit">
                          <a
                            href={ selectedModel[key] }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ { color: "#587f2f" } }
                          >
                            { selectedModel[key] }
                          </a>
                        </Typography>
                      </td>
                    </tr>
                  </>
                );
              }
              return tableRowForModel(
                underScoreToSentence(key),
                selectedModel[key],
                count++
              );
            }) }
          </tbody>
        </table>
      </MKBox>
    </Card>
  );
}

export default ShowModelContent;
