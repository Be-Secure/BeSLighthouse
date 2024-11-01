export interface CounterCardData {
    count: number;
    title: string;
    description: string;
}

// Array of counter card data
export const counterCardsData: CounterCardData[] = [
  {
    count: 1,
    title: "Security Risk",
    description: "Understand the security risk of an OSS project before consuming the code.",
  },
  {
    count: 2,
    title: "Roadmap",
    description: "Stay aligned to a well-defined security roadmap.",
  },
  {
    count: 3,
    title: "Visibility",
    description: "Gain visibility into threat vectors and proactively manage security.",
  },
  {
    count: 4,
    title: "Patching",
    description: "Improve timely patching of OSS, driven by a defined security roadmap.",
  },
  {
    count: 5,
    title: "Risk Mitigation",
    description: "Empower developers to define risk mitigation measures for OSS components based on their security levels.",
  },
];

