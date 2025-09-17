import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Zap, CheckCircle, X, RotateCcw, Star, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface GameItem {
  id: string;
  name: string;
  category: 'renewable' | 'fossil' | 'waste' | 'recycle' | 'transport' | 'nature';
  image: string;
  description: string;
}

interface DropZone {
  id: string;
  category: 'renewable' | 'fossil' | 'waste' | 'recycle' | 'transport' | 'nature';
  name: string;
  color: string;
  items: GameItem[];
}

interface GameState {
  level: number;
  score: number;
  timeLeft: number;
  gameStarted: boolean;
  gameOver: boolean;
  currentItems: GameItem[];
  dropZones: DropZone[];
  draggedItem: GameItem | null;
  correctMatches: number;
  totalItems: number;
  streak: number;
  lives: number;
}

const EcoMatchGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dragRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    score: 0,
    timeLeft: 60,
    gameStarted: false,
    gameOver: false,
    currentItems: [],
    dropZones: [],
    draggedItem: null,
    correctMatches: 0,
    totalItems: 0,
    streak: 0,
    lives: 3
  });

  // Game items with emoji representations (since we can't use actual images)
  const allGameItems: GameItem[] = [
    // Renewable Energy
    { id: 'solar1', name: 'Solar Panel', category: 'renewable', image: '☀️', description: 'Clean solar energy' },
    { id: 'wind1', name: 'Wind Turbine', category: 'renewable', image: '💨', description: 'Wind power generation' },
    { id: 'hydro1', name: 'Hydroelectric Dam', category: 'renewable', image: '🌊', description: 'Water-powered energy' },
    { id: 'geo1', name: 'Geothermal Plant', category: 'renewable', image: '🌋', description: 'Earth heat energy' },
    
    // Fossil Fuels
    { id: 'coal1', name: 'Coal Plant', category: 'fossil', image: '🏭', description: 'Coal burning facility' },
    { id: 'oil1', name: 'Oil Rig', category: 'fossil', image: '🛢️', description: 'Oil extraction' },
    { id: 'gas1', name: 'Gas Station', category: 'fossil', image: '⛽', description: 'Fossil fuel station' },
    { id: 'smoke1', name: 'Smokestack', category: 'fossil', image: '🏭', description: 'Industrial emissions' },
    
    // Waste
    { id: 'trash1', name: 'Garbage Bag', category: 'waste', image: '🗑️', description: 'General waste' },
    { id: 'plastic1', name: 'Plastic Bottle', category: 'waste', image: '🍼', description: 'Plastic waste' },
    { id: 'food1', name: 'Food Scraps', category: 'waste', image: '🍎', description: 'Organic waste' },
    { id: 'toxic1', name: 'Chemical Waste', category: 'waste', image: '☢️', description: 'Hazardous materials' },
    
    // Recyclable
    { id: 'paper1', name: 'Newspaper', category: 'recycle', image: '📰', description: 'Recyclable paper' },
    { id: 'can1', name: 'Aluminum Can', category: 'recycle', image: '🥤', description: 'Metal recycling' },
    { id: 'glass1', name: 'Glass Bottle', category: 'recycle', image: '🍾', description: 'Glass recycling' },
    { id: 'cardboard1', name: 'Cardboard Box', category: 'recycle', image: '📦', description: 'Cardboard recycling' },
    
    // Transport
    { id: 'bike1', name: 'Bicycle', category: 'transport', image: '🚲', description: 'Eco-friendly transport' },
    { id: 'bus1', name: 'Electric Bus', category: 'transport', image: '🚌', description: 'Public transport' },
    { id: 'car1', name: 'Electric Car', category: 'transport', image: '🚗', description: 'Clean vehicle' },
    { id: 'train1', name: 'Electric Train', category: 'transport', image: '🚊', description: 'Rail transport' },
    
    // Nature
    { id: 'tree1', name: 'Tree', category: 'nature', image: '🌳', description: 'Carbon absorption' },
    { id: 'flower1', name: 'Flower', category: 'nature', image: '🌸', description: 'Biodiversity' },
    { id: 'leaf1', name: 'Leaf', category: 'nature', image: '🍃', description: 'Natural ecosystem' },
    { id: 'earth1', name: 'Earth', category: 'nature', image: '🌍', description: 'Our planet' },
  ];

  const dropZoneConfigs: Omit<DropZone, 'items'>[] = [
    { id: 'renewable', category: 'renewable', name: 'Renewable Energy', color: 'bg-green-500' },
    { id: 'fossil', category: 'fossil', name: 'Fossil Fuels', color: 'bg-red-500' },
    { id: 'waste', category: 'waste', name: 'Waste', color: 'bg-gray-500' },
    { id: 'recycle', category: 'recycle', name: 'Recyclable', color: 'bg-blue-500' },
    { id: 'transport', category: 'transport', name: 'Clean Transport', color: 'bg-purple-500' },
    { id: 'nature', category: 'nature', name: 'Nature', color: 'bg-emerald-500' },
  ];

  useEffect(() => {
    if (gameState.gameStarted && gameState.timeLeft > 0 && !gameState.gameOver) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && !gameState.gameOver) {
      endGame();
    }
  }, [gameState.timeLeft, gameState.gameStarted, gameState.gameOver]);

  const startGame = () => {
    const itemsPerLevel = Math.min(8 + (gameState.level - 1) * 2, 16);
    const shuffledItems = [...allGameItems].sort(() => Math.random() - 0.5).slice(0, itemsPerLevel);
    
    const initialDropZones = dropZoneConfigs.map(config => ({
      ...config,
      items: []
    }));

    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      gameOver: false,
      currentItems: shuffledItems,
      dropZones: initialDropZones,
      totalItems: shuffledItems.length,
      correctMatches: 0,
      timeLeft: 60 + (gameState.level - 1) * 10,
      lives: 3,
      streak: 0
    }));
  };

  const handleDragStart = (e: React.DragEvent, item: GameItem) => {
    setGameState(prev => ({ ...prev, draggedItem: item }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropZone: DropZone) => {
    e.preventDefault();
    
    if (!gameState.draggedItem) return;

    const isCorrect = gameState.draggedItem.category === dropZone.category;
    
    if (isCorrect) {
      // Correct match
      setGameState(prev => {
        const newCurrentItems = prev.currentItems.filter(item => item.id !== prev.draggedItem!.id);
        const newDropZones = prev.dropZones.map(zone => 
          zone.id === dropZone.id 
            ? { ...zone, items: [...zone.items, prev.draggedItem!] }
            : zone
        );
        
        const newCorrectMatches = prev.correctMatches + 1;
        const newStreak = prev.streak + 1;
        const newScore = prev.score + (100 * newStreak) + (prev.timeLeft * 2);

        return {
          ...prev,
          currentItems: newCurrentItems,
          dropZones: newDropZones,
          correctMatches: newCorrectMatches,
          streak: newStreak,
          score: newScore,
          draggedItem: null
        };
      });

      toast({
        title: "Correct! 🎉",
        description: `+${100 * (gameState.streak + 1)} points! Streak: ${gameState.streak + 1}`,
      });

      // Check if level complete
      if (gameState.correctMatches + 1 === gameState.totalItems) {
        setTimeout(() => nextLevel(), 1000);
      }
    } else {
      // Wrong match
      setGameState(prev => {
        const newLives = prev.lives - 1;
        return {
          ...prev,
          lives: newLives,
          streak: 0,
          draggedItem: null
        };
      });

      toast({
        title: "Wrong category! ❌",
        description: `${gameState.draggedItem.name} doesn't belong in ${dropZone.name}`,
        variant: "destructive"
      });

      if (gameState.lives - 1 <= 0) {
        setTimeout(() => endGame(), 500);
      }
    }
  };

  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      gameStarted: false,
      score: prev.score + 500, // Level completion bonus
    }));

    toast({
      title: "Level Complete! 🏆",
      description: `Moving to Level ${gameState.level + 1}! +500 bonus points!`,
    });
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, gameOver: true, gameStarted: false }));
    
    toast({
      title: gameState.lives <= 0 ? "Game Over! 💔" : "Time's Up! ⏰",
      description: `Final Score: ${gameState.score} points`,
    });
  };

  const resetGame = () => {
    setGameState({
      level: 1,
      score: 0,
      timeLeft: 60,
      gameStarted: false,
      gameOver: false,
      currentItems: [],
      dropZones: [],
      draggedItem: null,
      correctMatches: 0,
      totalItems: 0,
      streak: 0,
      lives: 3
    });
  };

  if (!gameState.gameStarted && !gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
            <h1 className="text-4xl font-bold mb-2">Eco Match Challenge</h1>
            <p className="text-xl opacity-90">Drag and drop items into their correct environmental categories!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl flex items-center justify-center">
                <Target className="mr-2 h-6 w-6" />
                Level {gameState.level} - Ready to Play?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Test your environmental knowledge by sorting items into the correct categories!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🎯 How to Play:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Drag items from the center to correct categories</li>
                    <li>• Match renewable energy, waste, recyclables, etc.</li>
                    <li>• Build streaks for bonus points</li>
                    <li>• Complete all items to advance levels</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">⚡ Game Features:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• 6 environmental categories</li>
                    <li>• Progressive difficulty levels</li>
                    <li>• Time pressure and lives system</li>
                    <li>• Educational item descriptions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Level: {gameState.level}</p>
                    <p className="text-muted-foreground">Current Level</p>
                  </div>
                  <div>
                    <p className="font-semibold">{gameState.score}</p>
                    <p className="text-muted-foreground">Total Score</p>
                  </div>
                  <div>
                    <p className="font-semibold">3 ❤️</p>
                    <p className="text-muted-foreground">Lives</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                onClick={startGame}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Start Level {gameState.level} 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Game Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-4xl font-bold text-emerald-600">{gameState.score}</p>
              <p className="text-muted-foreground">Final Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Level Reached</p>
                <p className="font-semibold">{gameState.level}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Correct Matches</p>
                <p className="font-semibold">{gameState.correctMatches}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Button onClick={() => navigate("/games")} className="flex-1">
                More Games
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game playing state
  const progress = (gameState.correctMatches / gameState.totalItems) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Game
            </Button>
            <div className="text-center">
              <h1 className="font-semibold">Eco Match Challenge</h1>
              <p className="text-sm opacity-80">Level {gameState.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Score</p>
              <p className="font-bold">{gameState.score}</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
          <div className="mt-4 flex justify-end">
            <SoundControls
              isPlaying={gameSound.isPlaying}
              volume={gameSound.volume}
              onToggleSound={gameSound.toggleSound}
              onVolumeChange={gameSound.changeVolume}
            />
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge className="bg-emerald-500 text-white">
              <Clock className="mr-1 h-3 w-3" />
              {gameState.timeLeft}s
            </Badge>
            <Badge variant="outline">
              ❤️ {gameState.lives} Lives
            </Badge>
            {gameState.streak > 0 && (
              <Badge className="bg-orange-500 text-white">
                🔥 {gameState.streak} Streak
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {gameState.correctMatches}/{gameState.totalItems} Matched
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Drop Zones */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {gameState.dropZones.map((zone) => (
            <div
              key={zone.id}
              className={`${zone.color} rounded-lg p-4 min-h-32 transition-all duration-300 hover:scale-105`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, zone)}
            >
              <h3 className="text-white font-semibold text-center mb-2">{zone.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {zone.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/20 rounded p-2 text-center text-white text-xs"
                  >
                    <div className="text-lg mb-1">{item.image}</div>
                    <div className="truncate">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Draggable Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Drag these items to the correct categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {gameState.currentItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center cursor-move hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-emerald-400"
                >
                  <div className="text-3xl mb-2">{item.image}</div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EcoMatchGame;