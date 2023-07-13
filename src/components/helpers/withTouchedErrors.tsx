// @flow

import * as React from "react";


function touchedErrors(
  touched: any = {},
  errors: any= {},
  fields: Array<string> = []
): any {
  return fields.reduce(
    (acc, cur) =>
      Object.assign(acc, {
        [cur]: touched && touched[cur] && errors ? errors[cur] : "",
      }),
    {}
  );
}

function withTouchedErrors(fields: Array<string> = []) {
  return function withComponent(
    Component: any
  ): any {
    return function WithTouchedErrors(props: any) {
      const errors = touchedErrors(props.touched, props.errors, fields);
      return <Component {...props} errors={errors} />;
    };
  };
}

export default withTouchedErrors;
