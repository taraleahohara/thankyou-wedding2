import type { ReactNode } from "react";
import { getImageUrl } from "@/lib/cloudinary";
import weddingHeaderImage from "@/assets/headerimage.jpg";

/**
 * Master bypass code: typing this into any gate field opens the gallery
 * without the real password. A convenience skeleton key (for the times a
 * password is forgotten) — these gates are a curtain, not a lock, so this
 * weakens no real security.
 */
export const MASTER_CODE = "8272";

/** One gallery section within a chapter page. */
export interface GallerySectionConfig {
  /** DOM id for section navigation */
  id: string;
  title: string;
  /** Cloudinary tag the section filters photos by */
  tag: string;
  description?: ReactNode;
  allowDownload?: boolean;
  showCaption?: boolean;
}

/** Auth configuration for a protected chapter. */
export type ChapterAuth =
  | {
      /** Guest-name + shared password, with a `?guest=<tag>` magic link */
      mode: "guest-name";
      password: string;
      magicLinkParam: string;
    }
  | {
      /** Shared password only, with a `?<param>=<value>` magic link */
      mode: "password";
      password: string;
      magicLinkParam: string;
      magicLinkValue: string;
    };

export interface Chapter {
  id: string;
  /** Route path ("#" for chapters without a page yet) */
  path: string;
  /** Card / display title (lowercase, matches homepage cards) */
  title: string;
  /** "YYYY-MM-DD" or "ongoing" */
  date: string;
  /** Homepage / related-galleries card data */
  card: {
    description: string;
    image: string;
  };
  /** Image used by RelatedGalleries cards (falls back to card.image) */
  relatedCardImage?: string;
  /** Base document.title for the chapter page */
  pageTitle?: string;
  /** Hero banner content */
  hero?: {
    image: string;
    title: string;
    subtitle: string;
  };
  /** Intro text rendered by SiteDescription */
  siteDescription?: string;
  /** Client-side og:image / twitter:image URL */
  ogImage?: string;
  /** Theme key applied as data-chapter on the page root */
  theme?: "wedding" | "honeymoon";
  /** Homestead spine colour (HSL channels) — the chapter's book-spine hue,
   *  worn on homepage/related cards as the label rule + hover border.
   *  Wedding keeps its own rust; pets (the living chapter) wears house olive. */
  spine?: string;
  auth?: ChapterAuth;
  /** Auth-bypass link used by RelatedGalleries (falls back to path) */
  magicLink?: string;
  /** Gallery sections rendered in order */
  sections?: GallerySectionConfig[];
  /** Chapters to cross-link at the bottom of the page */
  relatedChapterIds?: string[];
}

export const chapters: Chapter[] = [
  {
    id: "wedding",
    path: "/wedding",
    title: "wedding",
    date: "2025-10-04",
    card: {
      description: "The best day of our lives.",
      image: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767394827/AP1-6.jpg",
    },
    pageTitle: "Tara & Daniel's Wedding",
    hero: {
      image: weddingHeaderImage,
      title: "Tara & Daniel",
      subtitle: "October 4th, 2025",
    },
    siteDescription:
      "Tara built this website and personalized it just for you (her talents go far beyond spreadsheets!). Below you'll find our favourite moments from the day, including a few that feature you. We made it to share a little of our joy with the guests who made the day unforgettable.",
    ogImage: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767394827/AP1-6.jpg",
    theme: "wedding",
    spine: "17 70% 42%",
    auth: {
      mode: "guest-name",
      password: "taradan#1004",
      magicLinkParam: "guest",
    },
    magicLink: "/wedding?guest=wedding-highlights",
    sections: [
      { id: "before-ceremony", title: "before the ceremony", tag: "before-ceremony" },
      { id: "ceremony", title: "the ceremony", tag: "ceremony" },
      { id: "brunch", title: "brunch", tag: "brunch" },
      { id: "after-party", title: "after party", tag: "after-party" },
    ],
    relatedChapterIds: ["honeymoon"],
  },
  {
    id: "honeymoon",
    path: "/honeymoon",
    title: "honeymoon",
    date: "2025-08-12",
    card: {
      description: "Our honeymoon in Sri Lanka.",
      image: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633166/IMG_3449_azh1fc.jpg",
    },
    relatedCardImage: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633211/IMG_3498_bsco2c.jpg",
    pageTitle: "Tara & Daniel's Honeymoon",
    hero: {
      image: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633211/IMG_3498_bsco2c.jpg",
      title: "Tara & Daniel",
      subtitle: "Our Honeymoon",
    },
    siteDescription:
      "Our honeymoon took us through Sri Lanka, a journey shaped by history, nature, wildlife, and moments of quiet rest. We moved slowly through ancient cities, misty mountains, and sunlit coastlines, letting each place set its own rhythm. These photos capture the places we explored, the spaces we stayed, and the feeling of beginning this next chapter together.",
    ogImage: "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633211/IMG_3498_bsco2c.jpg",
    theme: "honeymoon",
    spine: "14 57% 51%",
    auth: {
      mode: "password",
      password: "taradan#0530",
      magicLinkParam: "access",
      magicLinkValue: "honeymoon",
    },
    magicLink: "/honeymoon?access=honeymoon",
    sections: [
      {
        id: "cultural-triangle",
        title: "the cultural triangle",
        tag: "culture",
        description: (
          <>
            <strong>Sri Lanka's Cultural Triangle</strong> sits at the center of the island and is its historic and spiritual heart, shaped by ancient kings, monks, and remarkable engineering. Centuries-old cities, temples, reservoirs, and rock fortresses still define the landscape today. We explored the ruined capital of <strong>Polonnaruwa</strong>, climbed <strong>Sigiriya Lion Rock Fortress</strong>, wandered the cave shrines of <strong>Dambulla Cave Temple</strong>, and finished in <strong>Kandy</strong> at the <strong>Temple of the Sacred Tooth</strong>.
          </>
        ),
        allowDownload: false,
        showCaption: true,
      },
      {
        id: "mountains-nature",
        title: "mountains & nature",
        tag: "nature",
        description: (
          <>
            The mountains and wild south were a striking contrast to the ancient cities, with cooler air, lush hills, and some of the island's richest wildlife. We slowed down in the tea country around <strong>Ella</strong>, wandering past waterfalls and the Nine Arch Bridge, then headed south to meet the elephants at the Elephant Transit Home and on safari in <strong>Udawalawe National Park</strong>. We visited the quiet stone carvings of Buduruwagala Temple and finished deep in the rainforest, birding in <strong>Sinharaja</strong>.
          </>
        ),
        allowDownload: false,
        showCaption: true,
      },
      {
        id: "southern-coast",
        title: "southern coast",
        tag: "beach",
        description: (
          <>
            Our journey ended gently along the southern coast, a brief pause for rest and reflection. We spent slow days on the sand at <strong>Mirissa Beach</strong> and <strong>Ahangama</strong>, and wandered the historic streets of <strong>Galle Fort</strong>.
          </>
        ),
        allowDownload: false,
        showCaption: true,
      },
      {
        id: "hotels",
        title: "our hotels",
        tag: "hotels",
        description: (
          <>
            A huge part of the honeymoon was the places we stayed. We treated ourselves to hotels that felt calm, beautiful, and connected to their surroundings, from the architecture of <strong>Heritance Kandalama</strong> to the cozy <strong>Tea Cabins</strong>, the rainforest retreat of <strong>Sinharaja Kurulu Ella Eco Resort</strong>, and indulgent coastal stays at <strong>Malabar Hill</strong> and <strong>The Find</strong>. They were as much a part of the trip as the places we explored, and a big reason it felt so special.
          </>
        ),
        allowDownload: false,
        showCaption: true,
      },
    ],
  },
  {
    id: "pets",
    path: "#",
    title: "pets",
    date: "ongoing",
    spine: "74 36% 31%",
    card: {
      description: "Our furry family members.",
      image: getImageUrl("/images/before/AMY_8989_phoebe.jpg"),
    },
  },
];

export function getChapter(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}
