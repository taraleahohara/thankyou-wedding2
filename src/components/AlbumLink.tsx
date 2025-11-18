import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface AlbumLinkProps {
  albumUrl: string;
}

const AlbumLink = ({ albumUrl }: AlbumLinkProps) => {
  return (
    <section className="py-16 px-6 bg-wedding-cream">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-4xl md:text-5xl mb-6 text-wedding-rust">
          Full Photo Album
        </h3>
        <p className="text-lg mb-8 text-wedding-warm-text">
          Want to see all the photos and download them? Access the complete collection in our Google Photos album.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-wedding-rust hover:bg-wedding-rust/90 text-primary-foreground"
        >
          <a href={albumUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2" size={20} />
            View Full Album
          </a>
        </Button>
      </div>
    </section>
  );
};

export default AlbumLink;