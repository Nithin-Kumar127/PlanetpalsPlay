import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Award, TrendingUp, Target, Book, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLearning } from "@/contexts/LearningContext";

const Profile = () => {
  const navigate = useNavigate();
  const { userProfile, userAchievements, achievements, loading } = useLearning();

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nature-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const currentLevelXP = (userProfile.current_level - 1) * 500;
  const nextLevelXP = userProfile.current_level * 500;
  const xpToNextLevel = nextLevelXP - userProfile.total_xp;
  const levelProgress = ((userProfile.total_xp - currentLevelXP) / 500) * 100;
  const recentActivity = [
    { date: "Today", activity: "Completed lesson", xp: 50, type: "lesson" },
    { date: "Yesterday", activity: "Earned achievement", xp: 100, type: "achievement" },
    { date: "2 days ago", activity: "Completed lesson", xp: 75, type: "lesson" },
    { date: "3 days ago", activity: "Started learning path", xp: 0, type: "milestone" },
  ];


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
          <div className="flex items-center space-x-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                CL
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">{userProfile.name || 'Climate Learner'}</h1>
              <p className="text-xl opacity-90">Member since {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  Level {userProfile.current_level}
                </Badge>
                <div className="flex items-center text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  {userProfile.total_xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Level {userProfile.current_level}</span>
                    <span className="text-sm text-muted-foreground">
                      {xpToNextLevel} XP to Level {userProfile.current_level + 1}
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                  <div className="text-sm text-muted-foreground text-center">
                    {userProfile.total_xp - currentLevelXP} / 500 XP
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'lesson' ? 'bg-nature-primary/20 text-nature-primary' :
                          activity.type === 'achievement' ? 'bg-success/20 text-success' :
                          'bg-accent/20 text-accent'
                        }`}>
                          {activity.type === 'lesson' && <Book className="h-4 w-4" />}
                          {activity.type === 'achievement' && <Award className="h-4 w-4" />}
                          {activity.type === 'milestone' && <Target className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                      {activity.xp > 0 && (
                        <Badge variant="outline">+{activity.xp} XP</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Streak</span>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="font-semibold">{userProfile.current_streak} days</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Streak</span>
                  <span className="font-semibold">{userProfile.best_streak} days</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lessons Completed</span>
                  <span className="font-semibold">{userProfile.lessons_completed}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Achievements</span>
                  <span className="font-semibold">{userProfile.achievements_earned}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/achievements")}
                >
                  View All Achievements
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;