import FloralDecoration from "./FloralDecoration";

const ThankYouSection = () => {
  return (
    <section className="relative py-20 px-6 bg-brand-alt text-paper overflow-hidden">
      <FloralDecoration position="bottom-left" />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h3 className="text-4xl md:text-5xl mb-6 text-paper">
          Thank You
        </h3>
        <p className="text-xl md:text-2xl leading-relaxed text-paper">
          Your presence on our special day meant the world to us. These memories will be cherished forever.
        </p>
        <p className="text-2xl md:text-3xl mt-8 font-serif italic text-paper">
          With love,<br />Tara & Daniel
        </p>
      </div>
    </section>
  );
};

export default ThankYouSection;