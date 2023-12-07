import { filter } from "lodash";
import React, { useState } from "react";
import { modelOfInterestData } from "../../../dataStore";
import { getComparator } from "../../../layouts/pages/projectOfInterest/ProjectDisplay";
import { verifyLink } from "../../BesVersionHistory/AssessmentReport";
import SearchVoiList from "../../VulnerabilityOfInterest/VoiTable/SearchVoiList";
import ModelTable from "./ModelTable";

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    let search = query.trim();
    return filter(array, (_user: any) => {
      if (_user.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) return true;
    });
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function ModelDisplay() {
  const [filterName, setFilterName] = useState("");
  const handleFilterByName = (event: any) => {
    setFilterName(event.target.value);
  };

  const [report, setreport]: any = useState([]);
  React.useEffect(() => {
    verifyLink(modelOfInterestData, setreport);
  }, []);
  const filteredCveReport = applySortFilter(
    report,
    getComparator("asc", "id"),
    filterName
  );
  
  return (
    <>
      <SearchVoiList
        placeholderName="Search model by name"
        filterName={filterName}
        onFilterName={handleFilterByName}
      />
      <ModelTable data={filteredCveReport} />
    </>
  );
}
