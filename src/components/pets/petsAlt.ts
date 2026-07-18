import type { PetPhoto } from "@/hooks/usePetsPhotos";

/** Alt text for a collection photo, from its creature tags. */
export function petPhotoAlt(photo: PetPhoto, index: number): string {
  const tags = photo.tags || [];
  const hasPhoebe = tags.includes("phoebe");
  const hasPenny = tags.includes("penny");
  const who =
    hasPhoebe && hasPenny ? "Phoebe and Penny" : hasPhoebe ? "Phoebe" : hasPenny ? "Penny" : "The creatures";
  return `${who} — collection photo ${index + 1}`;
}
