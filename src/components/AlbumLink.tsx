interface AlbumLinkProps {
  albumUrl: string;
}

const AlbumLink = ({ albumUrl }: AlbumLinkProps) => {
  return (
    <section className="py-16 px-6 bg-wedding-cream">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-4xl md:text-5xl mb-6 text-wedding-rust">
          Want a high res copy of an image?
        </h3>
        <p className="text-lg mb-8 text-wedding-warm-text">
          Connect with Tara or Dan. We will be happy to send you any copies you'd like for printing.
        </p>
      </div>
    </section>
  );
};

export default AlbumLink;