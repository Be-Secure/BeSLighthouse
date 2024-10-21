import React from "react";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import routes from "../../routes";
import ModelCardDetails from "../../components/ModelReport/ModelCardDetails";
import ModelDescription from "./ModelDescription";
import SummaryCards from "./SummaryCards";
import { verifyLink } from "./AssessmentSummary";
import { modelOfInterestData } from "../../dataStore";
import { useParams } from "react-router-dom";

function ShowModelDetails() {
  const [data, setData] = React.useState([]);
  const { modelName }: any = useParams();
  React.useEffect(() => {
    verifyLink(modelOfInterestData, setData);
  }, []);
  const model: any = data.filter((item: any) => item.name === modelName.slice(1));
  return (
    <>
      <DefaultNavbar routes={ routes } sticky />
      <MKBox pt={ 12 } sx={ { mx: { xs: 2, lg: 3 } } }>
        <ModelCardDetails model={ model } />
        <ModelDescription description={ model[0]?.description } />
        <SummaryCards />
      </MKBox >
    </>
  );
}

export default ShowModelDetails;
