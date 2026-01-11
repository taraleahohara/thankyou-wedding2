import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import SiteDescription from "@/components/SiteDescription";
import TaggedPhotoGallery from "@/components/TaggedPhotoGallery";
import AlbumLink from "@/components/AlbumLink";
import ThankYouSection from "@/components/ThankYouSection";
import FloatingGalleryNav from "@/components/FloatingGalleryNav";
import RelatedGalleries from "@/components/RelatedGalleries";
import { guestList, type GuestConfig } from "@/data/guests";
import { fullAlbumUrl } from "@/data/photoData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Wedding = () => {
  // State management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [currentGuest, setCurrentGuest] = useState<GuestConfig | null>(null);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:24',message:'Component render',data:{searchParamsString:searchParams.toString(),isAuthenticated,currentGuestTag:currentGuest?.tag,windowLocation:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Version marker - v5 - NEW PORT 4000
  console.log('🚀🚀🚀 Wedding page v5 - NEW PORT 4000 - Fresh start!');
  console.log('Regenerated URLs should be working now!');
  console.log('Timestamp:', new Date().toISOString());

  // Magic Links - Check for guest parameter in URL on mount
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:32',message:'useEffect triggered',data:{searchParamsString:searchParams.toString(),allSearchParams:Object.fromEntries(searchParams.entries()),guestListLength:guestList.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    const guestTag = searchParams.get('guest');
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:37',message:'Query param extracted',data:{guestTag,guestTagType:typeof guestTag,guestTagLength:guestTag?.length,isNull:guestTag===null,isUndefined:guestTag===undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (guestTag) {
      // #region agent log
      const weddingHighlightsGuest = guestList.find(guest => guest.tag === "wedding-highlights");
      const allTags = guestList.map(g => g.tag);
      fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:42',message:'Before guest search',data:{guestTag,guestListLength:guestList.length,hasWeddingHighlights:!!weddingHighlightsGuest,weddingHighlightsTag:weddingHighlightsGuest?.tag,allTags},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Search for guest by tag
      const foundGuest = guestList.find(guest => guest.tag === guestTag);
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:47',message:'After guest search',data:{guestTag,foundGuest:!!foundGuest,foundGuestTag:foundGuest?.tag,foundGuestNames:foundGuest?.names,tagComparison:foundGuest ? foundGuest.tag === guestTag : 'N/A',exactMatch:guestTag === "wedding-highlights"},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      if (foundGuest) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:50',message:'Setting authentication state',data:{foundGuestTag:foundGuest.tag,foundGuestNames:foundGuest.names,currentAuthState:isAuthenticated},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        
        // Auto-authenticate with magic link
        setCurrentGuest(foundGuest);
        setIsAuthenticated(true);
      }
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:58',message:'No guest tag found',data:{searchParamsString:searchParams.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  }, [searchParams]);

  // Update page title when authenticated
  if (isAuthenticated && currentGuest) {
    document.title = `Tara & Daniel's Wedding - ${currentGuest.names[0]}`;
  } else {
    document.title = `Tara & Daniel's Wedding`;
  }

  // Update Open Graph image for social sharing
  useEffect(() => {
    const weddingHeaderImage = "https://res.cloudinary.com/dbr3xp0bx/image/upload/v1767394827/AP1-6.jpg";
    
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
    if (passwordInput !== "taradan#1004") {
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
    if (passwordInput !== "taradan#1004") {
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

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/5e69c25a-120a-44ef-8831-fc1edb8937ac',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Wedding.tsx:141',message:'Render check',data:{isAuthenticated,currentGuest:!!currentGuest,currentGuestTag:currentGuest?.tag},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  
  // Render login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center px-6">
        <Card className="max-w-md w-full bg-wedding-cream border-wedding-olive/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-wedding-warm-text">
              Welcome to Our Wedding Gallery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-wedding-warm-text">
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
                <Button
                  type="button"
                  variant="link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNotAGuest();
                  }}
                  className="w-full text-wedding-olive hover:text-wedding-olive/80"
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
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Display welcome message */}
      {currentGuest && (() => {
        const message = currentGuest.welcomeMessage;
        const lines = message.split('\n');
        const dearLine = lines[0]; // First line contains "Dear Name"
        const restOfMessage = lines.slice(1).join('\n');
        
        return (
          <section className="relative py-24 px-6 bg-wedding-cream">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl mb-6 text-wedding-rust">
                {dearLine}
              </h1>
              {restOfMessage && (
                <p className="text-xl md:text-2xl leading-relaxed text-wedding-warm-text whitespace-pre-line mb-6">
                  {restOfMessage}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl text-wedding-rust mt-8">
                Love, Tara & Dan
              </h2>
            </div>
          </section>
        );
      })()}
      
      <SiteDescription />
      
      <TaggedPhotoGallery 
        title="Before the Ceremony"
        tag="before-ceremony"
        categoryIndex={0}
        id="before-ceremony"
      />
      
      <TaggedPhotoGallery 
        title="The Ceremony"
        tag="ceremony"
        categoryIndex={1}
        id="ceremony"
      />
      
      <TaggedPhotoGallery 
        title="Brunch"
        tag="brunch"
        categoryIndex={2}
        id="brunch"
      />
      
      <TaggedPhotoGallery 
        title="After Party"
        tag="after-party"
        categoryIndex={3}
        id="after-party"
      />
      
      {currentGuest && currentGuest.tag !== "wedding-highlights" && (
        <TaggedPhotoGallery 
          title="Moments Curated for You"
          tag={currentGuest.tag === "Calegeron" ? "Calgeron" : currentGuest.tag}
          categoryIndex={4}
          id="curated-for-you"
        />
      )}
      
      <AlbumLink albumUrl={fullAlbumUrl} />
      
      {currentGuest && currentGuest.tag !== "wedding-highlights" && (
        <ThankYouSection />
      )}
      
      <RelatedGalleries relatedGalleryIds={["honeymoon"]} />
      
      <FloatingGalleryNav hasPersonalizedGallery={currentGuest && currentGuest.tag !== "wedding-highlights"} />
    </div>
  );
};

export default Wedding;

