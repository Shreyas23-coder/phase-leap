import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import CandidateDashboard from "./pages/candidates/Dashboard";
import RecruiterDashboard from "./pages/recruiters/Dashboard";
import Auth from "./pages/auth/Auth";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
            <Route path="/auth/login" element={!session ? <Auth /> : <Navigate to="/" />} />
            <Route path="/auth/register" element={!session ? <Auth /> : <Navigate to="/" />} />
            <Route path="/candidates" element={session ? <CandidateDashboard /> : <Navigate to="/auth" />} />
            <Route path="/recruiters" element={session ? <RecruiterDashboard /> : <Navigate to="/auth" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
