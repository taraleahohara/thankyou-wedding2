import React, { useCallback, useState } from 'react';
import { getLqipUrl, isCloudinaryUrl, optimizeCloudinaryUrl } from '@/lib/cloudinary';

// Responsive widths offered to the browser. Capped at 1600 because the
// gallery sources max out at 1600px (c_limit also prevents upscaling).
const SRCSET_WIDTHS = [640, 750, 828, 1080, 1200, 1600];

// Respect prefers-reduced-motion: skip the animated blur-up transition
// (the LQIP -> sharp swap itself still happens, just without animation).
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
 * (f_auto/q_auto/c_limit srcSet) with an LQIP blur-up: a tiny blurred
 * placeholder is shown as the img background while the full image loads,
 * then the sharp image blurs in over ~300ms.
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
  fetchpriority,
  style,
  onLoad,
  ...otherProps
}) => {
  const isCloudinary = isCloudinaryUrl(src);

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
        style={style}
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

  // LQIP blur-up: the tiny placeholder is painted as the img element's
  // background (visible through the transparent content area while the
  // real image loads). Once loaded, the sharp image transitions from
  // blurred to sharp. No wrapper element, so layout is unchanged.
  const lqipStyle: React.CSSProperties = {
    ...(loaded
      ? {}
      : {
          backgroundImage: `url(${getLqipUrl(src)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
    filter: loaded ? 'none' : 'blur(12px)',
    ...(prefersReducedMotion() ? {} : { transition: 'filter 300ms ease-out' }),
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
      style={lqipStyle}
      onLoad={handleLoad}
      {...fetchPriorityAttr}
      {...otherProps}
    />
  );
};

export default CloudinaryImage;
