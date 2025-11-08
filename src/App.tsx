import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProfileDashboard from "./pages/ProfileDashboard";
import ArtistProfile from "./pages/ArtistProfile";
import VenueProfile from "./pages/VenueProfile";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import VenuePublicProfile from "./pages/VenuePublicProfile";
import VenueDashboard from "./pages/VenueDashboard";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalMatchingDashboard from "./pages/ProfessionalMatchingDashboard";
import Auth from "./pages/Auth";
import GetStarted from "./pages/GetStarted";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile-dashboard" element={<ProfileDashboard />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/venue-dashboard" 
            element={
              <ProtectedRoute>
                <VenueDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professional/dashboard" 
            element={
              <ProtectedRoute>
                <ProfessionalDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professional/dashboard/matching" 
            element={
              <ProtectedRoute>
                <ProfessionalMatchingDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/crea-profilo" element={<ArtistProfile />} />
          <Route path="/profilo-professionista" element={<ProfessionalProfile />} />
          <Route path="/profilo-venue" element={<VenueProfile />} />
          <Route path="/venue/:id" element={<VenuePublicProfile />} />
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
