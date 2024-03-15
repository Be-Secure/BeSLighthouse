import * as React from "react";

// react-countup component
import CountUp from "react-countup";

// React components
import MKBox from "../../../../components/MKBox";
import MKTypography from "../../../../components/MKTypography";

function DefaultCounterCard({
  color,
  count,
  title,
  description,
  ...rest
}: any): any {
  return (
    <MKBox p={ 2 } textAlign="center" lineHeight={ 1 }>
      <MKTypography variant="h1" color={ color } textGradient>
        <CountUp end={ count } duration={ 1 } { ...rest } />
      </MKTypography>
      { title && (
        <MKTypography variant="h5" mt={ 2 } mb={ 1 }>
          { title }
        </MKTypography>
      ) }
      { description && (
        <MKTypography variant="body2" color="text">
          { description }
        </MKTypography>
      ) }
    </MKBox>
  );
}

export default DefaultCounterCard;
