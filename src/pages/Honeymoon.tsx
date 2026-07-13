import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SiteDescription from "@/components/SiteDescription";
import TaggedPhotoGallery from "@/components/TaggedPhotoGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getChapter } from "@/data/chapters";
import { honeymoonPhotos } from "@/data/honeymoonPhotos";

const chapter = getChapter("honeymoon")!;
const auth = chapter.auth! as Extract<NonNullable<typeof chapter.auth>, { mode: "password" }>;

const Honeymoon = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

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
        <Card className="max-w-md w-full bg-paper border-brand-alt/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-ink">
              Welcome to Our Honeymoon Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
          photos={honeymoonPhotos}
        />
      ))}
    </div>
  );
};

export default Honeymoon;
