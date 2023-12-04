import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../../components/MKTypography";
import { Icon } from "@mui/material";

function HorizontalModelFuzzCard({
  name,
  position,
  description,
  textAllign,
  cardSide,
  data
}: any) {
  return (
    <Card sx={{ mt: 2 }} style={{height: '138px'}}>
      <Grid container>
        {cardSide ? (
          data && Object.values(data).length > 0 ? (
            <MKTypography
              variant="body2"
              component="p"
              color="black"
              textAlign="left"
              pt={1}
              pb={1}
              sx={{ fontSize: "14px", margin: "auto auto auto 1rem" }}
            >
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Adversarial Efficacy (max):{" "}
                {data["overview"]["Adversarial Efficacy (max)"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Alert: {data["overview"]["Alert"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Defense recommended: {data["overview"]["Defense recommended"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Original Model Accuracy:{" "}
                {data["performance"]["Original Model Accuracy"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Number of test samples:{" "}
                {data["performance"]["Number of test samples"]}
              </MKTypography>
            </MKTypography>
          ) : (
            <MKTypography
              color="black"
              textAlign="center"
              variant="h6"
              pt={5.5}
              pb={5.3}
              sx={{ margin: "auto" }}
            >
              Not Available
            </MKTypography>
          )
        ) : (
          <></>
        )}
        <Grid item xs={12} md={6} lg={6} sx={{ my: "auto" }}>
          <MKBox
            pt={{ xs: 1, lg: 2.5 }}
            pb={2.5}
            pr={cardSide ? 1 : 4}
            pl={cardSide ? "" : 1}
            lineHeight={1}
            style={{
              display: cardSide ? "flex" : "",
              justifyContent: cardSide ? "flex-end" : ""
            }}
          >
            <Card
              style={{
                backgroundColor: "#f0f2f5",
                padding: "0.4rem",
                width: "100%"
              }}
            >
              <MKTypography variant="h6" textAlign={textAllign}>
                {name}
                {description ? (
                  <Icon fontSize="small" title={description}>
                    info
                  </Icon>
                ) : (
                  <></>
                )}
              </MKTypography>
              <MKTypography
                variant="h6"
                sx={{ fontSize: "14px" }}
                color={position.color}
                mb={1}
                textAlign={textAllign}
              >
                {position.label}
              </MKTypography>
            </Card>
          </MKBox>
        </Grid>
        <Grid item xs={12} md={6} lg={6} textAlign="left" display="flex" >
          {cardSide ? (
            <></>
          ) : data && Object.values(data).length > 0 ? (
            <MKBox pt={1} pb={1}>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                AttackType: {data["AttackType"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                ModelInformation: {data["ModelInformation"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                Time: {data["CreatedTimestamp"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                AttackQueries: {data["AttackQueries"]}
              </MKTypography>
              <MKTypography
                color="black"
                textAlign="left"
                sx={{ fontSize: "12px" }}
              >
                VulnerabiltiyThreshold: {data["VulnerabiltiyThreshold"]}
              </MKTypography>
            </MKBox>
          ) : (
            <MKTypography
              color="black"
              textAlign="center"
              variant="h6"
              sx={{ margin: "auto" }}
            >
              Not Available
            </MKTypography>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}

// Typechecking props for the HorizontalTeamCard
HorizontalModelFuzzCard.propTypes = {
  name: PropTypes.string.isRequired,
  position: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light"
    ]),
    label: PropTypes.string.isRequired
  }).isRequired,
  textAllign: PropTypes.string,
  description: PropTypes.string,
  cardSide: PropTypes.bool,
  data: PropTypes.any
};

export default HorizontalModelFuzzCard;
