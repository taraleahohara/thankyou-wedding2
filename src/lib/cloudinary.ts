import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary instance
// Make sure to set these environment variables in your .env file
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  },
});

/**
 * Generate a Cloudinary URL for an image
 * @param publicId - The public ID of the image in Cloudinary (e.g., "wedding-photos/before/AMY_9092_gettingready")
 * @param transformations - Optional Cloudinary transformations object
 * @returns The full Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: string;
    gravity?: string;
  }
): string {
  let image = cloudinary.image(publicId);

  if (transformations) {
    if (transformations.width || transformations.height) {
      image = image.resize({
        width: transformations.width,
        height: transformations.height,
        crop: (transformations.crop as any) || 'limit',
        gravity: (transformations.gravity as any) || 'auto',
      });
    }

    if (transformations.quality) {
      image = image.quality(transformations.quality);
    }

    if (transformations.format) {
      image = image.format(transformations.format as any);
    }
  }

  return image.toURL();
}

/**
 * Helper function to convert local image paths to Cloudinary public IDs
 * This assumes your Cloudinary folder structure matches your local structure
 * 
 * Example: "/images/before/AMY_9092_gettingready.jpg" 
 * becomes: "wedding-photos/before/AMY_9092_gettingready"
 */
export function localPathToCloudinaryId(localPath: string, baseFolder: string = 'wedding-photos'): string {
  // Remove leading slash and "images/" prefix
  let publicId = localPath.replace(/^\/images\//, '');
  
  // Remove file extension
  publicId = publicId.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');
  
  // Prepend base folder
  return `${baseFolder}/${publicId}`;
}

/**
 * Get Cloudinary URL from a local image path
 * This is a convenience function that combines localPathToCloudinaryId and getCloudinaryUrl
 */
export function getCloudinaryUrlFromLocalPath(
  localPath: string,
  baseFolder: string = 'wedding-photos',
  transformations?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'jpg' | 'png' | 'webp';
    crop?: string;
    gravity?: string;
  }
): string {
  const publicId = localPathToCloudinaryId(localPath, baseFolder);
  return getCloudinaryUrl(publicId, transformations);
}

export default cloudinary;

