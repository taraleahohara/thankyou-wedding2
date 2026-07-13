import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SiteDescription from "@/components/SiteDescription";
import TaggedPhotoGallery from "@/components/TaggedPhotoGallery";
import ThankYouSection from "@/components/ThankYouSection";
import FloatingGalleryNav from "@/components/FloatingGalleryNav";
import RelatedGalleries from "@/components/RelatedGalleries";
import { guestList, type GuestConfig } from "@/data/guests";
import { getChapter } from "@/data/chapters";
import { weddingPhotos } from "@/data/weddingPhotos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const chapter = getChapter("wedding")!;
const chapterPassword = chapter.auth!.password;

const Wedding = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [currentGuest, setCurrentGuest] = useState<GuestConfig | null>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Magic Links - Check for guest parameter in URL on mount
  useEffect(() => {
    const guestTag = searchParams.get(chapter.auth!.magicLinkParam);

    if (guestTag) {
      // Search for guest by tag
      const foundGuest = guestList.find(guest => guest.tag === guestTag);

      if (foundGuest) {
        // Auto-authenticate with magic link
        setCurrentGuest(foundGuest);
        setIsAuthenticated(true);
      }
    }
  }, [searchParams]);

  // Update page title when authenticated
  useEffect(() => {
    if (isAuthenticated && currentGuest && currentGuest.tag !== "wedding-highlights") {
      document.title = `${chapter.pageTitle} - ${currentGuest.names[0]}`;
    } else {
      document.title = chapter.pageTitle!;
    }
  }, [isAuthenticated, currentGuest]);

  // Update Open Graph image for social sharing
  useEffect(() => {
    const weddingHeaderImage = chapter.ogImage!;

    // Update or create og:image meta tag
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', weddingHeaderImage);

    // Update or create twitter:image meta tag
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', weddingHeaderImage);
  }, []);

  // Login handler
  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    // Check password
    if (passwordInput !== chapterPassword) {
      setError("Incorrect password");
      return;
    }

    // Normalize input
    const normalizedInput = guestNameInput.trim().toLowerCase();

    // Search for matching guest - check both exact match and partial match
    const foundGuest = guestList.find(guest => {
      return guest.names.some(name => {
        const normalizedName = name.toLowerCase();
        const exactMatch = normalizedName === normalizedInput;
        const nameIncludesInput = normalizedName.includes(normalizedInput);
        const inputIncludesName = normalizedInput.includes(normalizedName);
        const matches = exactMatch || nameIncludesInput || inputIncludesName;

        // Check if name includes input OR input includes name (for partial matching)
        return matches;
      });
    });

    if (foundGuest) {
      setCurrentGuest(foundGuest);
      setIsAuthenticated(true);
      setError("");
      setGuestNameInput("");
      setPasswordInput("");
    } else {
      setError("We couldn't find a guest with that name. Please try again or select 'Not a Guest'");
    }
  };

  // "Not a Guest" handler
  const handleNotAGuest = () => {
    setError("");

    // Check password
    if (passwordInput !== chapterPassword) {
      setError("Incorrect password");
      return;
    }

    // Find wedding-highlights guest
    const highlightsGuest = guestList.find(guest => guest.tag === "wedding-highlights");

    if (highlightsGuest) {
      setCurrentGuest(highlightsGuest);
      setIsAuthenticated(true);
      setError("");
      setGuestNameInput("");
      setPasswordInput("");
    }
  };

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div data-chapter={chapter.theme} className="min-h-screen bg-paper flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-paper border-brand-alt/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-ink">
              Welcome to Our Wedding Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-ink">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-ink">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="bg-background"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-brand text-paper hover:bg-brand/90"
                >
                  Enter
                </Button>
                <Button
                  type="button"
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNotAGuest();
                  }}
                  className="w-full text-brand-alt hover:text-brand-alt/80"
                >
                  I was not a guest
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render authenticated view
  return (
    <div data-chapter={chapter.theme} className="min-h-screen">
      <HeroSection
        imageUrl={chapter.hero!.image}
        title={chapter.hero!.title}
        subtitle={chapter.hero!.subtitle}
      />

      {/* Display welcome message */}
      {currentGuest && (() => {
        const message = currentGuest.welcomeMessage;
        const lines = message.split('\n');
        const dearLine = lines[0]; // First line contains "Dear Name"
        const restOfMessage = lines.slice(1).join('\n');

        return (
          <section className="relative py-24 px-6 bg-paper">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl mb-6 text-brand">
                {dearLine}
              </h1>
              {restOfMessage && (
                <p className="text-xl md:text-2xl leading-relaxed text-ink whitespace-pre-line mb-6">
                  {restOfMessage}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl text-brand mt-8">
                Love, Tara & Dan
              </h2>
            </div>
          </section>
        );
      })()}

      <SiteDescription text={chapter.siteDescription!} />

      {chapter.sections!.map((section, index) => (
        <TaggedPhotoGallery
          key={section.id}
          title={section.title}
          tag={section.tag}
          categoryIndex={index}
          id={section.id}
          description={section.description}
          allowDownload={section.allowDownload}
          showCaption={section.showCaption}
          photos={weddingPhotos}
        />
      ))}

      {currentGuest && currentGuest.tag !== "wedding-highlights" && (
        <TaggedPhotoGallery
          title="Moments Curated for You"
          // TODO: The underlying Cloudinary tag is misspelled ("Calgeron" instead of
          // "Calegeron"). Fix the tag at the source in Cloudinary, then remove this remap.
          tag={currentGuest.tag === "Calegeron" ? "Calgeron" : currentGuest.tag}
          categoryIndex={chapter.sections!.length}
          id="curated-for-you"
          photos={weddingPhotos}
        />
      )}

      {currentGuest && currentGuest.tag !== "wedding-highlights" && (
        <ThankYouSection />
      )}

      <RelatedGalleries relatedGalleryIds={chapter.relatedChapterIds!} />

      <FloatingGalleryNav hasPersonalizedGallery={currentGuest && currentGuest.tag !== "wedding-highlights"} />
    </div>
  );
};

export default Wedding;
