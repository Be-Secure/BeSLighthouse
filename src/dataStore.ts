import jsonData from './apiDetailsConfig.json';

const toolName = jsonData.activeTool === 'github' ? 'github' : 'gitlab';

export const osspoiMaster =
  `${jsonData[toolName].apiUrl}/osspoi_master`;
export const versionDetailsURL: string =
  `${jsonData[toolName].apiUrl}/version_details/`;
export const assessmentDatastoreURL =
  `${jsonData[toolName].apiUrl}/assessment_datastore`;
export const vulnerabilityOffInterest =
  `${jsonData[toolName].apiUrl}/vulnerability_of_interest`;
export const modelOfInterestData =
  `${jsonData[toolName].apiUrl}/model_of_interest`;
export const besecureMlAssessmentDataStore = `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-ml-assessment-datastore/${jsonData[toolName].branch}/models`;
