import { useState, useMemo, useEffect } from "react";
import { Download, Eye } from "lucide-react";
import PhotoLightbox from "./PhotoLightbox";
import { weddingPhotos as allCloudinaryPhotos } from "@/data/weddingPhotos";

interface Photo {
  id: string;
  url: string;
  downloadUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

// URL transformation functions removed - using original Cloudinary URLs directly
// The weddingPhotos.ts file needs to be regenerated with correct URLs from Cloudinary

interface TaggedPhotoGalleryProps {
  title: string;
  tag: string;
  categoryIndex: number;
  altPrefix?: string; // Optional prefix for alt text (defaults to title)
  id?: string; // Optional ID for section navigation
}

// Utility to construct a Cloudinary download URL with fl_attachment flag
// This forces the browser to download the file instead of opening it
// URL structure: .../upload/{version}/{public_id}.{format}
// Result: .../upload/fl_attachment/{version}/{public_id}.{format}
const getDownloadUrl = (imageUrl: string): string => {
  // Return as-is if not a Cloudinary URL
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }
  
  // Check if fl_attachment is already present
  if (imageUrl.includes('fl_attachment')) {
    return imageUrl;
  }
  
  // Find the position after /upload/
  const uploadIndex = imageUrl.indexOf('/upload/');
  if (uploadIndex === -1) {
    return imageUrl; // Not a valid Cloudinary URL structure
  }
  
  // Insert fl_attachment right after /upload/
  // Example: .../upload/v1767374391/BC1-1.jpg -> .../upload/fl_attachment/v1767374391/BC1-1.jpg
  const beforeUpload = imageUrl.substring(0, uploadIndex + '/upload/'.length);
  const afterUpload = imageUrl.substring(uploadIndex + '/upload/'.length);
  
  return `${beforeUpload}fl_attachment/${afterUpload}`;
};

// Utility to distribute photos into columns using "Shortest Column First" algorithm
// This minimizes gaps at the bottom by placing each photo in the column with the least current height
const distributePhotosIntoColumns = (photos: Photo[], columnCount: number): Photo[][] => {
  // Initialize columns array
  const columns: Photo[][] = Array.from({ length: columnCount }, () => []);
  
  // Track the current height of each column
  // Heights are relative based on aspect ratio (assuming all images have same width in column)
  const columnHeights: number[] = Array.from({ length: columnCount }, () => 0);
  
  // Standard column width (relative unit for height calculation)
  // Since images use w-full, they'll all be same width, so we can use aspect ratio
  const standardWidth = 1; // Relative unit
  
  photos.forEach((photo) => {
    // Calculate the aspect ratio height for this photo
    // If width/height not available, use default aspect ratio of 4:3
    let aspectRatioHeight: number;
    
    if (photo.width && photo.height && photo.width > 0 && photo.height > 0) {
      // Calculate height based on aspect ratio (height = width / aspect_ratio)
      // Since all images have same width in column, height is proportional to aspect ratio
      aspectRatioHeight = (photo.height / photo.width) * standardWidth;
    } else {
      // Default to 4:3 aspect ratio if dimensions not available
      aspectRatioHeight = (3 / 4) * standardWidth;
    }
    
    // Find the column with the minimum current height
    let shortestColumnIndex = 0;
    let minHeight = columnHeights[0];
    
    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < minHeight) {
        minHeight = columnHeights[i];
        shortestColumnIndex = i;
      }
    }
    
    // Add the photo to the shortest column
    columns[shortestColumnIndex].push(photo);
    
    // Update the column's total height (add photo height + gap)
    // Assuming gap-4 (1rem = 16px) between items, convert to relative units
    const gapHeight = 0.25; // Relative gap height (approximate)
    columnHeights[shortestColumnIndex] += aspectRatioHeight + gapHeight;
  });
  
  return columns;
};

const TaggedPhotoGallery = ({ 
  title, 
  tag, 
  categoryIndex,
  altPrefix,
  id 
}: TaggedPhotoGalleryProps) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Filter and map photos from Cloudinary based on the tag
  const photos = useMemo(() => {
    const filtered = (allCloudinaryPhotos || [])
      .filter(photo => 
        photo && 
        photo.tags && 
        Array.isArray(photo.tags) && 
        photo.tags.includes(tag)
      )
      .map((photo, index) => {
        // Use original Cloudinary URL directly - ensure it's a valid URL
        let imageUrl = photo.url;
        
        // Validate URL format
        if (!imageUrl || !imageUrl.startsWith('http')) {
          console.error('Invalid photo URL:', photo);
          imageUrl = ''; // Will trigger error handling
        }
        
        // Debug: Log URLs for first few photos
        if (index < 3) {
          console.log(`Photo ${index + 1} URL:`, imageUrl);
          console.log(`Photo ${index + 1} data:`, {
            id: photo.id,
            url: photo.url,
            tags: photo.tags,
            width: photo.width,
            height: photo.height
          });
        }
        
        return {
          id: `${tag}-${index + 1}`,
          url: imageUrl, // Original Cloudinary URL
          srcSet: '', // Disable srcset for now
          downloadUrl: photo.url, // Full resolution for download
          alt: altPrefix 
            ? `${altPrefix} ${index + 1}` 
            : `${title} ${index + 1}`,
          width: photo.width,
          height: photo.height
        };
      })
      // Filter out photos with invalid URLs to prevent holes in the grid
      .filter(photo => photo.url && photo.url.trim() !== '');

    // Debug logging - v4 with regenerated URLs
    console.log(`🎯 TaggedPhotoGallery v4 "${title}" (tag: "${tag}"):`, {
      totalCloudinaryPhotos: allCloudinaryPhotos?.length || 0,
      filteredCount: filtered.length,
      samplePhoto: filtered[0],
      firstPhotoUrl: filtered[0]?.url,
      timestamp: new Date().toISOString()
    });

    return filtered;
  }, [tag, title, altPrefix]);

  // Filter out failed images from the display
  const validPhotos = photos.filter(photo => !failedImages.has(photo.id));

  // Hook to determine column count based on screen size
  const [columnCount, setColumnCount] = useState(1);
  
  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColumnCount(3); // lg: 3 columns
      } else if (width >= 768) {
        setColumnCount(2); // md: 2 columns
      } else {
        setColumnCount(1); // mobile: 1 column
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  // Distribute photos into columns
  const photoColumns = useMemo(() => {
    return distributePhotosIntoColumns(validPhotos, columnCount);
  }, [validPhotos, columnCount]);

  if (!validPhotos || validPhotos.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl text-center mb-12 text-wedding-olive">
            {title}
          </h3>
          <p className="text-center text-muted-foreground">No photos available</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id={id} className="py-16 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl text-center mb-12 text-wedding-olive">
            {title}
          </h3>
          {/* Masonry layout: flex container with columns */}
          <div className="flex gap-4">
            {photoColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex-1 flex flex-col gap-4">
                {column.map((photo, photoIndex) => {
                  // Calculate the original index in validPhotos for lightbox navigation
                  const originalIndex = validPhotos.findIndex(p => p.id === photo.id);
                  return (
                    <div
                      key={photo.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredPhoto(photo.id)}
                      onMouseLeave={() => setHoveredPhoto(null)}
                    >
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt={photo.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-auto rounded-lg object-contain shadow-md transition-all duration-300 group-hover:shadow-xl"
                          width={photo.width}
                          height={photo.height}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', {
                              url: photo.url,
                              alt: photo.alt,
                              id: photo.id,
                              error: e
                            });
                            // Try to reload with download URL first
                            if (e.currentTarget.src !== photo.downloadUrl) {
                              console.log('Retrying with download URL:', photo.downloadUrl);
                              e.currentTarget.src = photo.downloadUrl;
                            } else {
                              // If download URL also fails, remove from grid
                              setFailedImages(prev => new Set(prev).add(photo.id));
                            }
                          }}
                          onLoad={() => {
                            if (photoIndex < 3) {
                              console.log('✅ Image loaded successfully:', photo.url);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
                          Invalid image URL
                        </div>
                      )}
                      {hoveredPhoto === photo.id && (
                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-2 sm:gap-4 transition-opacity duration-300 z-10">
                          <button
                            onClick={() => setSelectedPhotoIndex(originalIndex)}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-wedding-rust text-white rounded-lg hover:bg-wedding-rust/90 transition-colors text-sm sm:text-base"
                            aria-label={`View enlarged ${photo.alt}`}
                          >
                            <Eye size={18} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          <a
                            href={getDownloadUrl(photo.downloadUrl)}
                            download
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-wedding-olive text-white rounded-lg hover:bg-wedding-olive/90 transition-colors text-sm sm:text-base"
                            aria-label={`Download ${photo.alt}`}
                          >
                            <Download size={18} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Download</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          photos={validPhotos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
};

export default TaggedPhotoGallery;

