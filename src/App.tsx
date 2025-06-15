
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Session from "./pages/Session";
import NotFound from "./pages/NotFound";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const queryClient = new QueryClient();

const App = () => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter basename={import.meta.env.VITE_BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/session/:sessionId" element={<Session />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </NextThemesProvider>
);

export default App;
