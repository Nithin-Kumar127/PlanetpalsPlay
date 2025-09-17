import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Medal, Award, Crown, Zap, BookOpen, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  xp: number;
  lessonsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  joinDate: string;
  level: number;
  achievements: number;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentUserStats, setCurrentUserStats] = useState<LeaderboardUser | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    // Get current user's completed lessons
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons') || '[]');
    
    // Create current user stats
    const userStats: LeaderboardUser = {
      id: user?.id || '1',
      name: user?.user_metadata?.name || 'Climate Learner',
      email: user?.email || 'you@example.com',
      xp: 1250 + (completedLessons.length * 100), // Base XP + lesson XP
      lessonsCompleted: completedLessons.length,
      currentStreak: 7,
      bestStreak: 15,
      joinDate: '2024-01-15',
      level: Math.floor((1250 + (completedLessons.length * 100)) / 500) + 1,
      achievements: completedLessons.length >= 1 ? (completedLessons.length >= 5 ? 3 : 2) : 1
    };

    setCurrentUserStats(userStats);

    // Generate mock leaderboard data with realistic progression
    const mockUsers: LeaderboardUser[] = [
      {
        id: '2',
        name: 'EcoChampion Sarah',
        email: 'sarah@example.com',
        xp: 2850,
        lessonsCompleted: 25,
        currentStreak: 21,
        bestStreak: 45,
        joinDate: '2023-11-20',
        level: 6,
        achievements: 8
      },
      {
        id: '3',
        name: 'GreenWarrior Mike',
        email: 'mike@example.com',
        xp: 2650,
        lessonsCompleted: 22,
        currentStreak: 14,
        bestStreak: 28,
        joinDate: '2023-12-05',
        level: 6,
        achievements: 7
      },
      {
        id: '4',
        name: 'ClimateHero Alex',
        email: 'alex@example.com',
        xp: 2400,
        lessonsCompleted: 20,
        currentStreak: 18,
        bestStreak: 35,
        joinDate: '2024-01-02',
        level: 5,
        achievements: 6
      },
      {
        id: '5',
        name: 'EarthDefender Emma',
        email: 'emma@example.com',
        xp: 2100,
        lessonsCompleted: 18,
        currentStreak: 12,
        bestStreak: 22,
        joinDate: '2024-01-08',
        level: 5,
        achievements: 5
      },
      {
        id: '6',
        name: 'SustainabilityPro Jake',
        email: 'jake@example.com',
        xp: 1950,
        lessonsCompleted: 16,
        currentStreak: 9,
        bestStreak: 19,
        joinDate: '2024-01-12',
        level: 4,
        achievements: 4
      },
      userStats, // Insert current user
      {
        id: '7',
        name: 'GreenThumb Lisa',
        email: 'lisa@example.com',
        xp: 1150,
        lessonsCompleted: 12,
        currentStreak: 5,
        bestStreak: 16,
        joinDate: '2024-01-18',
        level: 3,
        achievements: 3
      },
      {
        id: '8',
        name: 'EcoNewbie Tom',
        email: 'tom@example.com',
        xp: 950,
        lessonsCompleted: 8,
        currentStreak: 3,
        bestStreak: 8,
        joinDate: '2024-01-25',
        level: 2,
        achievements: 2
      },
      {
        id: '9',
        name: 'ClimateStudent Amy',
        email: 'amy@example.com',
        xp: 750,
        lessonsCompleted: 6,
        currentStreak: 2,
        bestStreak: 5,
        joinDate: '2024-02-01',
        level: 2,
        achievements: 1
      },
      {
        id: '10',
        name: 'GreenBeginner Sam',
        email: 'sam@example.com',
        xp: 450,
        lessonsCompleted: 3,
        currentStreak: 1,
        bestStreak: 3,
        joinDate: '2024-02-05',
        level: 1,
        achievements: 1
      }
    ];

    setLeaderboardData(mockUsers);
  }, [user]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3: return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default: return "bg-muted";
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sortedByXP = [...leaderboardData].sort((a, b) => b.xp - a.xp);
  const sortedByLessons = [...leaderboardData].sort((a, b) => b.lessonsCompleted - a.lessonsCompleted);
  const sortedByStreak = [...leaderboardData].sort((a, b) => b.currentStreak - a.currentStreak);

  const currentUserRankXP = sortedByXP.findIndex(u => u.id === currentUserStats?.id) + 1;
  const currentUserRankLessons = sortedByLessons.findIndex(u => u.id === currentUserStats?.id) + 1;
  const currentUserRankStreak = sortedByStreak.findIndex(u => u.id === currentUserStats?.id) + 1;

  const renderLeaderboardList = (users: LeaderboardUser[], currentUserRank: number) => (
    <div className="space-y-3">
      {users.map((user, index) => {
        const rank = index + 1;
        const isCurrentUser = user.id === currentUserStats?.id;
        
        return (
          <Card 
            key={user.id} 
            className={`transition-all duration-300 hover:shadow-md ${
              isCurrentUser ? 'ring-2 ring-nature-primary bg-nature-primary/5' : ''
            } ${rank <= 3 ? 'border-2' : ''} ${
              rank === 1 ? 'border-yellow-400' : 
              rank === 2 ? 'border-gray-400' : 
              rank === 3 ? 'border-amber-400' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankColor(rank)}`}>
                    {rank <= 3 ? getRankIcon(rank) : getRankIcon(rank)}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-nature-primary text-white text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${isCurrentUser ? 'text-nature-primary' : ''}`}>
                          {user.name}
                        </h3>
                        {isCurrentUser && <Badge className="bg-nature-primary text-white">You</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">Level {user.level}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-nature-primary" />
                      <span className="font-semibold">{user.xp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-accent" />
                      <span>{user.lessonsCompleted}</span>
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1 text-orange-500" />
                      <span>{user.currentStreak}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

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
              <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
              <p className="text-xl opacity-90">See how you rank among fellow climate learners!</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm opacity-80">Compete & Learn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Stats */}
      {currentUserStats && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="mb-8 bg-gradient-to-r from-nature-primary/10 to-nature-secondary/10 border-nature-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-nature-primary" />
                Your Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-nature-primary">#{currentUserRankXP}</div>
                  <p className="text-sm text-muted-foreground">XP Ranking</p>
                  <p className="text-lg font-semibold">{currentUserStats.xp.toLocaleString()} XP</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">#{currentUserRankLessons}</div>
                  <p className="text-sm text-muted-foreground">Lessons Ranking</p>
                  <p className="text-lg font-semibold">{currentUserStats.lessonsCompleted} Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">#{currentUserRankStreak}</div>
                  <p className="text-sm text-muted-foreground">Streak Ranking</p>
                  <p className="text-lg font-semibold">{currentUserStats.currentStreak} Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Tabs */}
          <Tabs defaultValue="xp" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="xp" className="flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                XP Leaders
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Lesson Masters
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center">
                <Flame className="mr-2 h-4 w-4" />
                Streak Champions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="xp" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Top Learners by Experience Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(sortedByXP, currentUserRankXP)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lessons" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Top Learners by Lessons Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(sortedByLessons, currentUserRankLessons)}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="streak" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="mr-2 h-5 w-5" />
                    Top Learners by Learning Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(sortedByStreak, currentUserRankStreak)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;