import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Car, Home, Utensils, Plane, Award, RotateCcw, Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useLearning } from "@/contexts/LearningContext";

interface CarbonData {
  transport: number;
  energy: number;
  food: number;
  flights: number;
}

interface GameState {
  started: boolean;
  currentCategory: number;
  carbonData: CarbonData;
  totalFootprint: number;
  completed: boolean;
  score: number;
  recommendations: string[];
}

const CarbonCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateGameScore } = useLearning();

  const [gameState, setGameState] = useState<GameState>({
    started: false,
    currentCategory: 0,
    carbonData: { transport: 0, energy: 0, food: 0, flights: 0 },
    totalFootprint: 0,
    completed: false,
    score: 0,
    recommendations: []
  });

  const categories = [
    {
      id: 'transport',
      title: 'Transportation',
      icon: Car,
      question: 'How many kilometers do you drive per week?',
      unit: 'km/week',
      max: 500,
      factor: 0.21, // kg CO2 per km
      tips: [
        'Use public transport or bike when possible',
        'Consider carpooling or ride-sharing',
        'Work from home when you can',
        'Choose fuel-efficient vehicles'
      ]
    },
    {
      id: 'energy',
      title: 'Home Energy',
      icon: Home,
      question: 'What is your monthly electricity bill?',
      unit: '$/month',
      max: 300,
      factor: 0.5, // kg CO2 per dollar (approximate)
      tips: [
        'Switch to LED light bulbs',
        'Unplug devices when not in use',
        'Use energy-efficient appliances',
        'Consider renewable energy sources'
      ]
    },
    {
      id: 'food',
      title: 'Food & Diet',
      icon: Utensils,
      question: 'How many meat meals do you eat per week?',
      unit: 'meals/week',
      max: 21,
      factor: 3.3, // kg CO2 per meat meal
      tips: [
        'Try plant-based meals 2-3 times per week',
        'Buy local and seasonal produce',
        'Reduce food waste',
        'Choose sustainable seafood'
      ]
    },
    {
      id: 'flights',
      title: 'Air Travel',
      icon: Plane,
      question: 'How many flights do you take per year?',
      unit: 'flights/year',
      max: 20,
      factor: 500, // kg CO2 per flight (average)
      tips: [
        'Choose direct flights when possible',
        'Consider train travel for shorter distances',
        'Offset your flights through verified programs',
        'Combine business trips when possible'
      ]
    }
  ];

  const startGame = () => {
    setGameState(prev => ({ ...prev, started: true, currentCategory: 0 }));
  };

  const updateCarbonData = (value: number[]) => {
    const currentCat = categories[gameState.currentCategory];
    setGameState(prev => ({
      ...prev,
      carbonData: {
        ...prev.carbonData,
        [currentCat.id]: value[0]
      }
    }));
  };

  const nextCategory = () => {
    if (gameState.currentCategory < categories.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentCategory: prev.currentCategory + 1
      }));
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const { carbonData } = gameState;
    
    // Calculate total footprint
    const transportFootprint = carbonData.transport * categories[0].factor * 52; // yearly
    const energyFootprint = carbonData.energy * categories[1].factor * 12; // yearly
    const foodFootprint = carbonData.food * categories[2].factor * 52; // yearly
    const flightFootprint = carbonData.flights * categories[3].factor; // yearly
    
    const total = transportFootprint + energyFootprint + foodFootprint + flightFootprint;
    
    // Calculate score (lower footprint = higher score)
    const globalAverage = 4000; // kg CO2 per year
    const score = Math.max(0, Math.round((globalAverage - total) / globalAverage * 100));
    
    // Award XP based on how eco-friendly the footprint is
    const xpEarned = Math.max(10, Math.floor(score / 2));
    updateGameScore('Carbon Calculator', score, xpEarned);
    
    // Generate recommendations
    const recommendations = [];
    if (transportFootprint > 1000) recommendations.push(...categories[0].tips.slice(0, 2));
    if (energyFootprint > 800) recommendations.push(...categories[1].tips.slice(0, 2));
    if (foodFootprint > 1200) recommendations.push(...categories[2].tips.slice(0, 2));
    if (flightFootprint > 1000) recommendations.push(...categories[3].tips.slice(0, 2));
    
    setGameState(prev => ({
      ...prev,
      totalFootprint: Math.round(total),
      score,
      recommendations,
      completed: true
    }));

    toast({
      title: "Carbon Footprint Calculated!",
      description: `Your annual footprint: ${Math.round(total)} kg CO2`,
    });
  };

  const resetGame = () => {
    setGameState({
      started: false,
      currentCategory: 0,
      carbonData: { transport: 0, energy: 0, food: 0, flights: 0 },
      totalFootprint: 0,
      completed: false,
      score: 0,
      recommendations: []
    });
  };

  const getFootprintRating = (footprint: number) => {
    if (footprint <= 2000) return { rating: "Eco Champion! 🌱", color: "text-success", description: "Your footprint is well below average!" };
    if (footprint <= 4000) return { rating: "Climate Conscious 🌍", color: "text-nature-primary", description: "You're doing better than average!" };
    if (footprint <= 6000) return { rating: "Room for Improvement 📈", color: "text-warning", description: "There's potential to reduce your impact." };
    return { rating: "High Impact ⚠️", color: "text-destructive", description: "Consider making some changes to reduce your footprint." };
  };

  if (!gameState.started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
            <h1 className="text-4xl font-bold mb-2">Carbon Footprint Calculator</h1>
            <p className="text-xl opacity-90">Discover your environmental impact and learn how to reduce it!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl flex items-center justify-center">
                <Calculator className="mr-2 h-6 w-6" />
                Calculate Your Carbon Footprint
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Learn about your environmental impact by calculating your personal carbon footprint across different lifestyle categories.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🎯 What You'll Learn:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Your annual CO2 emissions</li>
                    <li>• How you compare to global averages</li>
                    <li>• Which activities impact the environment most</li>
                    <li>• Personalized tips to reduce your footprint</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">📊 Categories We'll Cover:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• 🚗 Transportation & commuting</li>
                    <li>• 🏠 Home energy consumption</li>
                    <li>• 🍽️ Food choices & diet</li>
                    <li>• ✈️ Air travel & flights</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Did you know?</strong> The average person produces about 4 tons of CO2 per year. 
                  Let's see how you compare and find ways to make a positive impact!
                </p>
              </div>

              <Button 
                size="lg" 
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600"
              >
                Start Calculating 🌱
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.completed) {
    const { rating, color, description } = getFootprintRating(gameState.totalFootprint);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
            <h1 className="text-2xl font-bold">Your Carbon Footprint Results</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Calculation Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-4xl font-bold text-green-600">{gameState.totalFootprint}</p>
                <p className="text-muted-foreground">kg CO2 per year</p>
              </div>
              
              <div className={`text-xl font-semibold ${color}`}>
                {rating}
              </div>
              
              <p className="text-muted-foreground">{description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {categories.map((cat, index) => {
                  const Icon = cat.icon;
                  const value = Object.values(gameState.carbonData)[index];
                  const footprint = Math.round(value * cat.factor * (cat.id === 'flights' ? 1 : cat.id === 'energy' ? 12 : 52));
                  
                  return (
                    <div key={cat.id} className="space-y-1">
                      <Icon className="h-5 w-5 mx-auto text-green-600" />
                      <p className="font-semibold">{cat.title}</p>
                      <p className="text-muted-foreground">{footprint} kg CO2</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {gameState.recommendations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-green-600" />
                  Personalized Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameState.recommendations.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button onClick={resetGame} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Calculate Again
            </Button>
            <Button onClick={() => navigate("/games")} className="flex-1">
              More Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game in progress
  const currentCat = categories[gameState.currentCategory];
  const Icon = currentCat.icon;
  const progress = ((gameState.currentCategory + 1) / categories.length) * 100;
  const currentValue = Object.values(gameState.carbonData)[gameState.currentCategory];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-green-500 to-emerald-400 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Calculator
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Carbon Calculator</h1>
              <p className="text-sm opacity-80">Step {gameState.currentCategory + 1} of {categories.length}</p>
            </div>
            <div className="w-24" /> {/* Spacer */}
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{currentCat.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">{currentCat.question}</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-green-600">{currentValue}</span>
                  <span className="text-muted-foreground ml-2">{currentCat.unit}</span>
                </div>
                <Slider
                  value={[currentValue]}
                  onValueChange={updateCarbonData}
                  max={currentCat.max}
                  step={currentCat.max / 100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span>{currentCat.max} {currentCat.unit}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-center">
                <strong>Estimated CO2:</strong> {Math.round(currentValue * currentCat.factor * (currentCat.id === 'flights' ? 1 : currentCat.id === 'energy' ? 12 : 52))} kg per year
              </p>
            </div>

            <Button onClick={nextCategory} className="w-full" size="lg">
              {gameState.currentCategory < categories.length - 1 ? 'Next Category' : 'Calculate Results'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonCalculator;