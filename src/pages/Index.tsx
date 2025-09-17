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

  const isCategoryUnlocked = (categoryId: number) => {
    if (categoryId === 1) return true; // Climate Basics always unlocked
    
    // Check if previous category is completed
    const previousCategoryLessons = lessonCategories[categoryId - 2].totalLessons;
    const previousCategoryIds = [];
    
    // Get lesson IDs for previous category
    for (let i = 0; i < categoryId - 1; i++) {
      const startId = i * 5 + 1; // Each category has 5 lessons starting from 1, 6, 11, 16
      for (let j = 0; j < lessonCategories[i].totalLessons; j++) {
        previousCategoryIds.push(startId + j);
      }
    }
    
    const lastCategoryStart = (categoryId - 2) * 5 + 1;
    const lastCategoryIds = [];
    for (let i = 0; i < lessonCategories[categoryId - 2].totalLessons; i++) {
      lastCategoryIds.push(lastCategoryStart + i);
    }
    
    return lastCategoryIds.every(id => completedLessons.includes(id));
  };

  const lessonCategories = [
    {
      id: 1,
      title: "Climate Basics",
      description: "Understanding greenhouse gases and global warming",
      icon: Globe,
      progress: calculateProgress([1, 2, 3, 4, 5]),
      lessonsCompleted: [1, 2, 3, 4, 5].filter(id => completedLessons.includes(id)).length,
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
      progress: calculateProgress([6, 7, 8, 9, 10]),
      lessonsCompleted: [6, 7, 8, 9, 10].filter(id => completedLessons.includes(id)).length,
      totalLessons: 10,
      difficulty: "Intermediate", 
      color: "bg-gradient-to-br from-yellow-500 to-orange-400",
      unlocked: isCategoryUnlocked(2),
    },
    {
      id: 3,
      title: "Waste Management",
      description: "Recycling, composting, and reducing waste",
      icon: Target,
      progress: calculateProgress([11, 12, 13, 14, 15]),
      lessonsCompleted: [11, 12, 13, 14, 15].filter(id => completedLessons.includes(id)).length,
      totalLessons: 10,
      difficulty: "Beginner",
      color: "bg-gradient-to-br from-green-500 to-emerald-400",
      unlocked: isCategoryUnlocked(3),
    },
    {
      id: 4,
      title: "Ecosystem Protection",
      description: "Biodiversity, conservation, and habitat preservation",
      icon: Leaf,
      progress: calculateProgress([16, 17, 18, 19, 20]),
      lessonsCompleted: [16, 17, 18, 19, 20].filter(id => completedLessons.includes(id)).length,
      totalLessons: 12,
      difficulty: "Advanced",
      color: "bg-gradient-to-br from-emerald-600 to-green-500",
      unlocked: isCategoryUnlocked(4),
    },
  ];

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: BookOpen, earned: true },
    { id: 2, name: "Week Warrior", description: "7-day learning streak", icon: Award, earned: true },
    { id: 3, name: "Climate Champion", description: "Complete 50 lessons", icon: Globe, earned: false },
    { id: 4, name: "Energy Expert", description: "Master renewable energy", icon: Zap, earned: false },
  ];

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              onClick={() => navigate("/game")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Quiz Game</p>
                    <p className="text-2xl font-bold text-card-foreground">Play Now</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white animate-bounce-gentle">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progress through expertly crafted lessons designed to make you a climate action hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {lessonCategories.map((category, index) => (
              <div key={category.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <LessonCard 
                  {...category} 
                  onStartLearning={() => {
                    if (category.unlocked) {
                      navigate(`/lessons/${category.id}`)
                    }
                  }} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Achievements
            </h2>
            <p className="text-lg text-muted-foreground">
              Unlock badges as you progress and become a climate champion!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <AchievementBadge {...achievement} onClick={() => navigate("/achievements")} />
              </div>
            ))}
          </div>
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
            onClick={() => navigate("/game")}
          >
            Play Quiz Game <Gamepad2 className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;