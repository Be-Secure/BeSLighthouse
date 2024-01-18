import { debug } from "console";
import https from "https";
import { reject } from "lodash";
import { resolve } from "path";

export function fetchJsonReport(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          if (url.toLocaleLowerCase().endsWith(".pdf")) {
            let regex = /404: Not Found/gm;
            if (regex.test(data)) {
              resolve(data);
            }
            resolve('{"pdfFile":true}');
          }
          resolve(data);
        });
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
}

export function getEnvPathStatus(besName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const bturl = `https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/master/${besName}/0.0.1/besman-${besName}-BT-env.sh`;
    https
      .get(bturl, (response: any) => {
        let code = response.statusCode;
        if (code === 200){
          resolve(true);
        } else {
          reject(false);
        }
      })
      .on("error", (error: any) => {
        reject(false);
      });
  });
}
