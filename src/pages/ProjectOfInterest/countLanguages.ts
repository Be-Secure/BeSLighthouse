import { fetchOsspoiMaterData } from "../ShowVulnerabilityDetails";

export async function countLanguages(
  setData: React.Dispatch<React.SetStateAction<never[]>>,
  setTecStack: React.Dispatch<React.SetStateAction<any[]>>,
  setProject: React.Dispatch<React.SetStateAction<never[]>>,
  cache: any
) {
  const supportedLanguages: any = {
    python: true,
    java: true,
    javascript: true,
    c: true,
    "c++": true,
    php: true
  };
  const tecStackForChart: any = [];
  const osspoi = await fetchOsspoiMaterData();
  const languageCount: any = {};
  const besTecStack: any = {};
  for (let i = 0; i < osspoi.items.length; i++) {
    if (!besTecStack[osspoi.items[i].bes_technology_stack]) {
      besTecStack[osspoi.items[i].bes_technology_stack] = 0;
    }
    besTecStack[osspoi.items[i].bes_technology_stack]++;
    for (const language of Object.keys(osspoi.items[i].language)) {
      const lan: string = language.toLocaleLowerCase().trim();
      if (supportedLanguages[lan]) {
        if (!languageCount[lan]) {
          languageCount[lan] = 1;
          continue;
        }
        languageCount[lan]++;
      }
    }
  }
  for (const tecStack of Object.keys(besTecStack)) {
    tecStackForChart.push({ label: tecStack, value: besTecStack[tecStack] });
  }
  for (const language of Object.keys(languageCount)) {
    cache.push({ label: language, value: languageCount[language] });
  }
  setProject(osspoi);
  setTecStack(tecStackForChart);
  setData(cache);
}
