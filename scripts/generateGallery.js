import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dbr3xp0bx',
  api_key: '795228952549794',
  api_secret: process.env.CLOUDINARY_API_SECRET || '' // Use environment variable for security
});

async function generateGallery() {
  try {
    console.log('Fetching images from Cloudinary...');
    
    // Search for images in the Wedding folder
    const result = await cloudinary.search
      .expression('folder:Wedding')
      .max_results(500)
      .with_field('tags')
      .with_field('context')
      .execute();

    console.log(`Found ${result.total_count} images`);

    // Sort by filename/public_id A-Z
    const sortedResources = result.resources.sort((a, b) => {
      const nameA = (a.filename || a.public_id || '').toLowerCase();
      const nameB = (b.filename || b.public_id || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Format the data
    const photos = sortedResources.map((resource, index) => ({
      id: `photo-${index + 1}`,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      tags: resource.tags || []
    }));

    // Generate TypeScript content
    const tsContent = `// Auto-generated file - Do not edit manually
// Generated from Cloudinary folder: Wedding
// Run: node scripts/generateGallery.js

export const weddingPhotos = ${JSON.stringify(photos, null, 2)};
`;

    // Write to file
    const outputPath = path.join(__dirname, '../src/data/weddingPhotos.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log(`✅ Successfully generated ${photos.length} photos to ${outputPath}`);
  } catch (error) {
    console.error('Error generating gallery:', error);
    process.exit(1);
  }
}

generateGallery();

