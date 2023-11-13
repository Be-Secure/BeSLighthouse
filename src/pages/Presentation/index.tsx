import * as React from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";

// Presentation page sections
import Counters from "./sections/Counters";

// Routes
import routes from "../../routes";

// Images
import bgImage from "../../assets/images/ms-icon-310x310.png";

function Presentation() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          // backgroundImage: `url(${bgImage})`,
          background: '#8045cb',
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
          height: "10px",
        }}
      >
        <Container>
        <img style={{display: 'block', margin: '-2% auto 5% auto', width: '9%'}} src={bgImage} alt="Icon" />
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKTypography
              variant="h1"
              color="white"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }: any) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              BeSLighthouse{" "}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="white"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              Community Dashboard for security assessment of Open Source Security Tech Stack.
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <Card
        sx={{
          p: 2,
          mx: { xs: 2, lg: 3 },
          mt: -8,
          mb: 4,
          backgroundColor: ({ palette: { white }, functions: { rgba } }: any) =>
            rgba(white.main, 0.8),
          backdropFilter: "saturate(200%) blur(30px)",
          boxShadow: ({ boxShadows: { xxl } }: any) => xxl,
        }}
      >
        <Counters />
      </Card>
    </>
  );
}

export default Presentation;
