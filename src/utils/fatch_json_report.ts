import https from "https";

export function fetchJsonReport(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
}
