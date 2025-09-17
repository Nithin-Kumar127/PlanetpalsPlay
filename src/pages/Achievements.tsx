import { useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Zap, Globe, BookOpen, Target, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useLearning } from "@/contexts/LearningContext";

const Achievements = () => {
  const navigate = useNavigate();
  const { 
    achievements, 
    userAchievements, 
    lessonsCompleted, 
    loading 
  } = useLearning();

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

  const totalEarned = userAchievements.length;
  const totalXP = userAchievements.reduce((sum, ua) => sum + (ua.achievement?.xp_reward || 0), 0);
  
  // Map icon names to actual icons
  const iconMap: { [key: string]: any } = {
    BookOpen,
    Flame,
    Globe,
    Zap,
    Star,
    Target,
    Award
  };
  
  const getProgress = (achievement: Achievement) => {
    const criteria = achievement.criteria;
    switch (criteria.type) {
      case 'lessons_completed':
        return Math.min(lessonsCompleted, criteria.count);
      case 'streak':
        return 0; // Would need current streak from profile
      default:
        return 0;
    }
  };

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
              Earned Achievements ({userAchievements.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {userAchievements.map((userAchievement) => {
                const achievement = userAchievement.achievement!;
                const Icon = iconMap[achievement.icon] || Award;
                
                return (
                <Card key={userAchievement.id} className="bg-gradient-to-br from-success/10 to-leaf/10 border-success/30">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <p className="text-xs text-success">Earned: {new Date(userAchievement.earned_at).toLocaleDateString()}</p>
                      <Badge className="mt-2 bg-success text-success-foreground">
                        +{achievement.xp_reward} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>

          {/* In Progress Achievements */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Target className="mr-2 h-6 w-6 text-nature-primary" />
              In Progress ({achievements.filter(a => !userAchievements.some(ua => ua.achievement_id === a.id)).length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.filter(a => !userAchievements.some(ua => ua.achievement_id === a.id)).map((achievement) => {
                const Icon = iconMap[achievement.icon] || Award;
                const progress = getProgress(achievement);
                const required = achievement.criteria.count || 1;
                
                return (
                <Card key={achievement.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                      
                      {progress !== undefined && required && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress}/{required}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-nature-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(progress / required) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <Badge variant="outline" className="mt-2">
                        {achievement.xp_reward} XP
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;