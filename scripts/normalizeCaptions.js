// Normalize Cloudinary caption metadata to match the site's copy style.
//
// Applies the same transform used on src/data/honeymoonPhotos.ts (commas
// instead of " - " separators, plus a few typo/consistency fixes) directly
// to the caption context metadata stored on each Cloudinary image, so a
// future `node scripts/generateGallery.js honeymoon` regenerates the
// already-corrected captions instead of re-pulling the old ones.
//
// Usage:
//   CLOUDINARY_API_SECRET=... node scripts/normalizeCaptions.js honeymoon           (dry run — prints changes, writes nothing)
//   CLOUDINARY_API_SECRET=... node scripts/normalizeCaptions.js honeymoon --apply    (writes updates to Cloudinary)
//
// The transform is idempotent: running it again after --apply changes nothing.

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dbr3xp0bx',
  api_key: '795228952549794',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Identical to the transform applied to the generated .ts file.
function fixCaption(input) {
  let s = input;
  s = s.replace(/\s{2,}/g, ' ');                                       // collapse double spaces
  s = s.replace(/9 arches bridge/g, 'Nine Arch Bridge');              // match prose
  s = s.replace(/Mirisa Beach/g, 'Mirissa Beach');                   // typo
  s = s.replace(/fish foot thearpy/g, 'fish foot therapy');         // typo
  s = s.replace(/Fortress & it's gardens/g, 'Fortress and its gardens'); // grammar
  s = s.replace(/Temple of the Sacred tooth/g, 'Temple of the Sacred Tooth'); // proper noun
  s = s.replace(/Elephant Transit Home - They care/, 'Elephant Transit Home. They care'); // full clause -> period
  s = s.replace(/ - /g, ', ');                                        // remaining dash separators -> comma
  return s;
}

async function run(folderName, apply) {
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('Set CLOUDINARY_API_SECRET before running (same secret used by generateGallery.js).');
    process.exit(1);
  }

  console.log(`Fetching images from Cloudinary folder: ${folderName}...`);
  const result = await cloudinary.search
    .expression(`folder:${folderName}`)
    .max_results(500)
    .with_field('context')
    .execute();
  console.log(`Found ${result.total_count} images\n`);

  const pending = [];
  for (const r of result.resources) {
    const current = r.context && (r.context.caption || r.context.custom?.caption);
    if (!current) continue;
    const next = fixCaption(current);
    if (next !== current) pending.push({ publicId: r.public_id, context: r.context, current, next });
  }

  if (pending.length === 0) {
    console.log('Nothing to change — captions already normalized.');
    return;
  }

  console.log(`${pending.length} caption(s) ${apply ? 'to update' : 'that would change'}:\n`);
  for (const p of pending) {
    console.log(`- ${p.publicId}`);
    console.log(`    OLD: ${p.current}`);
    console.log(`    NEW: ${p.next}\n`);
  }

  if (!apply) {
    console.log('Dry run — nothing written. Re-run with --apply to update Cloudinary.');
    return;
  }

  let ok = 0;
  for (const p of pending) {
    // Merge so any other context keys are preserved; only caption changes.
    const merged = { ...(p.context.custom || p.context), caption: p.next };
    try {
      await cloudinary.uploader.explicit(p.publicId, { type: 'upload', resource_type: 'image', context: merged });
      ok++;
    } catch (err) {
      console.error(`  ✗ ${p.publicId}: ${err.message || err}`);
    }
  }
  console.log(`\n✅ Updated ${ok}/${pending.length} captions on Cloudinary.`);
}

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const folder = args.find((a) => !a.startsWith('--')) || 'honeymoon';
run(folder, apply);
