import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import PersonalizedGreeting from "@/components/PersonalizedGreeting";
import SiteDescription from "@/components/SiteDescription";
import PhotoGallery from "@/components/PhotoGallery";
import AlbumLink from "@/components/AlbumLink";
import ThankYouSection from "@/components/ThankYouSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { guestDatabase } from "@/data/guestData";
import { weddingPhotos, fullAlbumUrl } from "@/data/photoData";

const Index = () => {
  const [searchParams] = useSearchParams();
  const guestId = searchParams.get("guest") || "default";
  const [guestData, setGuestData] = useState(guestDatabase[guestId] || guestDatabase["default"]);

  useEffect(() => {
    const data = guestDatabase[guestId] || guestDatabase["default"];
    setGuestData(data);
    
    // Update page title with guest name
    document.title = `Tara & Daniel's Wedding - ${data.name}`;
  }, [guestId]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <PersonalizedGreeting 
        guestName={guestData.name}
        message={guestData.message}
      />
      
      <SiteDescription />
      
      <PhotoGallery 
        title="Before the Ceremony"
        photos={weddingPhotos.beforeCeremony}
        categoryIndex={0}
      />
      
      <PhotoGallery 
        title="The Ceremony"
        photos={weddingPhotos.ceremony}
        categoryIndex={1}
      />
      
      <PhotoGallery 
        title="The Reception"
        photos={weddingPhotos.reception}
        categoryIndex={2}
      />
      
      {guestData.personalPhotos && guestData.personalPhotos.length > 0 && (
        <PhotoGallery 
          title="Your Best Moments"
          photos={guestData.personalPhotos}
          categoryIndex={3}
        />
      )}
      
      <AlbumLink albumUrl={fullAlbumUrl} />
      
      <ThankYouSection />
      
      <NewsletterSignup />
    </div>
  );
};

export default Index;