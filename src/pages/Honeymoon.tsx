import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SiteDescription from "@/components/SiteDescription";
import TaggedPhotoGallery from "@/components/TaggedPhotoGallery";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getChapter } from "@/data/chapters";
import { honeymoonPhotos } from "@/data/honeymoonPhotos";
import PlateHero from "@/components/pilot/PlateHero";
import PilotControls from "@/components/pilot/PilotControls";
import { usePilotOptions } from "@/components/pilot/pilotOptions";

const chapter = getChapter("honeymoon")!;
const auth = chapter.auth! as Extract<NonNullable<typeof chapter.auth>, { mode: "password" }>;

const Honeymoon = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  // Homestead pilot: live-switchable design options (hero / gallery / gesture)
  const [pilot, updatePilot] = usePilotOptions();

  // Magic Links - Check for access parameter in URL on mount
  useEffect(() => {
    const accessToken = searchParams.get(auth.magicLinkParam);

    if (accessToken === auth.magicLinkValue) {
      // Auto-authenticate with magic link
      setIsAuthenticated(true);
    }
  }, [searchParams]);

  // Update page title
  useEffect(() => {
    document.title = chapter.pageTitle!;
  }, []);

  // Update Open Graph image for social sharing
  useEffect(() => {
    const honeymoonHeaderImage = chapter.ogImage!;

    // Update or create og:image meta tag
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', honeymoonHeaderImage);

    // Update or create twitter:image meta tag
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', honeymoonHeaderImage);
  }, []);

  // Login handler
  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    // Check password
    if (passwordInput !== auth.password) {
      setError("Incorrect password");
      return;
    }

    setIsAuthenticated(true);
    setError("");
    setPasswordInput("");
  };

  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div data-chapter={chapter.theme} className="min-h-screen bg-paper flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-parchment border-ink/10 shadow-none rounded-none">
          <CardHeader className="text-center">
            <p className="u-label text-copper mb-3">chapter 02 · sri lanka</p>
            <CardTitle className="font-display italic lowercase text-4xl text-ink">
              the honeymoon gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="u-label text-muted-foreground">
                  password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="the one from your invite"
                  className="bg-background border-ink/15"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center lowercase">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-marigold text-ink hover:bg-marigold/90 rounded-full lowercase tracking-wide transition-colors duration-2 ease-paper"
              >
                come along →
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render authenticated view
  return (
    <div data-chapter={chapter.theme} className="min-h-screen bg-paper flex flex-col">
      <SiteHeader />

      {/* Locked by Tara: wash hero + scatter galleries */}
      <PlateHero
        mode="wash"
        eyebrow="chapter 02 · august 2025"
        imageUrl={chapter.hero!.image}
        title={chapter.title}
        subtitle="sri lanka"
      />

      <SiteDescription text={chapter.siteDescription!} variant="plain" />

      <div className="flex-1">
        {chapter.sections!.map((section, index) => (
          <TaggedPhotoGallery
            key={section.id}
            title={section.title}
            tag={section.tag}
            categoryIndex={index}
            eyebrow={`0${index + 1}`}
            frame="hairline"
            layout="scatter"
            scatterScale={pilot.scale}
            emphasizeTitle
            id={section.id}
            description={section.description}
            allowDownload={section.allowDownload}
            showCaption={section.showCaption}
            photos={honeymoonPhotos}
          />
        ))}
      </div>

      <SiteFooter />

      <PilotControls options={pilot} onChange={updatePilot} />
    </div>
  );
};

export default Honeymoon;
