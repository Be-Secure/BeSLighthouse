import { fetchJsonReportOsspoiMaster } from "../utils/fatch_json_report";
import { osspoiMaster, version_details } from "../data-store/dataStore";

export class ProjectOfInterestData {
  public poi: any;

  updateDataPoi(key: string, items: any): void {
    this.poi = new Map<string, any>();
    this.poi.set(key, items);
  }

  getPoiData(key: string): any {
    return this.poi?.get(key) ?? [];
  }

  async getJsonReportOsspoiMaster(): Promise<any> {
    return await fetchJsonReportOsspoiMaster(osspoiMaster);
  }

  async getJsonReportVersionSummary(
    besId: String,
    besName: string
  ): Promise<any> {
    return await fetchJsonReportOsspoiMaster(
      version_details + besId + "-" + besName + "-Versiondetails.json"
    );
  }
}

export const projectOfInterestData = new ProjectOfInterestData();
