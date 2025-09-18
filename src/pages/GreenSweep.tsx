import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Zap, Award, RotateCcw, Play, Pause, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLearning } from "@/contexts/LearningContext";

interface GameItem {
  id: string;
  type: 'wet' | 'dry' | 'recyclable';
  emoji: string;
  name: string;
  x: number;
  y: number;
  collected: boolean;
}

interface PowerUp {
  id: string;
  type: 'speed' | 'magnet' | 'time';
  emoji: string;
  name: string;
  x: number;
  y: number;
  collected: boolean;
}

interface Obstacle {
  id: string;
  type: 'visitor' | 'dog' | 'puddle';
  emoji: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface GameState {
  started: boolean;
  paused: boolean;
  gameOver: boolean;
  level: number;
  score: number;
  timeLeft: number;
  playerX: number;
  playerY: number;
  items: GameItem[];
  powerUps: PowerUp[];
  obstacles: Obstacle[];
  wetBin: number;
  dryBin: number;
  recycleBin: number;
  speedBoost: number;
  magnetActive: number;
  lives: number;
  streak: number;
}

const GreenSweep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateGameScore } = useLearning();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const [gameState, setGameState] = useState<GameState>({
    started: false,
    paused: false,
    gameOver: false,
    level: 1,
    score: 0,
    timeLeft: 60,
    playerX: 50,
    playerY: 50,
    items: [],
    powerUps: [],
    obstacles: [],
    wetBin: 0,
    dryBin: 0,
    recycleBin: 0,
    speedBoost: 0,
    magnetActive: 0,
    lives: 3,
    streak: 0
  });

  const wasteItems = [
    { type: 'wet' as const, emoji: '🍌', name: 'Banana Peel' },
    { type: 'wet' as const, emoji: '🍎', name: 'Apple Core' },
    { type: 'wet' as const, emoji: '🥬', name: 'Lettuce' },
    { type: 'dry' as const, emoji: '🧻', name: 'Tissue Paper' },
    { type: 'dry' as const, emoji: '👟', name: 'Old Shoe' },
    { type: 'dry' as const, emoji: '🧦', name: 'Sock' },
    { type: 'recyclable' as const, emoji: '🥤', name: 'Soda Can' },
    { type: 'recyclable' as const, emoji: '🍾', name: 'Glass Bottle' },
    { type: 'recyclable' as const, emoji: '📰', name: 'Newspaper' },
    { type: 'recyclable' as const, emoji: '📦', name: 'Cardboard Box' }
  ];

  const powerUpTypes = [
    { type: 'speed' as const, emoji: '👟', name: 'Speed Boots' },
    { type: 'magnet' as const, emoji: '🧲', name: 'Trash Magnet' },
    { type: 'time' as const, emoji: '⏰', name: 'Time Bonus' }
  ];

  const obstacleTypes = [
    { type: 'visitor' as const, emoji: '🚶', name: 'Park Visitor' },
    { type: 'dog' as const, emoji: '🐕', name: 'Stray Dog' },
    { type: 'puddle' as const, emoji: '💧', name: 'Puddle' }
  ];

  const educationalFacts = [
    "🌍 Recycling one aluminum can saves enough energy to power a TV for 3 hours!",
    "♻️ It takes 450 years for a plastic bottle to decompose in nature.",
    "🌱 Composting food waste reduces methane emissions by up to 50%.",
    "📰 Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
    "🥤 Glass can be recycled infinitely without losing quality or purity.",
    "🍌 Food waste in landfills produces methane, a greenhouse gas 25x more potent than CO2."
  ];

  useEffect(() => {
    if (gameState.started && !gameState.paused && !gameState.gameOver) {
      const gameLoop = () => {
        updateGame();
        animationRef.current = requestAnimationFrame(gameLoop);
      };
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.started, gameState.paused, gameState.gameOver]);

  useEffect(() => {
    if (gameState.started && gameState.timeLeft > 0 && !gameState.gameOver && !gameState.paused) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0 && !gameState.gameOver) {
      endGame();
    }
  }, [gameState.timeLeft, gameState.started, gameState.gameOver, gameState.paused]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.started || gameState.paused || gameState.gameOver) return;

      const speed = gameState.speedBoost > 0 ? 4 : 2;
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setGameState(prev => ({ ...prev, playerY: Math.max(5, prev.playerY - speed) }));
          break;
        case 's':
        case 'arrowdown':
          setGameState(prev => ({ ...prev, playerY: Math.min(95, prev.playerY + speed) }));
          break;
        case 'a':
        case 'arrowleft':
          setGameState(prev => ({ ...prev, playerX: Math.max(5, prev.playerX - speed) }));
          break;
        case 'd':
        case 'arrowright':
          setGameState(prev => ({ ...prev, playerX: Math.min(95, prev.playerX + speed) }));
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.started, gameState.paused, gameState.gameOver, gameState.speedBoost]);

  const startGame = () => {
    const itemCount = 8 + (gameState.level - 1) * 2;
    const obstacleCount = 2 + Math.floor(gameState.level / 2);
    
    const newItems: GameItem[] = [];
    for (let i = 0; i < itemCount; i++) {
      const wasteType = wasteItems[Math.floor(Math.random() * wasteItems.length)];
      newItems.push({
        id: `item-${i}`,
        type: wasteType.type,
        emoji: wasteType.emoji,
        name: wasteType.name,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        collected: false
      });
    }

    const newObstacles: Obstacle[] = [];
    for (let i = 0; i < obstacleCount; i++) {
      const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      newObstacles.push({
        id: `obstacle-${i}`,
        type: obstacleType.type,
        emoji: obstacleType.emoji,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2
      });
    }

    setGameState(prev => ({
      ...prev,
      started: true,
      gameOver: false,
      paused: false,
      playerX: 50,
      playerY: 50,
      items: newItems,
      powerUps: [],
      obstacles: newObstacles,
      wetBin: 0,
      dryBin: 0,
      recycleBin: 0,
      timeLeft: 60 + (gameState.level - 1) * 10,
      lives: 3,
      speedBoost: 0,
      magnetActive: 0,
      streak: 0
    }));
  };

  const updateGame = () => {
    setGameState(prev => {
      const newState = { ...prev };

      // Update power-up timers
      if (newState.speedBoost > 0) newState.speedBoost--;
      if (newState.magnetActive > 0) newState.magnetActive--;

      // Move obstacles
      newState.obstacles = newState.obstacles.map(obstacle => {
        let newX = obstacle.x + obstacle.dx;
        let newY = obstacle.y + obstacle.dy;
        let newDx = obstacle.dx;
        let newDy = obstacle.dy;

        // Bounce off walls
        if (newX <= 5 || newX >= 95) newDx = -newDx;
        if (newY <= 5 || newY >= 95) newDy = -newDy;

        return {
          ...obstacle,
          x: Math.max(5, Math.min(95, newX)),
          y: Math.max(5, Math.min(95, newY)),
          dx: newDx,
          dy: newDy
        };
      });

      // Check collisions with items
      newState.items = newState.items.map(item => {
        if (item.collected) return item;

        const distance = Math.sqrt(
          Math.pow(item.x - newState.playerX, 2) + Math.pow(item.y - newState.playerY, 2)
        );

        const collectDistance = newState.magnetActive > 0 ? 8 : 4;

        if (distance < collectDistance) {
          // Collect item and sort into correct bin
          switch (item.type) {
            case 'wet':
              newState.wetBin++;
              break;
            case 'dry':
              newState.dryBin++;
              break;
            case 'recyclable':
              newState.recycleBin++;
              break;
          }
          
          newState.score += 10 + (newState.streak * 2);
          newState.streak++;
          
          return { ...item, collected: true };
        }

        return item;
      });

      // Check collisions with power-ups
      newState.powerUps = newState.powerUps.map(powerUp => {
        if (powerUp.collected) return powerUp;

        const distance = Math.sqrt(
          Math.pow(powerUp.x - newState.playerX, 2) + Math.pow(powerUp.y - newState.playerY, 2)
        );

        if (distance < 4) {
          switch (powerUp.type) {
            case 'speed':
              newState.speedBoost = 300; // 5 seconds at 60fps
              break;
            case 'magnet':
              newState.magnetActive = 300;
              break;
            case 'time':
              newState.timeLeft += 10;
              break;
          }
          
          newState.score += 25;
          return { ...powerUp, collected: true };
        }

        return powerUp;
      });

      // Check collisions with obstacles
      newState.obstacles.forEach(obstacle => {
        const distance = Math.sqrt(
          Math.pow(obstacle.x - newState.playerX, 2) + Math.pow(obstacle.y - newState.playerY, 2)
        );

        if (distance < 5) {
          newState.lives--;
          newState.streak = 0;
          // Move player away from obstacle
          newState.playerX = 50;
          newState.playerY = 50;
        }
      });

      // Spawn power-ups occasionally
      if (Math.random() < 0.002 && newState.powerUps.filter(p => !p.collected).length < 2) {
        const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        newState.powerUps.push({
          id: `powerup-${Date.now()}`,
          type: powerUpType.type,
          emoji: powerUpType.emoji,
          name: powerUpType.name,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          collected: false
        });
      }

      // Check level completion
      const uncollectedItems = newState.items.filter(item => !item.collected);
      if (uncollectedItems.length === 0) {
        // Level complete
        newState.level++;
        newState.score += 100 * newState.level;
        newState.started = false;
      }

      // Check game over
      if (newState.lives <= 0) {
        newState.gameOver = true;
        newState.started = false;
      }

      return newState;
    });
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, gameOver: true, started: false }));
    
    // Award XP based on performance
    const xpEarned = Math.floor(gameState.score / 15);
    updateGameScore('Green Sweep', gameState.score, xpEarned);
    
    // Show educational fact
    const randomFact = educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
    setTimeout(() => {
      toast({
        title: "Did You Know?",
        description: randomFact,
      });
    }, 1000);
  };

  const resetGame = () => {
    setGameState({
      started: false,
      paused: false,
      gameOver: false,
      level: 1,
      score: 0,
      timeLeft: 60,
      playerX: 50,
      playerY: 50,
      items: [],
      powerUps: [],
      obstacles: [],
      wetBin: 0,
      dryBin: 0,
      recycleBin: 0,
      speedBoost: 0,
      magnetActive: 0,
      lives: 3,
      streak: 0
    });
  };

  const getBinColor = (binType: 'wet' | 'dry' | 'recyclable') => {
    switch (binType) {
      case 'wet': return 'bg-green-500';
      case 'dry': return 'bg-blue-500';
      case 'recyclable': return 'bg-yellow-500';
    }
  };

  if (!gameState.started && !gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-r from-lime-500 to-green-400 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 mb-4"
              onClick={() => navigate("/games")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Button>
            <h1 className="text-4xl font-bold mb-2">Green Sweep</h1>
            <p className="text-xl opacity-90">Clean up the park and sort waste correctly!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl flex items-center justify-center">
                <Trash2 className="mr-2 h-6 w-6" />
                Level {gameState.level} - Eco Hero Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Take on the role of an Eco-Hero and clean up the local park! Collect litter and sort it into the correct bins.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🎮 How to Play:</h3>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Use WASD or arrow keys to move</li>
                    <li>• Collect litter by walking over it</li>
                    <li>• Items auto-sort into correct bins</li>
                    <li>• Avoid obstacles like visitors and puddles</li>
                    <li>• Collect power-ups for special abilities</li>
                    <li>• Press SPACE to pause</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🗂️ Waste Categories:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                      <span>Green Bin: Wet waste (food scraps)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                      <span>Blue Bin: Dry waste (non-recyclable)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                      <span>Yellow Bin: Recyclables (cans, bottles)</span>
                    </div>
                  </div>
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
                    <p className="text-muted-foreground">High Score</p>
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
                className="bg-lime-500 hover:bg-lime-600"
              >
                Start Cleaning! 🧹
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState.gameOver) {
    const randomFact = educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-lime-500 to-green-400 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Park Cleaned!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-4xl font-bold text-lime-600">{gameState.score}</p>
              <p className="text-muted-foreground">Final Score</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <div className="w-4 h-4 bg-green-500 rounded mx-auto"></div>
                <p className="text-muted-foreground">Wet Waste</p>
                <p className="font-semibold">{gameState.wetBin}</p>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 bg-blue-500 rounded mx-auto"></div>
                <p className="text-muted-foreground">Dry Waste</p>
                <p className="font-semibold">{gameState.dryBin}</p>
              </div>
              <div className="space-y-1">
                <div className="w-4 h-4 bg-yellow-500 rounded mx-auto"></div>
                <p className="text-muted-foreground">Recyclables</p>
                <p className="font-semibold">{gameState.recycleBin}</p>
              </div>
            </div>

            <div className="bg-nature-primary/10 rounded-lg p-4">
              <h3 className="font-semibold text-nature-primary mb-2">🌱 Eco Fact</h3>
              <p className="text-sm text-muted-foreground">{randomFact}</p>
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
  const totalItems = gameState.items.length;
  const collectedItems = gameState.items.filter(item => item.collected).length;
  const progress = totalItems > 0 ? (collectedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-500 to-green-400 text-white py-4">
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
              <h1 className="font-semibold">Green Sweep</h1>
              <p className="text-sm opacity-80">Level {gameState.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Score</p>
              <p className="font-bold">{gameState.score}</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      {/* Game Stats */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge className="bg-lime-500 text-white">
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
            {gameState.speedBoost > 0 && (
              <Badge className="bg-purple-500 text-white">
                👟 Speed Boost
              </Badge>
            )}
            {gameState.magnetActive > 0 && (
              <Badge className="bg-pink-500 text-white">
                🧲 Magnet Active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={togglePause}>
              {gameState.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <span className="text-sm text-muted-foreground">
              {collectedItems}/{totalItems} Collected
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Waste Bins */}
          <div className="space-y-3">
            <h3 className="font-semibold text-center">Waste Bins</h3>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xl">🗑️</span>
                </div>
                <p className="font-medium text-green-700">Wet Waste</p>
                <p className="text-2xl font-bold text-green-600">{gameState.wetBin}</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xl">🗑️</span>
                </div>
                <p className="font-medium text-blue-700">Dry Waste</p>
                <p className="text-2xl font-bold text-blue-600">{gameState.dryBin}</p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white text-xl">♻️</span>
                </div>
                <p className="font-medium text-yellow-700">Recyclables</p>
                <p className="text-2xl font-bold text-yellow-600">{gameState.recycleBin}</p>
              </CardContent>
            </Card>
          </div>

          {/* Game Field */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div 
                  ref={gameAreaRef}
                  className="relative w-full h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg overflow-hidden"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)' }}
                >
                  {/* Player */}
                  <div
                    className={`absolute w-8 h-8 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold transition-all duration-100 ${
                      gameState.speedBoost > 0 ? 'animate-pulse' : ''
                    } ${gameState.magnetActive > 0 ? 'ring-4 ring-pink-300' : ''}`}
                    style={{
                      left: `${gameState.playerX}%`,
                      top: `${gameState.playerY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    🦸
                  </div>

                  {/* Items */}
                  {gameState.items.filter(item => !item.collected).map(item => (
                    <div
                      key={item.id}
                      className="absolute w-6 h-6 flex items-center justify-center animate-bounce-gentle"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <span className="text-xl">{item.emoji}</span>
                    </div>
                  ))}

                  {/* Power-ups */}
                  {gameState.powerUps.filter(powerUp => !powerUp.collected).map(powerUp => (
                    <div
                      key={powerUp.id}
                      className="absolute w-8 h-8 flex items-center justify-center animate-pulse bg-white/80 rounded-full"
                      style={{
                        left: `${powerUp.x}%`,
                        top: `${powerUp.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <span className="text-xl">{powerUp.emoji}</span>
                    </div>
                  ))}

                  {/* Obstacles */}
                  {gameState.obstacles.map(obstacle => (
                    <div
                      key={obstacle.id}
                      className="absolute w-6 h-6 flex items-center justify-center"
                      style={{
                        left: `${obstacle.x}%`,
                        top: `${obstacle.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <span className="text-xl">{obstacle.emoji}</span>
                    </div>
                  ))}

                  {/* Pause Overlay */}
                  {gameState.paused && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <Pause className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-xl font-bold mb-2">Game Paused</h3>
                          <p className="text-muted-foreground mb-4">Press SPACE to continue</p>
                          <Button onClick={togglePause}>Resume Game</Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controls Help */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded">WASD</kbd>
                    <p className="text-muted-foreground mt-1">Move</p>
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-muted rounded">SPACE</kbd>
                    <p className="text-muted-foreground mt-1">Pause</p>
                  </div>
                  <div>
                    <span className="text-xl">👟</span>
                    <p className="text-muted-foreground mt-1">Speed Boost</p>
                  </div>
                  <div>
                    <span className="text-xl">🧲</span>
                    <p className="text-muted-foreground mt-1">Trash Magnet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreenSweep;