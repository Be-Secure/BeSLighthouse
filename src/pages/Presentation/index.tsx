import * as React from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';  

import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";

import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";
import Button from "../../components/MKButton";

// Presentation page sections
import Counters from "./sections/Counters";

// Routes
import routes from "../../routes";

// Images
//import bgImage from "../../assets/images/ms-icon-310x310.png";

function Presentation() {
  return (
    <>
      <DefaultNavbar routes={routes} sticky />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          // backgroundImage: `url(${bgImage})`,
          //background: '#8045cb',
          background: 'linear-gradient(to bottom, rgb(64,81,181),rgb(168,70,185) )',
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
          height: "10px",
        }}
      >
        <Container>
          <Grid container item xs={0} lg={7} >
            <MKTypography
              variant="h3"
              color="white"
              mt={-6}
              mb={1}
              style={{
                fontSize:"30px",
                lineHeight: '1.3'
              }}
            >
            Transform next generation application security threat models and security assessment playbooks into global commons{" "}
            </MKTypography>
       
            <MKTypography
              variant="body2"
              color="white"
              textAlign="left"
              xs={0}
              mt={1}
              style={{ marginBottom: '30px', 
                marginTop: '16px',
                lineHeight: '1.3'
              }}
            >
              BeSLighthouse provides an intuitive dashboard with actionable insights into the security posture of open-source projects, machine learning models, training dataset to foster trust and reliability in the open-source ecosystem.
            </MKTypography>
            <Stack spacing={2} direction="row">  
            <a href={"/BeSLighthouse/Project-Of-Interest"}>
              <Button variant="contained"> Try it</Button>
            </a>
            </Stack>  
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
