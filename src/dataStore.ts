import jsonData from './apiDetailsConfig.json';

const toolName = jsonData.activeTool === 'github' ? 'github' : 'gitlab';

export const osspoiMaster =
  `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/projects/project-metadata.json`;
export const versionDetailsURL: string =
  `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/projects/project-version/`;
export const assessmentDatastoreURL =
  `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assessment-datastore/${jsonData[toolName].branch}`;
export const vulnerabilityOffInterest =
  `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/vulnerabilities/vulnerability-metadata.json`;
export const modelOfInterestData =
  `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/models/model-metadata.json`;
export const besecureMlAssessmentDataStore = `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-ml-assessment-datastore/${jsonData[toolName].branch}/models`;
