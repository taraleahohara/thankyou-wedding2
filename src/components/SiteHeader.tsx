import { Link } from "react-router-dom";

/**
 * The site shell's top bar — a centered lowercase serif wordmark masthead.
 *
 * Chapter links intentionally live in the homepage grid rather than the nav:
 * with only a few life events today, a fixed nav wouldn't future-proof. Once
 * there are enough events to group, this bar can grow category navigation.
 */
const SiteHeader = () => {
  return (
    // In-flow (not sticky): the masthead reads once at the top and then gets
    // out of the photography's way — a floating bar added no value (Tara).
    <header className="bg-paper border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-center">
        <Link
          to="/"
          className="font-display italic text-lg text-ink lowercase whitespace-nowrap transition-opacity duration-1 ease-paper hover:opacity-70"
          aria-label="home"
        >
          tara &amp; daniel
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
