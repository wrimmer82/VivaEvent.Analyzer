import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ArtistProfile from "./pages/ArtistProfile";
import VenueProfile from "./pages/VenueProfile";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Auth from "./pages/Auth";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crea-profilo" element={<ArtistProfile />} />
          <Route path="/profilo-professionista" element={<ProfessionalProfile />} />
          <Route path="/profilo-venue" element={<VenueProfile />} />
          <Route path="/accedi" element={<Auth />} />
          <Route path="/inizia-ora" element={<GetStarted />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
