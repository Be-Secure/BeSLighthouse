export const filterModelData = (data: any[], modelName: string) => {
  return data.filter((item: any) => item.name === modelName.slice(1));
};

export const loadData = (dataStore: any, setData: React.Dispatch<React.SetStateAction<any[]>>, verifyLink: Function) => {
  verifyLink(dataStore, setData);
};
