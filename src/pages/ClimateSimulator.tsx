import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap, Droplets, TreePine, Factory, Car, Home, Recycle, Sun, Wind, Leaf, TrendingUp, TrendingDown, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  year: number;
  co2Level: number;
  temperature: number;
  budget: number;
  population: number;
  happiness: number;
  renewableEnergy: number;
  forestCover: number;
  pollution: number;
  gameOver: boolean;
  score: number;
}

interface Action {
  id: string;
  name: string;
  description: string;
  icon: any;
  cost: number;
  effects: {
    co2?: number;
    temperature?: number;
    budget?: number;
    happiness?: number;
    renewableEnergy?: number;
    forestCover?: number;
    pollution?: number;
  };
  category: 'energy' | 'transport' | 'environment' | 'policy';
}

const ClimateSimulator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<GameState>({
    year: 2024,
    co2Level: 420, // ppm
    temperature: 1.2, // degrees above pre-industrial
    budget: 1000,
    population: 100,
    happiness: 75,
    renewableEnergy: 30,
    forestCover: 60,
    pollution: 40,
    gameOver: false,
    score: 0
  });

  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const actions: Action[] = [
    {
      id: 'solar_farm',
      name: 'Build Solar Farm',
      description: 'Construct a large solar energy facility',
      icon: Sun,
      cost: 200,
      effects: { co2: -15, renewableEnergy: 10, budget: -200, happiness: 5 },
      category: 'energy'
    },
    {
      id: 'wind_turbines',
      name: 'Install Wind Turbines',
      description: 'Set up wind energy generation',
      icon: Wind,
      cost: 150,
      effects: { co2: -12, renewableEnergy: 8, budget: -150, happiness: 3 },
      category: 'energy'
    },
    {
      id: 'plant_forest',
      name: 'Plant Forest',
      description: 'Large-scale reforestation project',
      icon: TreePine,
      cost: 100,
      effects: { co2: -20, forestCover: 15, budget: -100, happiness: 8, pollution: -5 },
      category: 'environment'
    },
    {
      id: 'electric_buses',
      name: 'Electric Public Transport',
      description: 'Replace buses with electric vehicles',
      icon: Car,
      cost: 120,
      effects: { co2: -10, pollution: -8, budget: -120, happiness: 6 },
      category: 'transport'
    },
    {
      id: 'green_buildings',
      name: 'Green Building Standards',
      description: 'Implement energy-efficient building codes',
      icon: Home,
      cost: 80,
      effects: { co2: -8, budget: -80, happiness: 4, pollution: -3 },
      category: 'policy'
    },
    {
      id: 'recycling_program',
      name: 'City-wide Recycling',
      description: 'Comprehensive waste recycling initiative',
      icon: Recycle,
      cost: 60,
      effects: { pollution: -10, budget: -60, happiness: 7, co2: -5 },
      category: 'environment'
    },
    {
      id: 'carbon_tax',
      name: 'Carbon Tax Policy',
      description: 'Tax carbon emissions to fund green projects',
      icon: Factory,
      cost: 0,
      effects: { co2: -25, budget: 150, happiness: -10, pollution: -15 },
      category: 'policy'
    },
    {
      id: 'green_research',
      name: 'Green Tech Research',
      description: 'Invest in clean technology development',
      icon: Zap,
      cost: 180,
      effects: { co2: -5, renewableEnergy: 5, budget: -180, happiness: 3 },
      category: 'energy'
    }
  ];

  useEffect(() => {
    if (autoPlay && gameStarted && !gameState.gameOver) {
      const timer = setTimeout(() => {
        advanceYear();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, gameStarted, gameState]);

  const executeAction = (action: Action) => {
    if (action.cost > gameState.budget) {
      toast({
        title: "Insufficient Budget!",
        description: `You need $${action.cost}M but only have $${gameState.budget}M`,
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => {
      const newState = { ...prev };
      
      // Apply effects
      Object.entries(action.effects).forEach(([key, value]) => {
        if (key in newState && value !== undefined) {
          (newState as any)[key] = Math.max(0, Math.min(100, (newState as any)[key] + value));
        }
      });

      // Special handling for CO2 and temperature
      if (action.effects.co2) {
        newState.co2Level = Math.max(350, newState.co2Level + action.effects.co2);
      }
      if (action.effects.temperature) {
        newState.temperature = Math.max(0, newState.temperature + action.effects.temperature);
      }
      if (action.effects.budget) {
        newState.budget = Math.max(0, newState.budget + action.effects.budget);
      }

      newState.score += Math.abs(action.effects.co2 || 0) * 10;

      return newState;
    });

    toast({
      title: "Action Implemented!",
      description: `${action.name} has been successfully implemented.`,
    });

    setSelectedAction(null);
  };

  const advanceYear = () => {
    setGameState(prev => {
      const newState = { ...prev };
      newState.year += 1;
      
      // Natural progression
      newState.co2Level += Math.random() * 3 + 1; // CO2 naturally increases
      newState.temperature += (newState.co2Level - 420) * 0.001; // Temperature follows CO2
      newState.budget += 100 + Math.random() * 50; // Annual budget
      newState.pollution += Math.random() * 2; // Pollution increases
      
      // Renewable energy affects CO2
      const renewableEffect = (newState.renewableEnergy - 30) * 0.5;
      newState.co2Level -= renewableEffect;
      
      // Forest cover affects CO2
      const forestEffect = (newState.forestCover - 60) * 0.3;
      newState.co2Level -= forestEffect;
      
      // Check win/lose conditions
      if (newState.temperature >= 2.5) {
        newState.gameOver = true;
        toast({
          title: "Game Over!",
          description: "Global temperature rise exceeded 2.5°C. Climate crisis reached!",
          variant: "destructive"
        });
      } else if (newState.year >= 2050 && newState.temperature <= 1.5) {
        newState.gameOver = true;
        newState.score += 1000;
        toast({
          title: "Victory!",
          description: "You successfully kept global warming under 1.5°C by 2050!",
        });
      }

      // Ensure values stay in bounds
      newState.co2Level = Math.max(350, Math.min(500, newState.co2Level));
      newState.temperature = Math.max(0, Math.min(3, newState.temperature));
      newState.happiness = Math.max(0, Math.min(100, newState.happiness));
      newState.pollution = Math.max(0, Math.min(100, newState.pollution));
      newState.forestCover = Math.max(0, Math.min(100, newState.forestCover));
      newState.renewableEnergy = Math.max(0, Math.min(100, newState.renewableEnergy));

      return newState;
    });
  };

  const resetGame = () => {
    setGameState({
      year: 2024,
      co2Level: 420,
      temperature: 1.2,
      budget: 1000,
      population: 100,
      happiness: 75,
      renewableEnergy: 30,
      forestCover: 60,
      pollution: 40,
      gameOver: false,
      score: 0
    });
    setGameStarted(false);
    setAutoPlay(false);
    setSelectedAction(null);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 1.5) return "text-success";
    if (temp <= 2.0) return "text-warning";
    return "text-destructive";
  };

  const getCO2Color = (co2: number) => {
    if (co2 <= 400) return "text-success";
    if (co2 <= 450) return "text-warning";
    return "text-destructive";
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">Climate Action Simulator</h1>
            <p className="text-xl opacity-90">Lead the world to prevent climate catastrophe!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">🌍 Save Our Planet</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                You are the global climate leader. Make strategic decisions to keep global warming under 1.5°C by 2050!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🎯 Your Mission:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Keep global temperature rise under 1.5°C</li>
                    <li>• Manage your budget wisely</li>
                    <li>• Balance environmental and social needs</li>
                    <li>• Reach 2050 without climate catastrophe</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🛠️ Available Actions:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Build renewable energy infrastructure</li>
                    <li>• Implement environmental policies</li>
                    <li>• Invest in green transportation</li>
                    <li>• Protect and restore ecosystems</li>
                  </ul>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={() => setGameStarted(true)}
                className="bg-nature-primary hover:bg-nature-primary/90"
              >
                Start Climate Mission 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Simulator
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Climate Action Simulator</h1>
              <p className="text-sm opacity-80">Year {gameState.year} • Score: {gameState.score}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {autoPlay ? "Pause" : "Auto Play"}
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={resetGame}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Status Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getTemperatureColor(gameState.temperature)}`}>
                +{gameState.temperature.toFixed(1)}°C
              </div>
              <p className="text-sm text-muted-foreground">Temperature Rise</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getCO2Color(gameState.co2Level)}`}>
                {Math.round(gameState.co2Level)} ppm
              </div>
              <p className="text-sm text-muted-foreground">CO₂ Level</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-nature-primary">
                ${gameState.budget}M
              </div>
              <p className="text-sm text-muted-foreground">Budget</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {Math.round(gameState.happiness)}%
              </div>
              <p className="text-sm text-muted-foreground">Happiness</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Renewable Energy</span>
                <span className="text-sm">{Math.round(gameState.renewableEnergy)}%</span>
              </div>
              <Progress value={gameState.renewableEnergy} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Forest Cover</span>
                <span className="text-sm">{Math.round(gameState.forestCover)}%</span>
              </div>
              <Progress value={gameState.forestCover} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pollution Level</span>
                <span className="text-sm">{Math.round(gameState.pollution)}%</span>
              </div>
              <Progress value={100 - gameState.pollution} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Available Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {actions.map((action) => {
                const Icon = action.icon;
                const canAfford = gameState.budget >= action.cost;
                
                return (
                  <Card 
                    key={action.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      canAfford ? 'hover:shadow-md hover:scale-105' : 'opacity-50'
                    } ${selectedAction?.id === action.id ? 'ring-2 ring-nature-primary' : ''}`}
                    onClick={() => canAfford && setSelectedAction(action)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 rounded-lg bg-nature-primary/10">
                          <Icon className="h-4 w-4 text-nature-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{action.name}</h3>
                          <p className="text-xs text-muted-foreground">${action.cost}M</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Action Details</h2>
            {selectedAction ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <selectedAction.icon className="mr-2 h-5 w-5" />
                    {selectedAction.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{selectedAction.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Effects:</h4>
                    {Object.entries(selectedAction.effects).map(([key, value]) => {
                      if (value === 0) return null;
                      const isPositive = value > 0;
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      
                      return (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span>{label}:</span>
                          <span className={isPositive ? 'text-success' : 'text-destructive'}>
                            {isPositive ? '+' : ''}{value}
                            {key.includes('budget') ? 'M' : key.includes('temperature') ? '°C' : key.includes('co2') ? ' ppm' : '%'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => executeAction(selectedAction)}
                      disabled={gameState.budget < selectedAction.cost || gameState.gameOver}
                      className="flex-1"
                    >
                      Implement Action
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedAction(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Select an action to see its effects and implement it.</p>
                </CardContent>
              </Card>
            )}

            <div className="mt-4">
              <Button 
                onClick={advanceYear}
                disabled={gameState.gameOver}
                className="w-full"
                variant="outline"
              >
                Advance to {gameState.year + 1} →
              </Button>
            </div>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameState.gameOver && (
          <Card className="mt-6 border-2 border-destructive">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                {gameState.temperature >= 2.5 ? (
                  <>
                    <h2 className="text-2xl font-bold text-destructive">Climate Crisis! 🌡️</h2>
                    <p>Global temperature rise exceeded 2.5°C. The world faces severe climate impacts.</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-success">Mission Accomplished! 🎉</h2>
                    <p>You successfully kept global warming under control and saved the planet!</p>
                  </>
                )}
                <div className="flex justify-center space-x-4">
                  <Badge variant="outline">Final Score: {gameState.score}</Badge>
                  <Badge variant="outline">Year Reached: {gameState.year}</Badge>
                  <Badge variant="outline">Temperature: +{gameState.temperature.toFixed(1)}°C</Badge>
                </div>
                <Button onClick={resetGame} className="mt-4">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClimateSimulator;