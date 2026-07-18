import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getChapter } from "@/data/chapters";
import { usePetsPhotos, type PetPhoto } from "@/hooks/usePetsPhotos";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import CreatureCard, { type Creature } from "@/components/pets/CreatureCard";
import PetsGallery from "@/components/pets/PetsGallery";
import FeaturedShelf, { dealShelf } from "@/components/pets/FeaturedShelf";
import AddToCollection from "@/components/pets/AddToCollection";
import { AnnotArrow, DoodleDefs } from "@/components/pets/doodles";

const chapter = getChapter("pets")!;

/** The residents — facts recorded with a straight face. */
const CREATURES: Creature[] = [
  {
    kind: "the dog",
    name: "Phoebe",
    provenance: "tara's creature first · est. 2017",
    facts: [
      "more cat than dog, more human than pet",
      "lover of socks and underwear",
      "neurotic, emotional, velcro",
      "loves: digging holes in the sand, eating kleenex, morning belly rubs",
    ],
    portrait: {
      src: "/images/pets/phoebe-portrait.jpg",
      alt: "Phoebe, a red goldendoodle, resting her chin on the sofa",
    },
  },
  {
    kind: "the cat",
    name: "Penny",
    provenance: "dan's creature first",
    facts: [
      "highly opinionated",
      "surveyor of the surrounding outdoors",
      "queen of the balcony",
      "treats: always",
    ],
    portrait: {
      src: "/images/pets/illustrated-penny.png",
      alt: "Penny, an orange-and-white cat — illustrated portrait",
      illustrated: true,
    },
    footnote: "artist's impression — swaps for a photo the day she allows a proper sitting",
  },
];

type CreatureFilter = "all" | "phoebe" | "penny";

const FILTERS: { key: CreatureFilter; label: string }[] = [
  { key: "all", label: "all creatures" },
  { key: "phoebe", label: "phoebe" },
  { key: "penny", label: "penny" },
];

const Pets = () => {
  const { photos, loading, unavailable, appendPhotos } = usePetsPhotos();
  const [filter, setFilter] = useState<CreatureFilter>("all");

  useEffect(() => {
    document.title = chapter.pageTitle!;
  }, []);

  // Cards borrow each creature's newest photo tagged `portrait` (the photo
  // itself stays in the feed). Without one, the card keeps its built-in
  // stand-in — Penny's "artist's impression" footnote only shows then.
  const creatures = useMemo(
    () =>
      CREATURES.map((creature) => {
        const key = creature.name.toLowerCase();
        const tagged = photos.find(
          (photo) => (photo.tags || []).includes("portrait") && (photo.tags || []).includes(key),
        );
        if (!tagged) return creature;
        return {
          ...creature,
          portrait: {
            src: optimizeCloudinaryUrl(tagged.url, 300),
            alt: `${creature.name} — portrait from the collection`,
          },
          footnote: undefined,
        };
      }),
    [photos],
  );

  // The featured shelf is dealt once per visit (three of each creature from
  // the `feature` pool) and then frozen, so uploads don't reshuffle it.
  const [shelf, setShelf] = useState<PetPhoto[]>([]);
  useEffect(() => {
    if (shelf.length === 0 && photos.length > 0) {
      setShelf(dealShelf(photos));
    }
  }, [photos, shelf.length]);

  // Whatever hangs on the shelf sits out of the feed for this visit.
  const feedPhotos = useMemo(() => {
    const shelfIds = new Set(shelf.map((photo) => photo.id));
    return photos.filter((photo) => !shelfIds.has(photo.id));
  }, [photos, shelf]);

  const filteredPhotos = useMemo(() => {
    if (filter === "all") return feedPhotos;
    return feedPhotos.filter((photo) => (photo.tags || []).includes(filter));
  }, [feedPhotos, filter]);

  return (
    // overflow-x-clip guards the shelf's full-bleed w-screen band from
    // creating a horizontal scrollbar (100vw includes the scrollbar width).
    <div data-chapter={chapter.theme} className="min-h-screen bg-paper flex flex-col overflow-x-clip">
      <SiteHeader />
      <DoodleDefs />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6">
        {/* Hero — the chapter opening with the creatures' stickers */}
        <section className="relative pt-12 md:pt-16 pb-2">
          <p className="u-label text-copper mb-3">chapter three — the permanent collection</p>
          <h1 className="font-display lowercase text-6xl md:text-8xl text-ink leading-none">
            pets
          </h1>
          <p className="font-hand text-copper-bright text-2xl md:text-[1.7rem] -rotate-3 inline-block ml-16 md:ml-32 mt-1">
            <AnnotArrow className="inline-block w-12 h-9 align-middle -mr-1.5" />
            our creatures
          </p>
          <p className="font-body text-lg text-ink/75 max-w-xl mt-4 leading-relaxed">
            The two of them run this house; we just open the treat drawer.
            Everything they do ends up here — the collection is permanent,
            always growing, and never curated down.
          </p>

          {/* Sticker cutouts from the family portrait, leaning on the header */}
          <div className="hidden md:flex absolute top-10 right-0 items-end gap-1" aria-hidden="true">
            <div className="bg-parchment border border-ink/10 shadow-md p-2 pb-1 rotate-3">
              <img src="/images/pets/illustrated-phoebe.png" alt="" width={84} className="block" />
            </div>
            <div className="bg-parchment border border-ink/10 shadow-md p-2 pb-1 -rotate-6 translate-y-2">
              <img src="/images/pets/illustrated-penny.png" alt="" width={56} className="block" />
            </div>
          </div>
        </section>

        {/* The residents */}
        <section className="grid md:grid-cols-2 gap-8 md:gap-9 mt-10">
          {creatures.map((creature) => (
            <CreatureCard key={creature.name} creature={creature} />
          ))}
        </section>

        {/* On display — the featured shelf ("the mantel"), dealt per visit */}
        <FeaturedShelf photos={shelf} />

        {/* Filed under — filters + the curators' upload */}
        <section className="mt-12 mb-10 border-y border-ink/10 py-4 flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="u-label text-ink/60">filed under —</span>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`sketchchip px-4 py-1.5 u-label tracking-[0.14em] transition-colors duration-1 ease-paper ${
                filter === key
                  ? "bg-olive border-olive text-paper"
                  : "text-ink hover:border-ink"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <span className="font-hand text-lg text-copper-bright -rotate-2 hidden sm:inline">
              straight from your phone →
            </span>
            <AddToCollection onUploaded={appendPhotos} />
          </div>
        </section>

        {/* The collection */}
        <section className="pb-16">
          <PetsGallery
            photos={filteredPhotos}
            loading={loading}
            unavailable={unavailable}
            filterLabel={filter === "all" ? "the creatures" : filter}
          />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Pets;
