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
