export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  date: string;
}

export const lifeEvents: LifeEvent[] = [
  {
    id: "wedding",
    title: "wedding",
    description: "The best day of our lives.",
    imageUrl: "/images/during/AMY_6194_ceremony.jpg",
    link: "/wedding",
    date: "2025-04-10"
  },
  {
    id: "engagement",
    title: "She said Yes!",
    description: "Photos from our engagement.",
    imageUrl: "/images/before/AMY_9092_gettingready.jpg",
    link: "#",
    date: "2023-08-20"
  },
  {
    id: "honeymoon",
    title: "Honeymoon",
    description: "Our trip to Italy.",
    imageUrl: "/images/after/AMY_0196_reception1.jpg",
    link: "#",
    date: "2024-07-01"
  },
  {
    id: "pets",
    title: "pets",
    description: "Our furry family members.",
    imageUrl: "/images/before/AMY_8989_phoebe.jpg",
    link: "#",
    date: "ongoing"
  },
  {
    id: "travel",
    title: "Travel",
    description: "Our adventures around the world.",
    imageUrl: "/images/after/AMY_6582_reception4.jpg",
    link: "#",
    date: "2024-09-15"
  }
];

