// This file contains guest-specific data
// In production, this would come from a database or CMS

export interface GuestData {
  id: string;
  name: string;
  message: string;
  personalPhotos: Array<{
    id: string;
    url: string;
    downloadUrl: string;
    alt: string;
  }>;
}

// Sample guest data
export const guestDatabase: Record<string, GuestData> = {
  "default": {
    id: "default",
    name: "Friend",
    message: "Thank you so much for celebrating with us on our special day. Your presence made our wedding truly memorable, and we're so grateful to have you in our lives. We hope you enjoy these photos from our beautiful celebration!",
    personalPhotos: [
      {
        id: "personal-1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552",
        downloadUrl: "https://photos.google.com/share/example1",
        alt: "Guest enjoying the ceremony"
      },
      {
        id: "personal-2",
        url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
        downloadUrl: "https://photos.google.com/share/example2",
        alt: "Guest at the reception"
      },
    ]
  },
  "cindy-ward": {
    id: "cindy-ward",
    name: "Cindy & Ward",
    message: "Dear Cindy and Ward, having you both there meant everything to us. Your love and support over the years has been invaluable, and sharing this day with you made it even more special. Thank you for all the wonderful memories!",
    personalPhotos: [
      {
        id: "cw-1",
        url: "https://images.unsplash.com/photo-1606800052052-a08af7148866",
        downloadUrl: "https://photos.google.com/share/cw1",
        alt: "Cindy and Ward at the ceremony"
      },
      {
        id: "cw-2",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
        downloadUrl: "https://photos.google.com/share/cw2",
        alt: "Dancing at the reception"
      },
    ]
  },
  "pdmfam": {
    id: "pdmfam",
    name: "PdM Fam",
    message: "Thank you so much for all the beautiful/funny/cute wishes for our wedding. The support and care you showered us with will never be forgotten. Please accept this Loveable accelerated vibecoded site and photos as a token of our appreciation.",
    personalPhotos: []
  }
};