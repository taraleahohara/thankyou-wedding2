import React, { useCallback, useState } from 'react';
import { getLqipUrl, isCloudinaryUrl, optimizeCloudinaryUrl } from '@/lib/cloudinary';

// Responsive widths offered to the browser. Capped at 1600 because the
// gallery sources max out at 1600px (c_limit also prevents upscaling).
const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1600];

interface CloudinaryImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  width?: number; // Fallback width for src (defaults to 1000)
  /** Resource loading priority hint (e.g. "high" for hero images). */
  fetchpriority?: 'high' | 'low' | 'auto';
}

/**
 * CloudinaryImage renders an optimized responsive image for Cloudinary URLs
 * (f_auto/q_auto/c_limit srcSet) with an LQIP placeholder: a tiny blurred
 * thumbnail is shown as the img background while the full image loads;
 * the real photo paints over it, always sharp, as soon as it's decoded.
 *
 * Non-Cloudinary URLs render as a plain <img> with no LQIP.
 */
const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  className,
  sizes,
  loading = 'lazy',
  width = 1000,
  height,
  fetchpriority,
  style,
  onLoad,
  ...otherProps
}) => {
  const isCloudinary = isCloudinaryUrl(src);

  // When both intrinsic dimensions are known, reserve the aspect-ratio box
  // up front. Without this, a lazy image has no height until it loads, so
  // galleries above a scroll target expand *after* an anchor jump — landing
  // you short of the section. `w-full h-auto` still drives the rendered
  // size; this only holds the space while the pixels are in flight.
  const reserveRatio =
    height != null && Number(width) > 0 && Number(height) > 0
      ? { aspectRatio: `${width} / ${height}` }
      : {};

  // Non-Cloudinary images skip LQIP entirely and start "loaded".
  const [loaded, setLoaded] = useState(!isCloudinary);

  // Reset the blur-up when src changes on a mounted instance
  // (e.g. lightbox navigation reuses the same component).
  const [prevSrc, setPrevSrc] = useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setLoaded(!isCloudinary);
  }

  // Cached images can be complete before onLoad is attached; the ref
  // callback catches that case so we never get stuck blurred.
  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const fetchPriorityAttr = fetchpriority ? { fetchpriority } : {};

  if (!isCloudinary) {
    // For non-Cloudinary URLs (including local /images fallbacks),
    // render a regular img tag untouched.
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        style={{ ...reserveRatio, ...style }}
        onLoad={onLoad}
        {...fetchPriorityAttr}
        {...otherProps}
      />
    );
  }

  // Generate srcSet with multiple widths (c_limit prevents upscaling)
  const srcSet = SRCSET_WIDTHS
    .map((w) => `${optimizeCloudinaryUrl(src, w)} ${w}w`)
    .join(', ');

  // Generate default src with fallback width
  const defaultSrc = optimizeCloudinaryUrl(src, width);

  // LQIP: the tiny placeholder (already blurred server-side via e_blur)
  // is painted as the img element's background; it shows through the
  // transparent content area while the real image loads, and the real
  // image simply paints over it the moment it's decoded. No CSS filter
  // is ever applied to the element, so the actual photo is never shown
  // blurred — a slow load reads as "placeholder", not "broken image".
  // No wrapper element, so layout is unchanged.
  const lqipStyle: React.CSSProperties = {
    ...reserveRatio,
    ...(loaded
      ? {}
      : {
          backgroundImage: `url(${getLqipUrl(src)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
    ...style,
  };

  return (
    <img
      ref={imgRef}
      src={defaultSrc}
      srcSet={srcSet}
      alt={alt}
      className={className}
      sizes={sizes}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      style={lqipStyle}
      onLoad={handleLoad}
      {...fetchPriorityAttr}
      {...otherProps}
    />
  );
};

export default CloudinaryImage;
