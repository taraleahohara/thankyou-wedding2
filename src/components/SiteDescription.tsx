interface SiteDescriptionProps {
  text: string;
}

const SiteDescription = ({ text }: SiteDescriptionProps) => {
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
