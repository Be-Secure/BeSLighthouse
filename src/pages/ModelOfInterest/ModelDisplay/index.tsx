import React, { useState } from "react";
import { modelOfInterestData } from "../../../dataStore";
import { fetchJsonData } from "../../BesVersionHistory/AssessmentReport";
import ThreeWayToggleButton from "../../../components/Button/ThreeWayToggle";
import { modelType, filterCheck, riskAnalysis } from "../filter/references";
import { applySortFilter, getComparator } from "../../../utils/sortFilter";

function filterDataBasedOnUserSelecrtionOnModelType(
  modelTypeName: string,
  getModelLIST: any[]
): any {
  const filteredArray = getModelLIST.filter((item) =>
    item.type.includes(modelTypeName)
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
