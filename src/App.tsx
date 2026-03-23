
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PeriodProvider } from "@/contexts/PeriodContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import AddRecord from "./pages/AddRecord";
import EditRecord from "./pages/EditRecord";
import ViewRecord from "./pages/ViewRecord";
import List from "./pages/List";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <PeriodProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <Toaster />
          <Sonner closeButton position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddRecord />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <EditRecord />
              </ProtectedRoute>
            } />
            <Route path="/view/:id" element={<ViewRecord />} />
            <Route path="/list" element={<List />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </TooltipProvider>
      </PeriodProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
