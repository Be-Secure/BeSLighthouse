import { filter } from "lodash";
import React, { useState } from "react";
import { modelOfInterestData } from "../../../dataStore";
import { getComparator } from "../../ProjectOfInterest/ProjectDisplay";
import { fetchJsonData } from "../../BesVersionHistory/AssessmentReport";
import ThreeWayToggleButton from "../../../components/Button/ThreeWayToggle";
import { modelType, filterCheck, riskAnalysis } from "../filter/references";

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    const search = query.trim();
    return filter(array, (_user: any) => {
      if (_user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        return true;
    });
  }
  return stabilizedThis.map((el: any) => el[0]);
}

function filterDataBasedOnUserSelecrtionOnModelType(
  // eslint-disable-next-line @typescript-eslint/no-shadow
  modelType: string,
  getModelLIST: any[]
): any {
  const filteredArray = getModelLIST.filter((item) =>
    item.type.includes(modelType)
  );
  return filteredArray;
}

function filterDataBasedOnUserSelecrtionOnRiskriskAnalysis(
  riskriskAnalysis: string,
  getModelLIST: any[]
): any {
  if (riskriskAnalysis === "Unanalyzed") {
    const filteredArray = getModelLIST.filter((item) =>
      item.quality_control.length === 0
    );
    return filteredArray;
  }
  const filteredArray = getModelLIST.filter((item) =>
    item.quality_control.includes(riskriskAnalysis)
  );
  return filteredArray;
}

export default function ModelDisplay({ selectedFilter }: any) {
  const [filterName, setFilterName] = useState("");
  const [report, setreport]: any = useState([]);
  React.useEffect(() => {
    fetchJsonData(modelOfInterestData, setreport);
  }, []);

  let getModelLIST: any = report;
  if (selectedFilter?.ModelType && !filterCheck[selectedFilter?.ModelType]) {
    getModelLIST = filterDataBasedOnUserSelecrtionOnModelType(
      modelType[selectedFilter?.ModelType],
      getModelLIST
    );
  }
  if (
    selectedFilter?.RiskAnalysis &&
    !filterCheck[selectedFilter?.RiskAnalysis]
  ) {
    getModelLIST = filterDataBasedOnUserSelecrtionOnRiskriskAnalysis(
      riskAnalysis[selectedFilter?.RiskAnalysis],
      getModelLIST
    );
  }

  const handleFilterByName = (event: any) => {
    setFilterName(event.target.value);
  };

  const filteredCveReport = applySortFilter(
    getModelLIST,
    getComparator("asc", "id"),
    filterName
  );
  return (
    <ThreeWayToggleButton
      filteredCveReport={ filteredCveReport }
      filterName={ filterName }
      handleFilterByName={ handleFilterByName }
    />
  );
}
