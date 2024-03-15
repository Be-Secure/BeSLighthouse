const domainName = process.env.DOMAIN_NAME ?? 'https://raw.githubusercontent.com';
const besNameSpace = process.env.BES_NAMESPACE ?? 'Be-Secure';
const besBranch = process.env.BES_BRANCH ?? 'main';

export const osspoiMaster =
  `${domainName}/${besNameSpace}/besecure-assets-store/${besBranch}/projects/project-metadata.json`;
export const versionDetailsURL: string =
  `${domainName}/${besNameSpace}/besecure-assets-store/${besBranch}/projects/project-version/`;
export const assessmentDatastoreURL =
  `${domainName}/${besNameSpace}/besecure-assessment-datastore/${besBranch}`;
export const vulnerabilityOffInterest =
  `${domainName}/${besNameSpace}/besecure-assets-store/${besBranch}/vulnerabilities/vulnerability-metadata.json`;
export const modelOfInterestData =
  `${domainName}/${besNameSpace}/besecure-assets-store/${besBranch}/models/model-metadata.json`;
export const besecureMlAssessmentDataStore = `${domainName}/${besNameSpace}/besecure-ml-assessment-datastore/${besBranch}/models`;
