import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gamepad2, Calculator, Globe, Zap, Trophy, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'quiz',
      title: 'Climate Quiz Challenge',
      description: 'Test your climate knowledge with interactive questions and earn points!',
      icon: Brain,
      difficulty: 'Easy',
      duration: '5-10 min',
      color: 'from-purple-500 to-pink-500',
      features: ['Multiple choice questions', 'Streak bonuses', 'Instant feedback', 'Leaderboard'],
      path: '/game'
    },
    {
      id: 'simulator',
      title: 'Climate Action Simulator',
      description: 'Lead the world as a climate policy maker and save the planet!',
      icon: Globe,
      difficulty: 'Medium',
      duration: '15-30 min',
      color: 'from-blue-500 to-green-500',
      features: ['Strategic decision making', 'Real-time consequences', 'Budget management', 'Multiple scenarios'],
      path: '/climate-simulator'
    },
    {
      id: 'calculator',
      title: 'Carbon Footprint Calculator',
      description: 'Calculate your personal carbon footprint and get personalized tips!',
      icon: Calculator,
      difficulty: 'Easy',
      duration: '3-5 min',
      color: 'from-green-500 to-emerald-400',
      features: ['Personal assessment', 'Lifestyle analysis', 'Custom recommendations', 'Impact comparison'],
      path: '/carbon-calculator'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
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
              <h1 className="text-4xl font-bold mb-2">Climate Games</h1>
              <p className="text-xl opacity-90">Learn through play! Interactive games that make climate science fun and engaging.</p>
            </div>
            <div className="text-center">
              <Gamepad2 className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm opacity-80">Play & Learn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const Icon = game.icon;
            
            return (
              <Card 
                key={game.id}
                className="group transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden"
                onClick={() => navigate(game.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${game.color} text-white group-hover:animate-glow`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {game.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-nature-primary transition-colors">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Game Features:</h4>
                    <ul className="space-y-1">
                      {game.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-nature-primary rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full group-hover:bg-nature-primary group-hover:text-white transition-colors"
                    variant="outline"
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="opacity-60">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Eco Challenge</h3>
                <p className="text-sm text-muted-foreground">Daily environmental challenges and habit tracking</p>
                <Badge variant="outline" className="mt-3">Coming Soon</Badge>
              </CardContent>
            </Card>
            
            <Card className="opacity-60">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Climate Trivia</h3>
                <p className="text-sm text-muted-foreground">Multiplayer trivia battles with friends</p>
                <Badge variant="outline" className="mt-3">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-nature-primary/10 to-nature-secondary/10 border-nature-primary/30">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Play and Learn?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Each game is designed to teach you something new about climate science while having fun. 
                Start with any game that interests you most!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => navigate('/game')} size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Quick Quiz
                </Button>
                <Button onClick={() => navigate('/climate-simulator')} variant="outline" size="lg">
                  <Globe className="mr-2 h-5 w-5" />
                  Climate Simulator
                </Button>
                <Button onClick={() => navigate('/carbon-calculator')} variant="outline" size="lg">
                  <Calculator className="mr-2 h-5 w-5" />
                  Carbon Calculator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Games;