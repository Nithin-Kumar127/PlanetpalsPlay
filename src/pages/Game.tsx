import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Zap, CheckCircle, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGameSound } from "@/hooks/useGameSound";
import { SoundControls } from "@/components/ui/sound-controls";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

const Game = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameMode, setGameMode] = useState<'quick' | 'challenge'>('quick');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the main cause of current climate change?",
      options: ["Solar radiation changes", "Human activities", "Natural cycles", "Volcanic eruptions"],
      correct: 1,
      category: "Climate Basics",
      difficulty: 'easy',
      explanation: "Human activities, especially burning fossil fuels, are the primary driver of current climate change."
    },
    {
      id: 2,
      question: "Which renewable energy source is the fastest growing globally?",
      options: ["Wind", "Solar", "Hydroelectric", "Geothermal"],
      correct: 1,
      category: "Renewable Energy",
      difficulty: 'medium',
      explanation: "Solar energy is the fastest-growing renewable energy source worldwide due to decreasing costs and improving technology."
    },
    {
      id: 3,
      question: "What percentage of global greenhouse gas emissions come from transportation?",
      options: ["10%", "14%", "24%", "34%"],
      correct: 2,
      category: "Climate Basics",
      difficulty: 'hard',
      explanation: "Transportation accounts for approximately 24% of global CO2 emissions from fuel combustion."
    },
    {
      id: 4,
      question: "Which gas has the highest global warming potential?",
      options: ["Carbon Dioxide", "Methane", "Nitrous Oxide", "Fluorinated gases"],
      correct: 3,
      category: "Climate Science",
      difficulty: 'hard',
      explanation: "Fluorinated gases have the highest global warming potential, thousands of times more potent than CO2."
    },
    {
      id: 5,
      question: "What does the '3 R's' stand for in waste management?",
      options: ["Reduce, Reuse, Recycle", "Remove, Replace, Restore", "Repair, Renew, Refresh", "Reject, Reduce, Reuse"],
      correct: 0,
      category: "Waste Management",
      difficulty: 'easy',
      explanation: "The 3 R's - Reduce, Reuse, Recycle - are the fundamental principles of waste management."
    },
    {
      id: 6,
      question: "How much of Earth's surface is covered by forests?",
      options: ["21%", "31%", "41%", "51%"],
      correct: 1,
      category: "Ecosystems",
      difficulty: 'medium',
      explanation: "Approximately 31% of Earth's land surface is covered by forests, which are crucial for carbon storage."
    },
    {
      id: 7,
      question: "What is carbon neutrality?",
      options: ["Producing no carbon", "Balancing carbon emissions with removal", "Using only renewable energy", "Planting trees only"],
      correct: 1,
      category: "Climate Action",
      difficulty: 'medium',
      explanation: "Carbon neutrality means balancing carbon emissions with an equivalent amount of carbon removal or offsetting."
    },
    {
      id: 8,
      question: "Which country produces the most solar energy?",
      options: ["Germany", "United States", "China", "Japan"],
      correct: 2,
      category: "Renewable Energy",
      difficulty: 'medium',
      explanation: "China is the world's largest producer of solar energy, accounting for over 30% of global solar capacity."
    }
  ];

  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, gameState]);

  const startGame = (mode: 'quick' | 'challenge') => {
    setGameMode(mode);
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = mode === 'quick' ? shuffledQuestions.slice(0, 5) : shuffledQuestions;
    setGameQuestions(selectedQuestions);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(mode === 'quick' ? 20 : 30);
    setSelectedAnswer(null);
    setShowResult(false);
    gameSound.playSound();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === gameQuestions[currentQuestion].correct;
    
    if (isCorrect) {
      const points = getPoints(gameQuestions[currentQuestion].difficulty, timeLeft);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      
      toast({
        title: "Correct! 🎉",
        description: `+${points} points! ${streak + 1} in a row!`,
      });
    } else {
      setStreak(0);
      toast({
        title: "Not quite right 🤔",
        description: "Keep learning!",
        variant: "destructive",
      });
    }
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      setStreak(0);
      toast({
        title: "Time's up! ⏰",
        description: "Moving to next question",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(gameMode === 'quick' ? 20 : 30);
    } else {
      setGameState('finished');
    }
  };

  const getPoints = (difficulty: string, timeRemaining: number) => {
    const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
    const timeBonus = Math.floor(timeRemaining / 5);
    return basePoints + timeBonus;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreRating = (finalScore: number, totalQuestions: number) => {
    const percentage = (finalScore / (totalQuestions * 20)) * 100;
    if (percentage >= 90) return { rating: "Climate Champion! 🏆", color: "text-success" };
    if (percentage >= 75) return { rating: "Eco Expert! 🌟", color: "text-nature-primary" };
    if (percentage >= 60) return { rating: "Green Learner! 🌱", color: "text-accent" };
    return { rating: "Keep Learning! 📚", color: "text-muted-foreground" };
  };

  if (gameState === 'menu') {
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
            <h1 className="text-4xl font-bold mb-2">Climate Quiz Challenge</h1>
            <p className="text-xl opacity-90">Test your climate knowledge and earn points!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-6 w-6 text-nature-primary" />
                  Quick Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">Perfect for a quick knowledge check!</p>
                  <ul className="text-sm space-y-1">
                    <li>• 5 random questions</li>
                    <li>• 20 seconds per question</li>
                    <li>• Mixed difficulty levels</li>
                    <li>• Quick scoring system</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => startGame('quick')} 
                  className="w-full"
                >
                  Start Quick Quiz
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-6 w-6 text-warning" />
                  Challenge Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">For serious climate champions!</p>
                  <ul className="text-sm space-y-1">
                    <li>• All 8 questions</li>
                    <li>• 30 seconds per question</li>
                    <li>• Streak bonuses</li>
                    <li>• Maximum points possible</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => startGame('challenge')} 
                  className="w-full"
                  variant="outline"
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-nature-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold">Answer Questions</h3>
                <p className="text-sm text-muted-foreground">Choose the correct answer before time runs out</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-nature-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold">Earn Points</h3>
                <p className="text-sm text-muted-foreground">Get bonus points for speed and difficulty</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-nature-primary rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold">Build Streaks</h3>
                <p className="text-sm text-muted-foreground">Answer consecutively for streak bonuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const { rating, color } = getScoreRating(score, gameQuestions.length);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-4xl font-bold text-nature-primary">{score}</p>
              <p className="text-muted-foreground">Total Points</p>
            </div>
            
            <div className={`text-xl font-semibold ${color}`}>
              {rating}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Questions</p>
                <p className="font-semibold">{gameQuestions.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Best Streak</p>
                <p className="font-semibold">{bestStreak}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => setGameState('menu')} variant="outline" className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Button onClick={() => navigate("/")} className="flex-1">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Playing state
  const currentQ = gameQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setGameState('menu')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Game
            </Button>
            <div className="text-center">
              <h1 className="font-semibold">Climate Quiz</h1>
              <p className="text-sm opacity-80">Question {currentQuestion + 1} of {gameQuestions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Score</p>
              <p className="font-bold">{score}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <SoundControls
              isPlaying={gameSound.isPlaying}
              volume={gameSound.volume}
              onToggleSound={gameSound.toggleSound}
              onVolumeChange={gameSound.changeVolume}
            />
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Timer and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Badge className={getDifficultyColor(currentQ.difficulty)}>
              {currentQ.difficulty}
            </Badge>
            <Badge variant="outline">{currentQ.category}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`font-mono font-bold ${timeLeft <= 5 ? 'text-destructive' : 'text-foreground'}`}>
                {timeLeft}s
              </span>
            </div>
            {streak > 0 && (
              <Badge className="bg-warning text-warning-foreground">
                🔥 {streak} streak
              </Badge>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                let buttonClass = "w-full text-left p-4 border-2 transition-all duration-200 ";
                
                if (!showResult) {
                  buttonClass += selectedAnswer === index 
                    ? "border-nature-primary bg-nature-primary/10" 
                    : "border-border hover:border-nature-primary/50";
                } else {
                  if (index === currentQ.correct) {
                    buttonClass += "border-success bg-success/10 text-success";
                  } else if (selectedAnswer === index && index !== currentQ.correct) {
                    buttonClass += "border-destructive bg-destructive/10 text-destructive";
                  } else {
                    buttonClass += "border-border opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      {option}
                      {showResult && index === currentQ.correct && (
                        <CheckCircle className="ml-auto h-5 w-5" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correct && (
                        <X className="ml-auto h-5 w-5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 rounded-full bg-nature-primary/20 text-nature-primary flex items-center justify-center mt-1">
                      <span className="text-xs">💡</span>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Explanation</p>
                      <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              {!showResult ? (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion < gameQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;