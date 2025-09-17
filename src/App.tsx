import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import LessonPath from "./pages/LessonPath";
import LessonDetail from "./pages/LessonDetail";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import ClimateSimulator from "./pages/ClimateSimulator";

const queryClient = new QueryClient();

const App = () => {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Header />
                  <Index />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/lessons/:categoryId" element={
                <ProtectedRoute>
                  <LessonPath />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/lesson/:lessonId" element={
                <ProtectedRoute>
                  <LessonDetail />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <Header />
                  <Achievements />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Header />
                  <Profile />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/game" element={
                <ProtectedRoute>
                  <Game />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Header />
                  <Leaderboard />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="/climate-simulator" element={
                <ProtectedRoute>
                  <ClimateSimulator />
                  <ChatBot 
                    isOpen={isChatBotOpen} 
                    onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
                  />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;