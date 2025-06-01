import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp, useClerk } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Check if Clerk is available in the window
const isClerkAvailable = () => {
  try {
    return typeof window !== 'undefined' && window.Clerk !== undefined;
  } catch (e) {
    return false;
  }
};

const App = () => {
  const hasClerk = isClerkAvailable();
  console.log("Application running in", hasClerk ? "Clerk authentication mode" : "development mode without authentication");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {hasClerk ? (
              // With Clerk Authentication
              <>
                <Route
                  path="/"
                  element={
                    <>
                      <SignedIn>
                        <Index />
                      </SignedIn>
                      <SignedOut>
                        <Navigate to="/sign-in" replace />
                      </SignedOut>
                    </>
                  }
                />
                <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
                <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
              </>
            ) : (
              // Development mode without Clerk
              <>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<Navigate to="/" replace />} />
                <Route path="/sign-up" element={<Navigate to="/" replace />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
