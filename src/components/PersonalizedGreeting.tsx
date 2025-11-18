interface PersonalizedGreetingProps {
  guestName: string;
  message: string;
}

const PersonalizedGreeting = ({ guestName, message }: PersonalizedGreetingProps) => {
  return (
    <section className="relative py-24 px-6 bg-wedding-cream">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-5xl md:text-7xl mb-8 text-wedding-rust">
          Dear {guestName}
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed text-wedding-warm-text whitespace-pre-line">
          {message}
        </p>
      </div>
    </section>
  );
};

export default PersonalizedGreeting;