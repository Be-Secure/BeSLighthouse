import https from "https";

export async function fetchJsonReport(url: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          if (url.toLocaleLowerCase().endsWith(".pdf")) {
            const regex = /404: Not Found/gm;
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

export async function getEnvPathStatus(besName: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {

    const name = besName.split('-');
    const camelCaseString = name.map((part, index) => {
      return index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1);
    }).join('');

    const bturl = `https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/master/${camelCaseString}/0.0.1/besman-${camelCaseString}-BT-env.sh`;
    const rturl = `https://raw.githubusercontent.com/Be-Secure/besecure-ce-env-repo/master/${camelCaseString}/0.0.1/besman-${camelCaseString}-RT-env.sh`;
    https
      .get(bturl, (response: any) => {
        const code = response.statusCode;
        if (code === 200) {
          resolve(true);
        }
      })
      .on("error", (error: any) => {
        https
          .get(rturl, (response: any) => {
            const code = response.statusCode;
            if (code === 200) {
              resolve(true);
            }
          })
          .on("error", () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(false);
          });
        console.log("Error will getting the httpRequest", error);
      });
  });
}
