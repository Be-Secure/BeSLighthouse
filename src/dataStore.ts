import jsonData from './apiDetailsConfig.json';

const toolName = jsonData.activeTool === 'github' ? 'github' : 'gitlab';

export const osspoiMaster =
  jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/projects/project-metadata.json` : `${jsonData[toolName].apiUrl}/osspoi_master`;
export const versionDetailsURL: string =
  jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/projects/project-version/` : `${jsonData[toolName].apiUrl}/version_details/`;
export const assessmentDatastoreURL =
  jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assessment-datastore/${jsonData[toolName].branch}` : `${jsonData[toolName].apiUrl}/assessment_datastore`;
export const vulnerabilityOffInterest =
  jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/vulnerabilities/vulnerability-metadata.json` : `${jsonData[toolName].apiUrl}/vulnerability_of_interest`;
export const modelOfInterestData =
  jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-assets-store/${jsonData[toolName].branch}/models/model-metadata.json` : `${jsonData[toolName].apiUrl}/model_of_interest`;
export const besecureMlAssessmentDataStore = jsonData.activeTool === 'github' ? `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-ml-assessment-datastore/${jsonData[toolName].branch}/models` : `${jsonData[toolName].apiUrl}/${jsonData[toolName].namespace}/besecure-ml-assessment-datastore/${jsonData[toolName].branch}/models`;
export const besecureEnvironmentMetadata = 'https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/refs/heads/master/environment-metadata.json';
export const besecurePlaybookMetadata = 'https://raw.githubusercontent.com/Be-Secure/besecure-playbooks-store/refs/heads/main/playbook-metadata.json';
