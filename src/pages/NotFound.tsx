import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <p className="u-label text-copper mb-6">error 404</p>

        <h1 className="font-display italic lowercase text-6xl md:text-8xl text-ink leading-none mb-6">
          lost.
        </h1>

        <p className="text-lg text-ink/70 max-w-sm leading-relaxed mb-10">
          this page wandered off somewhere — even the dog doesn't know where it
          went.
        </p>

        {/* The lost page earns the site's one marigold moment */}
        <Link
          to="/"
          className="u-label bg-marigold text-ink rounded-full px-5 py-2.5 hover:bg-marigold/90 transition-colors duration-2 ease-paper"
        >
          ← back to our life
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NotFound;
