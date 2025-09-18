import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Leaf, Award, Zap, Globe, Target, BookOpen, TrendingUp, Gamepad2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LessonCard } from "@/components/LessonCard";
import { ProgressStats } from "@/components/ProgressStats";
import { AchievementBadge } from "@/components/AchievementBadge";
import { StreakCounter } from "@/components/StreakCounter";
import { LearningPathway } from "@/components/LearningPathway";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { useLearning } from "@/contexts/LearningContext";



const Index = () => {
  const navigate = useNavigate();
  const { userProfile, lessonCategories, lessons, userProgress, achievements, userAchievements, loading } = useLearning();

  // Use a placeholder image from Pexels instead of local import
  const heroImage = "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  
  // Get completed lesson IDs from progress
  const completedLessonIds = userProgress.filter(p => p.completed).map(p => p.lesson_id);
  const earnedAchievements = achievements.filter(a => 
    userAchievements.some(ua => ua.achievement_id === a.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nature-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your learning data...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <ParallaxBackground />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-nature-primary/80 to-nature-secondary/60" />
          <div className="relative h-full flex items-center justify-center text-center px-4 z-10">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Learn Climate Science
                <span className="block text-nature-secondary">Like Never Before</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Master environmental science through interactive lessons, earn badges, and help save our planet - one lesson at a time.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-nature-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg hover:scale-102 transition-all duration-700 shadow-lg hover:shadow-xl animate-bounce-very-slow"
                onClick={() => navigate("/games")}
              >
                Start Learning <Leaf className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-8 px-4 bg-secondary/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <ProgressStats 
              title="Total XP" 
              value={userProfile?.total_xp?.toLocaleString() || '0'} 
              icon={TrendingUp}
              color="text-nature-primary"
            />
            <ProgressStats 
              title="Lessons Completed" 
              value={userProfile?.lessons_completed?.toString() || '0'}
              icon={BookOpen}
              color="text-accent"
            />
            <StreakCounter streak={userProfile?.current_streak || 0} onClick={() => navigate("/profile")} />
            <ProgressStats 
              title="Achievements" 
              value={`${earnedAchievements.length}/${achievements.length}`}
              icon={Award}
              color="text-warning"
              onClick={() => navigate("/achievements")}
            />
            <ProgressStats 
              title="Leaderboard" 
              value="Rank"
              icon={Trophy}
              color="text-purple-500"
              onClick={() => navigate("/leaderboard")}
            />
            <Card 
              className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
              onClick={() => navigate("/games")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Games Hub</p>
                    <p className="text-2xl font-bold text-card-foreground">Play Games</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white animate-bounce-gentle">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weather Widget */}
          <div className="mt-6">
            <WeatherWidget />
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <LearningPathway completedLessons={completedLessonIds} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-nature-primary to-nature-secondary relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners making our planet a better place through education and action.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-nature-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/games")}
          >
            Explore Games <Gamepad2 className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;