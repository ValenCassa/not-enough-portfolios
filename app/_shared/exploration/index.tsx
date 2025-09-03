import { ExplorationItem } from "./exploration-item";

const explorationItems = [
  {
    title: "Ciro",
    description: "Turn the internet into clips",
    images: [
      "/projects/ciro-1.webp",
      "/projects/ciro-2.webp",
      "/projects/ciro-3.webp",
      "/projects/ciro-4.webp",
      "/projects/ciro-5.webp",
      "/projects/ciro-6.webp",
      "/projects/ciro-7.webp",
      "/projects/ciro-8.webp",
    ],
  },
  {
    title: "Highway",
    description: "AI-native marketing intelligence",
    images: [
      "/projects/highway-1.webp",
      "/projects/highway-2.webp",
      "/projects/highway-3.webp",
      "/projects/highway-4.webp",
      "/projects/highway-5.webp",
      "/projects/highway-6.webp",
    ],
  },
  {
    title: "OpenCut",
    description: "The open-source video editor",
    images: ["/projects/opencut-1.webp"],
  },
  {
    title: "Yakoa",
    description: "IP protection for the blockchain",
    images: [
      "/projects/yakoa-1.webp",
      "/projects/yakoa-2.webp",
      "/projects/yakoa-4.webp",
      "/projects/yakoa-5.webp",
      "/projects/yakoa-6.webp",
      "/projects/yakoa-8.webp",
      "/projects/yakoa-9.webp",
    ],
  },
];

export const Exploration = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-sm font-medium text-stone-700">~/ exploration</h2>
      {explorationItems.map((item) => (
        <ExplorationItem key={item.title} {...item} />
      ))}
    </section>
  );
};
