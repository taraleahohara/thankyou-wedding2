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
    imageUrl: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767394827/AP1-6.jpg",
    link: "/wedding",
    date: "2025-04-10"
  },
  {
    id: "honeymoon",
    title: "honeymoon",
    description: "Our trip to Italy.",
    imageUrl: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633166/IMG_3449_azh1fc.jpg",
    link: "/honeymoon",
    date: "2025-08-12"
  },
  {
    id: "pets",
    title: "pets",
    description: "Our furry family members.",
    imageUrl: getImageUrl("/images/before/AMY_8989_phoebe.jpg"),
    link: "#",
    date: "ongoing"
  }
];

