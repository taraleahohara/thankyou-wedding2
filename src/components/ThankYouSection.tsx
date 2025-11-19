import FloralDecoration from "./FloralDecoration";

const ThankYouSection = () => {
  return (
    <section className="relative py-20 px-6 bg-wedding-olive text-wedding-cream overflow-hidden">
      <FloralDecoration position="bottom-left" />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h3 className="text-5xl md:text-6xl mb-6 text-wedding-cream">
          Thank You
        </h3>
        <p className="text-xl md:text-2xl leading-relaxed text-wedding-cream">
          Your presence on our special day meant the world to us. These memories will be cherished forever.
        </p>
        <p className="text-2xl md:text-3xl mt-8 font-serif italic text-wedding-cream">
          With love,<br />Tara & Daniel
        </p>
      </div>
    </section>
  );
};

export default ThankYouSection;