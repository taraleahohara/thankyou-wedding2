/**
 * Unified Cloudinary URL pipeline.
 *
 * All transformations are done via string surgery on delivery URLs
 * (no SDK). Non-Cloudinary URLs always pass through untouched, which
 * keeps local /images/... fallbacks working when
 * VITE_CLOUDINARY_CLOUD_NAME is unset.
 */

/** True if the URL is a Cloudinary delivery URL. */
export function isCloudinaryUrl(url: string | undefined | null): boolean {
  return !!url && url.includes('res.cloudinary.com');
}

/**
 * Insert a transformation segment directly after `/upload/`, before any
 * existing version (`v123.../`) or public-id path segments.
 * Returns the URL untouched if it is not a Cloudinary upload URL.
 */
function insertTransformations(url: string, transforms: string): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const uploadMarker = '/upload/';
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) {
    return url; // Not a valid Cloudinary URL structure
  }

  const insertAt = uploadIndex + uploadMarker.length;
  return `${url.slice(0, insertAt)}${transforms}/${url.slice(insertAt)}`;
}

/**
 * Optimize a Cloudinary URL for display at a given width:
 * auto format, auto quality, and `c_limit` so Cloudinary never
 * upscales beyond the source dimensions.
 */
export function optimizeCloudinaryUrl(url: string, width: number): string {
  return insertTransformations(url, `f_auto,q_auto,c_limit,w_${width}`);
}

/**
 * Tiny blurred placeholder (LQIP) variant of a Cloudinary URL,
 * used for the blur-up effect while the full image loads.
 */
export function getLqipUrl(url: string): string {
  return insertTransformations(url, 'f_auto,q_auto:low,w_32,e_blur:200');
}

/**
 * Construct a Cloudinary download URL with the `fl_attachment` flag,
 * which forces the browser to download the file instead of opening it.
 * Example: .../upload/v1767374391/BC1-1.jpg -> .../upload/fl_attachment/v1767374391/BC1-1.jpg
 */
export function getDownloadUrl(url: string): string {
  if (!isCloudinaryUrl(url) || url.includes('fl_attachment')) {
    return url;
  }
  return insertTransformations(url, 'fl_attachment');
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  crop?: string;
  gravity?: string;
}

/**
 * Convert a local image path to a Cloudinary public ID.
 * Example: "/images/before/AMY_9092_gettingready.jpg"
 * becomes: "wedding-photos/before/AMY_9092_gettingready"
 */
export function localPathToCloudinaryId(localPath: string, baseFolder: string = 'wedding-photos'): string {
  let publicId = localPath.replace(/^\/images\//, '');
  publicId = publicId.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '');
  return `${baseFolder}/${publicId}`;
}

/** Build a comma-separated Cloudinary transformation string. */
function buildTransformString(transformations?: CloudinaryTransformOptions): string {
  if (!transformations) {
    return '';
  }

  const parts: string[] = [];

  if (transformations.format) {
    parts.push(`f_${transformations.format}`);
  }
  if (transformations.quality) {
    parts.push(`q_${transformations.quality}`);
  }
  if (transformations.width || transformations.height) {
    parts.push(`c_${transformations.crop || 'limit'}`);
    if (transformations.width) {
      parts.push(`w_${transformations.width}`);
    }
    if (transformations.height) {
      parts.push(`h_${transformations.height}`);
    }
    if (transformations.gravity) {
      parts.push(`g_${transformations.gravity}`);
    }
  }

  return parts.join(',');
}

/**
 * Build a Cloudinary delivery URL from a local image path.
 * Returns the local path untouched when VITE_CLOUDINARY_CLOUD_NAME is unset,
 * so local files in /public keep working without Cloudinary.
 */
export function getCloudinaryUrlFromLocalPath(
  localPath: string,
  baseFolder: string = 'wedding-photos',
  transformations?: CloudinaryTransformOptions
): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return localPath;
  }

  const publicId = localPathToCloudinaryId(localPath, baseFolder);
  const transformString = buildTransformString(transformations);
  const transformSegment = transformString ? `${transformString}/` : '';

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformSegment}${publicId}`;
}

/**
 * Resolve an image URL for content that may or may not live on Cloudinary:
 * Cloudinary delivery URL (f_auto,q_auto) when the cloud name is configured,
 * otherwise the local path untouched.
 */
export function getImageUrl(localPath: string): string {
  return getCloudinaryUrlFromLocalPath(localPath, 'wedding-photos', {
    quality: 'auto',
    format: 'auto',
  });
}
