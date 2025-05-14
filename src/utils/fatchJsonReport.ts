import axios from 'axios';

export async function fetchJsonReport(url: string, defaultResult?: any): Promise<any> {
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data && typeof data === 'object' && data.error) {
      console.error("Logical API error:", data.details || data.error);
      // You can decide how to handle this - return empty, default, or rethrow
      return JSON.stringify(defaultResult);
    }

    if (url.toLowerCase().endsWith(".pdf")) {
      const regex = /404: Not Found/gm;
      if (regex.test(data)) {
        return JSON.stringify(data);
      }
      return '{"pdfFile":true}';
    }

    return JSON.stringify(data);
  } catch (error) {
    if (url.toLowerCase().endsWith("project-metadata.json") || url.toLowerCase().endsWith("osspoi_master")) {
      return JSON.stringify({ items: [] });
    } else if (url.toLowerCase().endsWith("vulnerability-metadata.json") || url.toLowerCase().endsWith("vulnerability_of_interest") || url.toLowerCase().endsWith("model-metadata.json") || url.toLowerCase().endsWith("model_of_interest")) {
      return JSON.stringify([]);
    }
    if (defaultResult) {
      return JSON.stringify(defaultResult);
    }
    throw error;
  }
}

export async function getEnvPathStatus(besName: string): Promise<any> {
  const name = besName.split('-');
  const camelCaseString = name.map((part, index) => {
    return index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');

  const bturl = `https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/master/${camelCaseString}/0.0.1/besman-${camelCaseString}-BT-env.sh`;
  const rturl = `https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/master/${camelCaseString}/0.0.1/besman-${camelCaseString}-RT-env.sh`;

  try {
    const btResponse = await axios.get(bturl);
    if (btResponse.status === 200) {
      return true;
    }
  } catch (error) {
    try {
      const rtResponse = await axios.get(rturl);
      if (rtResponse.status === 200) {
        return true;
      }
    } catch (err) {
      console.log("Error while getting the httpRequest", err);
      throw false;
    }
  }
}
