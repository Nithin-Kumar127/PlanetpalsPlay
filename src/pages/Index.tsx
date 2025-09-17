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

const achievements = [
  { id: 1, name: "First Steps", description: "Complete your first lesson", icon: BookOpen, earned: true },
  { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: Award, earned: true },
  { id: 3, name: "Climate Champion", description: "Complete 50 lessons", icon: Globe, earned: false },
  { id: 4, name: "Energy Expert", description: "Master renewable energy", icon: Zap, earned: false },
];

const baseLessonCategories = [
  {
    id: 1,
    title: "Climate Basics",
    description: "Understanding greenhouse gases and global warming",
    icon: Globe,
    totalLessons: 5,
    difficulty: "Beginner",
    color: "bg-gradient-to-br from-blue-500 to-cyan-400",
    unlocked: true,
  },
  {
    id: 2,
    title: "Renewable Energy",
    description: "Solar, wind, and sustainable power sources",
    icon: Zap,
    totalLessons: 5,
    difficulty: "Intermediate", 
    color: "bg-gradient-to-br from-yellow-500 to-orange-400",
    unlocked: false,
  },
  {
    id: 3,
    title: "Waste Management",
    description: "Recycling, composting, and reducing waste",
    icon: Target,
    totalLessons: 5,
    difficulty: "Beginner",
    color: "bg-gradient-to-br from-green-500 to-emerald-400",
    unlocked: false,
  },
  {
    id: 4,
    title: "Ecosystem Protection",
    description: "Biodiversity, conservation, and habitat preservation",
    icon: Leaf,
    totalLessons: 5,
    difficulty: "Advanced",
    color: "bg-gradient-to-br from-emerald-600 to-green-500",
    unlocked: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(1250);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    // Load completed lessons from localStorage
    const saved = localStorage.getItem('completedLessons');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

  // Use a placeholder image from Pexels instead of local import
  const heroImage = "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  
  const calculateProgress = (categoryLessons: number[]) => {
    const completed = categoryLessons.filter(id => completedLessons.includes(id)).length;
    return Math.round((completed / categoryLessons.length) * 100);
  };

  const isCategoryUnlocked = (categoryId: number): boolean => {
    if (categoryId === 1) return true; // Climate Basics always unlocked
    
    // Check if all lessons from previous category are completed
    const previousCategoryIndex = categoryId - 2;
    if (previousCategoryIndex < 0 || previousCategoryIndex >= baseLessonCategories.length) return false;
    
    const previousCategory = baseLessonCategories[previousCategoryIndex];
    const previousCategoryStart = (categoryId - 2) * 5 + 1;
    const previousCategoryLessonIds = [];
    
    for (let i = 0; i < previousCategory.totalLessons; i++) {
      previousCategoryLessonIds.push(previousCategoryStart + i);
    }
    
    return previousCategoryLessonIds.every(id => completedLessons.includes(id));
  };

  const lessonCategories = React.useMemo(() => {
    return baseLessonCategories.map((category) => {
      const startLessonId = (category.id - 1) * 5 + 1;
      const categoryLessonIds = [];
      for (let i = 0; i < category.totalLessons; i++) {
        categoryLessonIds.push(startLessonId + i);
      }
      
      return {
        ...category,
        progress: calculateProgress(categoryLessonIds),
        lessonsCompleted: categoryLessonIds.filter(id => completedLessons.includes(id)).length,
        unlocked: category.id === 1 ? true : isCategoryUnlocked(category.id),
      };
    });
  }, [completedLessons]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-nature-primary/80 to-nature-secondary/60" />
          <div className="relative h-full flex items-center justify-center text-center px-4">
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
                className="bg-white text-nature-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg animate-bounce-gentle"
                onClick={() => navigate("/lessons/1")}
              >
                Start Learning <Leaf className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-8 px-4 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <ProgressStats 
              title="Total XP" 
              value={totalXP.toLocaleString()} 
              icon={TrendingUp}
              color="text-nature-primary"
            />
            <ProgressStats 
              title="Lessons Completed" 
              value={completedLessons.length.toString()}
              icon={BookOpen}
              color="text-accent"
            />
            <StreakCounter streak={currentStreak} onClick={() => navigate("/profile")} />
            <ProgressStats 
              title="Achievements" 
              value={`${achievements.filter(a => a.earned).length}/${achievements.length}`}
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
            <Card 
              className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br from-green-50 to-blue-50 border-green-200"
              onClick={() => navigate("/climate-simulator")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Climate Simulator</p>
                    <p className="text-2xl font-bold text-card-foreground">Play Now</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 text-white animate-bounce-gentle">
                    <Globe className="h-5 w-5" />
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
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <LearningPathway completedLessons={completedLessons} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-nature-primary to-nature-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners making our planet a better place through education and action.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-nature-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg"
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