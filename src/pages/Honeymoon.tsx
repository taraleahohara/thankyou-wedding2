import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SiteDescription from "@/components/SiteDescription";
import TaggedPhotoGallery from "@/components/TaggedPhotoGallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { honeymoonPhotos } from "@/data/honeymoonPhotos";

const Honeymoon = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // Magic Links - Check for access parameter in URL on mount
  useEffect(() => {
    const accessToken = searchParams.get('access');
    
    if (accessToken === 'honeymoon') {
      // Auto-authenticate with magic link
      setIsAuthenticated(true);
    }
  }, [searchParams]);

  // Update page title when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      document.title = `Tara & Daniel's Honeymoon`;
    } else {
      document.title = `Tara & Daniel's Honeymoon`;
    }
  }, [isAuthenticated]);

  // Add/remove honeymoon class on body for color overrides
  useEffect(() => {
    document.body.classList.add('honeymoon-page');
    return () => {
      document.body.classList.remove('honeymoon-page');
    };
  }, []);

  // Update Open Graph image for social sharing
  useEffect(() => {
    const honeymoonHeaderImage = "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767633211/IMG_3498_bsco2c.jpg";
    
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
    if (passwordInput !== "taradan#0530") {
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
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-wedding-cream border-wedding-olive/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-wedding-warm-text">
              Welcome to Our Honeymoon Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-wedding-warm-text">
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
                  className="w-full bg-wedding-rust text-wedding-cream hover:bg-wedding-rust/90"
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
  // Find the header image
  const headerImage = honeymoonPhotos.find(photo => 
    photo.url.includes('IMG_3498_bsco2c')
  )?.url || undefined;

  return (
    <div className="min-h-screen">
      <HeroSection 
        imageUrl={headerImage}
        title="Tara & Daniel"
        subtitle="Our Honeymoon"
      />
      
      <SiteDescription text="This gallery is a glimpse into our honeymoon in Sri Lanka — a journey shaped by history, nature, wildlife, and moments of quiet rest. We moved slowly through ancient cities, misty mountains, and sunlit coastlines, letting each place set its own rhythm. These photos capture the places we explored, the spaces we stayed, and the feeling of beginning this next chapter together." />
      
      <TaggedPhotoGallery 
        title="The Cultural Triangle"
        tag="culture"
        categoryIndex={0}
        id="cultural-triangle"
        description={
          <>
            <strong>Sri Lanka's Cultural Triangle</strong> lies in the center of the island and represents its historic and spiritual heart, shaped by ancient kings, monks, and remarkable engineering. Here, centuries-old cities, temples, reservoirs, and rock fortresses still define the landscape today. During our time in the region, we explored the ruined capital of <strong>Polonnaruwa</strong>, climbed the iconic <strong>Sigiriya Lion Rock Fortress</strong>, wandered through the cave shrines of <strong>Dambulla Cave Temple</strong>, and finished in <strong>Kandy</strong> at the sacred <strong>Temple of the Sacred Tooth</strong>.
          </>
        }
        allowDownload={false}
        showCaption={true}
        photosSource="honeymoon"
      />
      
      <TaggedPhotoGallery 
        title="Mountains & Nature"
        tag="nature"
        categoryIndex={1}
        id="mountains-nature"
        description={
          <>
            Sri Lanka's mountains and wild south offered a striking contrast to the ancient cities - cooler air, lush hills, and some of the island's richest wildlife. We slowed down in the tea country around <strong>Ella</strong>, wandering past waterfalls and the iconic Nine Arch Bridge, before heading south to encounter elephants at the Elephant Transit Home and on safari in <strong>Udawalawe National Park</strong>. We also visited the quiet stone presence of Buduruwagala Temple and finished deep in the rainforest, birding in <strong>Sinharaja Rainforest</strong>.
          </>
        }
        allowDownload={false}
        showCaption={true}
        photosSource="honeymoon"
      />
      
      <TaggedPhotoGallery 
        title="Southern Coast"
        tag="beach"
        categoryIndex={2}
        id="southern-coast"
        description={
          <>
            Our journey ended gently along Sri Lanka's southern coast, a brief pause devoted to rest and reflection. We spent slow days on the sand at <strong>Mirissa Beach</strong> and <strong>Ahangama</strong>, and explored the historic streets of <strong>Galle Fort</strong>.
          </>
        }
        allowDownload={false}
        showCaption={true}
        photosSource="honeymoon"
      />
      
      <TaggedPhotoGallery 
        title="Our Hotels"
        tag="hotels"
        categoryIndex={3}
        id="hotels"
        description={
          <>
            A huge part of our honeymoon was the places we chose to slow down and simply be. We treated ourselves to hotels that felt calm, beautiful, and deeply connected to their surroundings — spaces that set the tone for the trip and gave us room to relax, reflect, and celebrate. From the iconic architecture of <strong>Heritance Kandalama</strong> to cozy hideaways like <strong>Tea Cabins</strong>, rainforest retreats such as <strong>Sinharaja Kurulu Ella Eco Resort</strong>, and indulgent coastal stays at <strong>Malabar Hill</strong> and <strong>The Find</strong>, these spaces were as much a part of our journey as the places we explored — and a big reason the trip felt so special.
          </>
        }
        allowDownload={false}
        showCaption={true}
        photosSource="honeymoon"
      />
    </div>
  );
};

export default Honeymoon;
