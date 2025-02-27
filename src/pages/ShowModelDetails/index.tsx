import React from "react";
import MKBox from "../../components/MKBox";
import DefaultNavbar from "../../components/Navbars/DefaultNavbar";
import routes from "../../routes";
import ModelCardDetails from "../../components/ModelReport/ModelCardDetails";
// import SummaryCards from "./SummaryCards";
import { modelOfInterestData } from "../../dataStore";
import { useParams } from "react-router-dom";
import { verifyLink } from "../../utils/verifyLink";
import SummaryDashboard from "./SummaryDashboard";

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
      <MKBox pt={ 11 } sx={ { mx: { xs: 'auto', lg: 3 }} }>
        <ModelCardDetails model={ model } />
        { /* <SummaryCards name={ model[0]?.name }/> */ }
        <SummaryDashboard/>
      </MKBox >
    </>
  );
}

export default ShowModelDetails;


