import http from "http";

export async function fetchJsonReport(url: string): Promise<any> {
  const parsedUrl = new URL(url);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    headers: {
      'PRIVATE-TOKEN': 'glft-wDrJdxZ3PXTde7k9Y92t'
    }
  };

  return await new Promise((resolve, reject) => {
    http.get(options, (response: any) => {
      // eslint-disable-next-line no-debugger
      debugger;
      let data = "";

      response.on("data", (chunk: any) => {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
    http
      .get(bturl, (response: any) => {
        const code = response.statusCode;
        if (code === 200) {
          resolve(true);
        }
      })
      .on("error", (error: any) => {
        http
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
