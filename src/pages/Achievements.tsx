import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Medal, Award, Crown, Zap, BookOpen, Flame, TrendingUp, Target, Star, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLearning } from "@/contexts/LearningContext";

const Achievements = () => {
  const navigate = useNavigate();

  const achievements = [
    { 
      id: 1, 
      name: "First Steps", 
      description: "Complete your first lesson", 
      icon: "BookOpen", 
      xp_reward: 50
    },
    { 
      id: 2, 
      name: "Week Warrior", 
      description: "7-day learning streak", 
      icon: "Flame", 
      xp_reward: 100
    },
    { 
      id: 3, 
      name: "Climate Champion", 
      description: "Complete 50 lessons", 
      icon: "Globe", 
      xp_reward: 500
    },
    { 
      id: 4, 
      name: "Energy Expert", 
      description: "Master renewable energy path", 
      icon: "Zap", 
      xp_reward: 300
    },
    { 
      id: 5, 
      name: "Perfect Score", 
      description: "Get 100% on any lesson", 
      icon: "Star", 
      xp_reward: 200
    },
    { 
      id: 6, 
      name: "Waste Wizard", 
      description: "Complete waste management path", 
      icon: "Target", 
      xp_reward: 300
    },
    { 
      id: 7, 
      name: "Streak Master", 
      description: "30-day learning streak", 
      icon: "Flame", 
      xp_reward: 1000
    },
    { 
      id: 8, 
      name: "Knowledge Seeker", 
      description: "Complete all learning paths", 
      icon: "Award", 
      xp_reward: 2000
    }
  ];

  const userAchievements = [
    { achievement_id: 1, earned_at: "2024-01-15" },
    { achievement_id: 2, earned_at: "2024-01-22" }
  ];

  const userProfile = {
    total_xp: 1250,
    current_streak: 7
  };

  const loading = false;

  const earnedAchievements = achievements.filter(a => 
    userAchievements.some(ua => ua.achievement_id === a.id)
  );
  
  const iconMap: { [key: string]: any } = {
    BookOpen,
    Flame,
    Globe,
    Zap,
    Star,
    Target,
    Award,
    Trophy
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nature-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Achievements</h1>
              <p className="text-xl opacity-90">Track your learning milestones and celebrate your progress!</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{earnedAchievements.length}/{achievements.length}</div>
              <div className="text-sm opacity-80">Achievements Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {userProfile && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center mb-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{earnedAchievements.length}</p>
                <p className="text-muted-foreground">Achievements Earned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-nature-primary to-nature-secondary rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{userProfile.total_xp.toLocaleString()}</p>
                <p className="text-muted-foreground">Total XP</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center mb-3">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <p className="text-2xl font-bold">{userProfile.current_streak}</p>
                <p className="text-muted-foreground">Current Streak</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Earned Achievements */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Award className="mr-2 h-6 w-6 text-success" />
                Earned Achievements ({earnedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {earnedAchievements.map((achievement) => {
                  const Icon = iconMap[achievement.icon] || Award;
                  const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);
                  
                  return (
                  <Card key={achievement.id} className="bg-gradient-to-br from-success/10 to-leaf/10 border-success/30">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        {userAchievement && (
                          <p className="text-xs text-success">Earned: {new Date(userAchievement.earned_at).toLocaleDateString()}</p>
                        )}
                        <Badge className="mt-2 bg-success text-success-foreground">
                          +{achievement.xp_reward} XP
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>

            {/* In Progress Achievements */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Target className="mr-2 h-6 w-6 text-nature-primary" />
                In Progress ({achievements.length - earnedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.filter(a => !earnedAchievements.some(ea => ea.id === a.id)).map((achievement) => {
                  const Icon = iconMap[achievement.icon] || Award;
                  
                  return (
                  <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        
                        <Badge variant="outline" className="mt-2">
                          {achievement.xp_reward} XP
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;