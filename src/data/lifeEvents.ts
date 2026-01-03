import { getCloudinaryUrlFromLocalPath } from '@/lib/cloudinary';

// Helper function to get image URL (Cloudinary if configured, otherwise local)
function getImageUrl(localPath: string): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  
  // If Cloudinary is configured, use it; otherwise use local path
  if (cloudName) {
    return getCloudinaryUrlFromLocalPath(localPath, 'wedding-photos', {
      quality: 'auto',
      format: 'auto',
    });
  }
  
  // Fallback to local images
  return localPath;
}

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
    imageUrl: getImageUrl("/images/during/AMY_6194_ceremony.jpg"),
    link: "/wedding",
    date: "2025-04-10"
  },
  {
    id: "engagement",
    title: "She said Yes!",
    description: "Photos from our engagement.",
    imageUrl: getImageUrl("/images/before/AMY_9092_gettingready.jpg"),
    link: "#",
    date: "2023-08-20"
  },
  {
    id: "honeymoon",
    title: "Honeymoon",
    description: "Our trip to Italy.",
    imageUrl: getImageUrl("/images/after/AMY_0196_reception1.jpg"),
    link: "#",
    date: "2024-07-01"
  },
  {
    id: "pets",
    title: "pets",
    description: "Our furry family members.",
    imageUrl: getImageUrl("/images/before/AMY_8989_phoebe.jpg"),
    link: "#",
    date: "ongoing"
  },
  {
    id: "travel",
    title: "Travel",
    description: "Our adventures around the world.",
    imageUrl: getImageUrl("/images/after/AMY_6582_reception4.jpg"),
    link: "#",
    date: "2024-09-15"
  }
];

