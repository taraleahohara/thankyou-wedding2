# Cloudinary Setup Guide

This guide will help you replace local images with images from your Cloudinary account.

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in or create a free account
3. Copy your **Cloud Name** from the dashboard (it's displayed prominently)

## Step 2: Configure Environment Variables

1. Create a `.env` file in the root of your project (copy from `.env.example` if needed)
2. Add your Cloudinary cloud name:

```env
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
```

**Important:** Replace `your-cloud-name-here` with your actual Cloudinary cloud name.

## Step 3: Upload Images to Cloudinary

You need to upload your images to Cloudinary with a folder structure that matches your local structure.

### Option A: Using Cloudinary Dashboard (Web Interface)

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Create folders to match your structure:
   - `wedding-photos/before/`
   - `wedding-photos/during/`
   - `wedding-photos/after/`
   - `wedding-photos/homepage/`
3. Upload images to the corresponding folders
4. **Important:** Use the same filenames (without extension) as your local images
   - Example: `AMY_9092_gettingready.jpg` → Upload as `AMY_9092_gettingready` in `wedding-photos/before/`

### Option B: Using Cloudinary CLI (Faster for many images)

1. Install Cloudinary CLI:
   ```bash
   npm install -g @cloudinary/cli
   ```

2. Upload images:
   ```bash
   # Navigate to your images folder
   cd public/images
   
   # Upload all images maintaining folder structure
   cld upload-dir . wedding-photos --recursive
   ```

### Option C: Using the Cloudinary Upload Widget (For React)

If you want to allow users to upload images through your app, you can use the Cloudinary upload widget.

## Step 4: Verify Your Setup

1. Make sure your `.env` file has `VITE_CLOUDINARY_CLOUD_NAME` set
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Check your browser - images should now load from Cloudinary!

## How It Works

The code has been updated to automatically use Cloudinary when:
- `VITE_CLOUDINARY_CLOUD_NAME` is set in your `.env` file
- Images are uploaded to Cloudinary with the correct folder structure

If Cloudinary is not configured, the app will fall back to local images in the `public/images/` folder.

## Image Path Mapping

The system automatically converts local paths to Cloudinary public IDs:

| Local Path | Cloudinary Public ID |
|------------|---------------------|
| `/images/before/AMY_9092_gettingready.jpg` | `wedding-photos/before/AMY_9092_gettingready` |
| `/images/during/AMY_6194_ceremony.jpg` | `wedding-photos/during/AMY_6194_ceremony` |
| `/images/homepage/newhpheader.png` | `wedding-photos/homepage/newhpheader` |

## Customizing Image Transformations

You can customize how images are served from Cloudinary by modifying the `getImageUrl` function in:
- `src/data/photoData.ts`
- `src/data/lifeEvents.ts`
- `src/pages/Home.tsx`

Example transformations:
```typescript
getCloudinaryUrlFromLocalPath(localPath, 'wedding-photos', {
  width: 800,           // Resize to 800px width
  height: 600,          // Resize to 600px height
  quality: 'auto',      // Auto quality optimization
  format: 'auto',       // Auto format (webp when supported)
  crop: 'limit',        // Don't crop, just resize
})
```

## Troubleshooting

### Images not loading from Cloudinary?

1. **Check your .env file**: Make sure `VITE_CLOUDINARY_CLOUD_NAME` is set correctly
2. **Restart dev server**: Environment variables are loaded at startup
3. **Check Cloudinary folder structure**: Images must be in the correct folders
4. **Verify image names**: Filenames (without extension) must match exactly
5. **Check browser console**: Look for any error messages

### Still seeing local images?

- The app falls back to local images if Cloudinary isn't configured
- Check that your `.env` file is in the root directory
- Make sure the variable name is exactly `VITE_CLOUDINARY_CLOUD_NAME`

## Files Updated

The following files have been updated to support Cloudinary:
- `src/lib/cloudinary.ts` - Cloudinary utility functions (NEW)
- `src/data/photoData.ts` - Wedding photos data
- `src/data/lifeEvents.ts` - Life events data
- `src/pages/Home.tsx` - Home page header image

## Next Steps

1. Upload your images to Cloudinary
2. Set your cloud name in `.env`
3. Restart your dev server
4. Enjoy faster image loading and automatic optimization! 🎉

