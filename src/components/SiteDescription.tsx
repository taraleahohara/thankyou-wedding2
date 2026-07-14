interface SiteDescriptionProps {
  text: string;
  /** "band" = full-bleed brand-colour block (wedding, default);
   *  "plain" = quiet ivory with a small spine-colour accent (archive). */
  variant?: "band" | "plain";
}

const SiteDescription = ({ text, variant = "band" }: SiteDescriptionProps) => {
  if (variant === "plain") {
    return (
      <section className="py-10 md:py-12 px-6 bg-paper">
        <div className="max-w-2xl mx-auto text-center">
          {/* Short spine-colour rule — the chapter's colour, quietly */}
          <div className="mx-auto mb-6 h-px w-10 bg-brand" />
          <p className="text-lg md:text-xl leading-relaxed text-ink/80">
            {text}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-brand">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg md:text-xl leading-relaxed text-paper">
          {text}
        </p>
      </div>
    </section>
  );
};

export default SiteDescription;
