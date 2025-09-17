import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Award, TrendingUp, Target, Book, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();

  const userStats = {
    name: "Climate Learner",
    joinDate: "January 2024",
    totalXP: 1250,
    currentStreak: 7,
    bestStreak: 15,
    lessonsCompleted: 17,
    achievementsEarned: 2,
    averageScore: 87,
    timeSpent: "12 hours",
    level: 3,
    xpToNextLevel: 250,
    currentLevelXP: 750,
    nextLevelXP: 2000
  };

  const recentActivity = [
    { date: "Today", activity: "Completed 'What is Climate Change?'", xp: 50, type: "lesson" },
    { date: "Yesterday", activity: "Earned 'Week Warrior' achievement", xp: 100, type: "achievement" },
    { date: "2 days ago", activity: "Completed 'The Greenhouse Effect'", xp: 75, type: "lesson" },
    { date: "3 days ago", activity: "Started Climate Basics path", xp: 0, type: "milestone" },
    { date: "4 days ago", activity: "Earned 'First Steps' achievement", xp: 50, type: "achievement" },
  ];

  const learningPaths = [
    { name: "Climate Basics", progress: 85, lessons: "8/10" },
    { name: "Renewable Energy", progress: 60, lessons: "6/10" },
    { name: "Waste Management", progress: 30, lessons: "3/10" },
    { name: "Ecosystem Protection", progress: 0, lessons: "0/12" },
  ];

  const levelProgress = ((userStats.currentLevelXP) / userStats.nextLevelXP) * 100;

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
              <h1 className="text-4xl font-bold mb-2">{userStats.name}</h1>
              <p className="text-xl opacity-90">Member since {userStats.joinDate}</p>
              <div className="flex items-center space-x-4 mt-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  Level {userStats.level}
                </Badge>
                <div className="flex items-center text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  {userStats.totalXP.toLocaleString()} XP
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
                    <span className="text-lg font-semibold">Level {userStats.level}</span>
                    <span className="text-sm text-muted-foreground">
                      {userStats.xpToNextLevel} XP to Level {userStats.level + 1}
                    </span>
                  </div>
                  <Progress value={levelProgress} className="h-3" />
                  <div className="text-sm text-muted-foreground text-center">
                    {userStats.currentLevelXP} / {userStats.nextLevelXP} XP
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Path Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Learning Path Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPaths.map((path, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{path.name}</span>
                        <span className="text-sm text-muted-foreground">{path.lessons}</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  ))}
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
                    <span className="font-semibold">{userStats.currentStreak} days</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Streak</span>
                  <span className="font-semibold">{userStats.bestStreak} days</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lessons Completed</span>
                  <span className="font-semibold">{userStats.lessonsCompleted}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Achievements</span>
                  <span className="font-semibold">{userStats.achievementsEarned}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-semibold">{userStats.averageScore}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time Spent</span>
                  <span className="font-semibold">{userStats.timeSpent}</span>
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