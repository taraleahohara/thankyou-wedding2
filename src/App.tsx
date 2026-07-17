import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Wedding = lazy(() => import("./pages/Wedding"));
const Honeymoon = lazy(() => import("./pages/Honeymoon"));
const Pets = lazy(() => import("./pages/Pets"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-paper" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/honeymoon" element={<Honeymoon />} />
          <Route path="/pets" element={<Pets />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
