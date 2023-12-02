import React from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../../components/MKTypography";

function HorizontalModelFuzzCard({
  name,
  position,
  description,
  textAllign,
  cardSide
}: any) {
  return (
    <Card sx={{ mt: 3 }}>
      <Grid container>
        {cardSide ? (
          <Grid item xs={12} md={6} lg={4} sx={{ my: "auto" }}>
            <MKBox
              pt={{ xs: 1, lg: 2.5 }}
              pb={2.5}
              pr={4}
              pl={{ xs: 4, lg: 1 }}
              lineHeight={1}
            ></MKBox>
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12} md={6} lg={8} sx={{ my: "auto" }}>
          <MKBox
            pt={{ xs: 1, lg: 2.5 }}
            pb={2.5}
            pr={4}
            pl={{ xs: 4, lg: 1 }}
            lineHeight={1}
          >
            <Card
              style={{
                backgroundColor: "#f0f2f5",
                padding: "0.4rem",
                width: "75%"
              }}
            >
              <MKTypography variant="h5" textAlign={textAllign}>
                {name}
              </MKTypography>
              <MKTypography
                variant="h6"
                color={position.color}
                mb={1}
                textAlign={textAllign}
              >
                {position.label}
              </MKTypography>
              <MKTypography variant="body2" color="text" textAlign={textAllign}>
                {description}
              </MKTypography>
            </Card>
          </MKBox>
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
  description: PropTypes.string.isRequired,
  cardSide: PropTypes.bool
};

export default HorizontalModelFuzzCard;
