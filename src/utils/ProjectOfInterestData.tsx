import { osspoiMaster, versionDetailsURL } from "../dataStore";
import { fetchJsonReport } from "./fatchJsonReport";

export class ProjectOfInterestData {
  public poi: any;

  updateDataPoi(key: string, items: any): void {
    this.poi = new Map<string, any>();
    this.poi.set(key, items);
  }

  getPoiData(key: string): any {
    try {
      return this.poi.get(key);
    } catch (e: any) {
      return [];
    }
  }

  async getJsonReportOsspoiMaster(): Promise<any> {
    return await fetchJsonReport(osspoiMaster);
  }

  async getJsonReportVersionSummary(
    besId: string,
    besName: string
  ): Promise<any> {
    return await fetchJsonReport(
      versionDetailsURL + besId + "-" + besName + "-Versiondetails.json"
    );
  }
}

export const projectOfInterestData = new ProjectOfInterestData();
