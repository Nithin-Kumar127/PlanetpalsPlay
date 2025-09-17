import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Zap, Globe, BookOpen, Target, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "@/components/AchievementBadge";

const Achievements = () => {
  const navigate = useNavigate();

  const achievements = [
    { 
      id: 1, 
      name: "First Steps", 
      description: "Complete your first lesson", 
      icon: BookOpen, 
      earned: true,
      earnedDate: "2024-01-15",
      xp: 50
    },
    { 
      id: 2, 
      name: "Week Warrior", 
      description: "7-day learning streak", 
      icon: Flame, 
      earned: true,
      earnedDate: "2024-01-22",
      xp: 100
    },
    { 
      id: 3, 
      name: "Climate Champion", 
      description: "Complete 50 lessons", 
      icon: Globe, 
      earned: false,
      progress: 17,
      required: 50,
      xp: 500
    },
    { 
      id: 4, 
      name: "Energy Expert", 
      description: "Master renewable energy path", 
      icon: Zap, 
      earned: false,
      progress: 0,
      required: 5,
      xp: 300
    },
    { 
      id: 5, 
      name: "Perfect Score", 
      description: "Get 100% on any lesson", 
      icon: Star, 
      earned: false,
      progress: 0,
      required: 1,
      xp: 200
    },
    { 
      id: 6, 
      name: "Waste Wizard", 
      description: "Complete waste management path", 
      icon: Target, 
      earned: false,
      progress: 3,
      required: 5,
      xp: 300
    },
    { 
      id: 7, 
      name: "Streak Master", 
      description: "30-day learning streak", 
      icon: Flame, 
      earned: false,
      progress: 7,
      required: 30,
      xp: 1000
    },
    { 
      id: 8, 
      name: "Knowledge Seeker", 
      description: "Complete all learning paths", 
      icon: Award, 
      earned: false,
      progress: 1,
      required: 4,
      xp: 2000
    }
  ];

  const totalEarned = achievements.filter(a => a.earned).length;
  const totalXP = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xp, 0);

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
              <div className="text-3xl font-bold">{totalEarned}/{achievements.length}</div>
              <div className="text-sm opacity-80">Achievements Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold">{totalEarned}</p>
              <p className="text-muted-foreground">Achievements Earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-nature-primary to-nature-secondary rounded-full flex items-center justify-center mb-3">
                <Star className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold">{totalXP}</p>
              <p className="text-muted-foreground">XP from Achievements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center mb-3">
                <Target className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold">{Math.round((totalEarned / achievements.length) * 100)}%</p>
              <p className="text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-8">
          {/* Earned Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Award className="mr-2 h-6 w-6 text-success" />
              Earned Achievements ({achievements.filter(a => a.earned).length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.filter(a => a.earned).map((achievement) => (
                <Card key={achievement.id} className="bg-gradient-to-br from-success/10 to-leaf/10 border-success/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
                      <achievement.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      {achievement.earnedDate && (
                        <p className="text-xs text-success">Earned: {new Date(achievement.earnedDate).toLocaleDateString()}</p>
                      )}
                      <Badge className="mt-2 bg-success text-success-foreground">
                        +{achievement.xp} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* In Progress Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="mr-2 h-6 w-6 text-nature-primary" />
              In Progress ({achievements.filter(a => !a.earned).length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.filter(a => !a.earned).map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <achievement.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      
                      {achievement.progress !== undefined && achievement.required && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.required}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-nature-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.required) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <Badge variant="outline" className="mt-2">
                        {achievement.xp} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;