/** Lars tape-stripe divider: a thin band of alternating spine-colour, paper
 *  and house-olive blocks — laid where the chapter changes register. */
const TapeStripe = () => (
  <div
    className="h-3.5 w-full"
    role="presentation"
    style={{
      background:
        "repeating-linear-gradient(90deg, hsl(var(--brand)) 0 5rem, hsl(var(--paper)) 5rem 10rem, hsl(var(--olive)) 10rem 15rem, hsl(var(--paper)) 15rem 20rem)",
    }}
  />
);

export default TapeStripe;
