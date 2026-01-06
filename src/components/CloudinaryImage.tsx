import React from 'react';

/**
 * Optimizes a Cloudinary URL by injecting transformation parameters
 * @param url - The Cloudinary URL
 * @param width - The desired width for the image
 * @returns The optimized URL with f_auto,q_auto,w_{width} transformations
 */
function optimizeCloudinaryUrl(url: string, width: number): string {
  // Return as-is if not a Cloudinary URL
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Find the position after /upload/
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url; // Not a valid Cloudinary URL structure
  }

  // Check if transformations already exist (look for common transformation patterns)
  const afterUpload = url.substring(uploadIndex + '/upload/'.length);
  // If it starts with a transformation (like f_auto, w_, c_, etc.), we might need to handle it differently
  // For now, we'll inject our transformations before any existing version or path
  // Cloudinary format: /upload/{transformations}/{version}/{public_id}
  
  // Check if there's already a version (starts with 'v' followed by numbers)
  const versionMatch = afterUpload.match(/^v\d+/);
  
  if (versionMatch) {
    // Insert transformations before version
    const beforeVersion = url.substring(0, uploadIndex + '/upload/'.length);
    const afterVersion = url.substring(uploadIndex + '/upload/'.length + versionMatch[0].length);
    return `${beforeVersion}f_auto,q_auto,w_${width}/${versionMatch[0]}${afterVersion}`;
  } else {
    // No version found, insert transformations directly after /upload/
    const beforeUpload = url.substring(0, uploadIndex + '/upload/'.length);
    const afterUpload = url.substring(uploadIndex + '/upload/'.length);
    return `${beforeUpload}f_auto,q_auto,w_${width}/${afterUpload}`;
  }
}

interface CloudinaryImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  width?: number; // Fallback width for src (defaults to 1000)
}

/**
 * CloudinaryImage component that automatically optimizes Cloudinary URLs
 * with responsive images using srcSet and Cloudinary transformation parameters
 */
const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  className,
  sizes,
  loading = 'lazy',
  width = 1000,
  ...otherProps
}) => {
  // Check if this is a Cloudinary URL
  const isCloudinaryUrl = src && src.includes('res.cloudinary.com');

  if (!isCloudinaryUrl) {
    // For non-Cloudinary URLs, render a regular img tag
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        {...otherProps}
      />
    );
  }

  // Generate srcSet with multiple widths
  const widths = [640, 750, 828, 1080, 1200, 1920, 2048];
  const srcSet = widths
    .map((w) => {
      const optimizedUrl = optimizeCloudinaryUrl(src, w);
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');

  // Generate default src with fallback width
  const defaultSrc = optimizeCloudinaryUrl(src, width);

  return (
    <img
      src={defaultSrc}
      srcSet={srcSet}
      alt={alt}
      className={className}
      sizes={sizes}
      loading={loading}
      decoding="async"
      {...otherProps}
    />
  );
};

export default CloudinaryImage;

