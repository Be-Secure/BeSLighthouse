import { fetchJsonReport } from "./fatchJsonReport";

export const verifyLink = async (link: any, setLinkStatus: any, defaultResponse?: any) => {
  try {
    const response = await fetchJsonReport(link);
    try {
      const data = JSON.parse(response);
      setLinkStatus(data);
    } catch (err) {
      setLinkStatus(defaultResponse ?? {});
    }
  } catch (error) {
    setLinkStatus(defaultResponse ?? {});
  }
};
