/**
 * Colophon footer for the shell — lowercase, tracked, warm and a little
 * cheeky, in the "family archive" voice. Hand-drawn ink divider matches
 * the illustrated portrait's line-art style.
 */
const SiteFooter = () => {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center text-center">
        {/* Hand-drawn divider glyph — colour comes from --ornament, so
            chapters can brand it (honeymoon: polished copper) while the
            shell default stays today's quiet ink. */}
        <svg
          width="72"
          height="16"
          viewBox="0 0 72 16"
          fill="none"
          aria-hidden
          className="mb-6"
          style={{ color: "var(--ornament)" }}
        >
          <path
            d="M2 8c6-5 10 5 16 0S28 3 34 8s10 5 16 0 8-6 20-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <p className="font-display italic text-2xl text-ink lowercase mb-4">our life.</p>

        <p className="u-label text-muted-foreground mb-2">the tara &amp; daniel family archive</p>

        <p className="u-label text-muted-foreground/80 leading-relaxed mb-1.5">
          built on the living room floor, where tara is learning to vibe-code
        </p>

        <p className="u-label text-muted-foreground/70 leading-relaxed">
          part experiment, part creative expression · est. 2025
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
