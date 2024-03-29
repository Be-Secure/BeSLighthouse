import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ModelTable from '../../../pages/ModelOfInterest/ModelDisplay/ModelTable';
import SearchVoiList from '../../../pages/VulnerabilityOfInterest/VoiTable/SearchVoiList';
import GraphView from '../../../pages/ModelOfInterest/GraphDisplay';
import graphIcon from "../../../assets/images/data-flow.png";
import tableIcon from "../../../assets/images/cells.png";
import arcIcon from "../../../assets/images/arc.png";
import ArcDiagram from '../../../pages/ModelOfInterest/ArcDiagram';

function switchView(viewValue: any, filteredCveReport: any, filterName: any, handleFilterByName: any) {
  switch (viewValue) {
  case "table":
    return (
      <>
        <SearchVoiList
          placeholderName="Search model by name"
          filterName={ filterName }
          onFilterName={ handleFilterByName }
        />
        <ModelTable data={ filteredCveReport } />
      </>
    );
  case "graph":
    // Add the graph component here
    return (
      <GraphView />
    );
  case "arc":
    // Add the arc component here
    return (
      <ArcDiagram />
    );
  default:
    return null;
  }
}

export default function ThreeWayToggleButton({ filteredCveReport, filterName, handleFilterByName }: any) {
  const [view, setView] = React.useState('table');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    setView(newView);
  };

  return (
    <>
      <ToggleButtonGroup
        value={ view }
        exclusive
        onChange={ handleChange }
        aria-label="Platform"
        style={ { float: 'right', paddingTop: "2%", paddingRight: "1%" } }
      >
        <ToggleButton style={ { color: "black", fontWeight: "bold" } } value="table" title='Table view of models'><img alt='' style={ { display: "block", width: "17px" } } src={ tableIcon } /></ToggleButton>
        <ToggleButton style={ { color: "black", fontWeight: "bold" } } value="graph" title='Force directed graph that show the models and its dependencies'><img alt='' style={ { display: "block", width: "17px" } } src={ graphIcon } /></ToggleButton>
        <ToggleButton style={ { color: "black", fontWeight: "bold" } } value="arc" title='Arc graph that shows the dependencies between models, vulnerabilities and projects'><img alt='' style={ { display: "block", width: "17px" } } src={ arcIcon } /></ToggleButton>
      </ToggleButtonGroup>
      { switchView(view, filteredCveReport, filterName, handleFilterByName) }
    </>
  );
}
