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

  async fetchOsspoiMaterData() {
    const osspoi: any = JSON.parse(
      await projectOfInterestData.getJsonReportOsspoiMaster()
    );
    projectOfInterestData.updateDataPoi("Project_of_interest", osspoi.items);
    return osspoi;
  };
}

export const projectOfInterestData = new ProjectOfInterestData();
