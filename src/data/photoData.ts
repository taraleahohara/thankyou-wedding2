import { getCloudinaryUrlFromLocalPath } from '@/lib/cloudinary';
import { weddingPhotos as allWeddingPhotos } from './weddingPhotos';

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

// Get all images tagged "before-ceremony" from Cloudinary
const beforeCeremonyPhotos = (allWeddingPhotos || [])
  .filter(photo => photo && photo.tags && Array.isArray(photo.tags) && photo.tags.includes('before-ceremony'))
  .map((photo, index) => ({
    id: `before-${index + 1}`,
    url: photo.url,
    downloadUrl: photo.url, // Use Cloudinary URL as download URL
    alt: `Before the ceremony ${index + 1}`
  }));

// Debug: Log to verify photos are loaded
if (typeof window !== 'undefined') {
  console.log('Total photos from Cloudinary:', allWeddingPhotos?.length || 0);
  console.log('Before ceremony photos count:', beforeCeremonyPhotos.length);
  if (beforeCeremonyPhotos.length > 0) {
    console.log('Sample before ceremony photo:', beforeCeremonyPhotos[0]);
  } else {
    console.warn('No before-ceremony photos found! Check tags in Cloudinary.');
  }
}

// Common wedding photos (same for all guests)
export const weddingPhotos = {
  beforeCeremony: beforeCeremonyPhotos,
  ceremony: [
    {
      id: "ceremony-1",
      url: getImageUrl("/images/during/AMY_9830_walkingdownaisle.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony1",
      alt: "Walking down the aisle"
    },
    {
      id: "ceremony-2",
      url: getImageUrl("/images/during/AMY_9840_walkingdownaisle.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony2",
      alt: "Walking down the aisle"
    },
    {
      id: "ceremony-3",
      url: getImageUrl("/images/during/AMY_9861_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony3",
      alt: "Ceremony"
    },
    {
      id: "ceremony-4",
      url: getImageUrl("/images/during/AMY_6194_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony4",
      alt: "Ceremony"
    },
    {
      id: "ceremony-5",
      url: getImageUrl("/images/during/AMY_6215-2_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony5",
      alt: "Ceremony"
    },
    {
      id: "ceremony-6",
      url: getImageUrl("/images/during/AMY_9889_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony6",
      alt: "Ceremony"
    },
    {
      id: "ceremony-7",
      url: getImageUrl("/images/during/AMY_9963_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony7",
      alt: "Ceremony"
    },
    {
      id: "ceremony-8",
      url: getImageUrl("/images/during/AMY_6268-2_ceremony.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony8",
      alt: "Ceremony"
    },
    {
      id: "ceremony-9",
      url: getImageUrl("/images/during/AMY_0090_recessional.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony9",
      alt: "Recessional"
    },
    {
      id: "ceremony-10",
      url: getImageUrl("/images/during/AMY_0134_licensesigningjpg.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony10",
      alt: "License signing"
    },
    {
      id: "ceremony-11",
      url: getImageUrl("/images/during/AMY_0138_afterceremonyjpg.jpg"),
      downloadUrl: "https://photos.google.com/share/ceremony11",
      alt: "After ceremony"
    },
  ],
  reception: [
    {
      id: "reception-1",
      url: getImageUrl("/images/after/AMY_0196_reception1.jpg"),
      downloadUrl: "https://photos.google.com/share/reception1",
      alt: "Reception arrival"
    },
    {
      id: "reception-2",
      url: getImageUrl("/images/after/AMY_0613_reception2.jpg"),
      downloadUrl: "https://photos.google.com/share/reception2",
      alt: "Reception speeches"
    },
    {
      id: "reception-3",
      url: getImageUrl("/images/after/AMY_0752_reception3.jpg"),
      downloadUrl: "https://photos.google.com/share/reception3",
      alt: "Reception toast"
    },
    {
      id: "reception-4",
      url: getImageUrl("/images/after/AMY_6582_reception4.jpg"),
      downloadUrl: "https://photos.google.com/share/reception4",
      alt: "Reception dancing"
    },
    {
      id: "reception-5",
      url: getImageUrl("/images/after/AMY_6603_reception5.jpg"),
      downloadUrl: "https://photos.google.com/share/reception5",
      alt: "Late-night celebration"
    },
  ]
};

export const fullAlbumUrl = "https://photos.google.com/share/your-wedding-album";

