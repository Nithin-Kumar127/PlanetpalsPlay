import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, X, Lightbulb, Award, ChevronLeft, ChevronRight, BookOpen, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface LessonCard {
  id: number;
  type: 'concept' | 'example' | 'analogy' | 'quiz';
  title: string;
  content: string;
  points?: string[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  icon: any;
}

interface Lesson {
  id: string;
  title: string;
  difficulty: string;
  xp: number;
  description: string;
  cards: LessonCard[];
}

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentCard, setCurrentCard] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [cardProgress, setCardProgress] = useState<boolean[]>([]);

  const lessons: Record<string, Lesson> = {
    "1": {
      id: "1",
      title: "What is Climate Change?",
      difficulty: "Easy",
      xp: 50,
      description: "Understanding the basics of climate change and its causes",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'Climate vs Weather',
          content: 'Climate change refers to long-term shifts in temperatures and weather patterns on Earth. Understanding the difference between weather and climate is crucial.',
          points: [
            'Weather is what you experience day-to-day (rain, sunshine, snow)',
            'Climate is the average weather over 30+ years',
            'Weather changes daily, climate changes over decades',
            'Current climate change is happening faster than natural changes'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'Weather vs Climate Analogy',
          content: 'Think of weather and climate like your daily outfit versus your entire wardrobe.',
          points: [
            'Weather = The outfit you choose today (short-term)',
            'Climate = Your entire wardrobe collection (long-term)',
            'One rainy day doesn\'t change the climate',
            'Just like one outfit doesn\'t define your style'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'concept',
          title: 'Main Causes',
          content: 'Human activities have become the primary driver of climate change since the 1800s.',
          points: [
            'Burning fossil fuels (coal, oil, gas) for energy',
            'Deforestation reducing CO2 absorption',
            'Industrial processes releasing greenhouse gases',
            'Agriculture and livestock producing methane'
          ],
          icon: Target
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Test Your Knowledge',
          content: 'Let\'s check your understanding of climate change basics.',
          quiz: {
            question: 'What is the main difference between weather and climate?',
            options: [
              'There is no difference between them',
              'Weather is long-term, climate is short-term',
              'Climate is the long-term average of weather patterns',
              'Weather only happens in winter'
            ],
            correct: 2,
            explanation: 'Climate is indeed the long-term average of weather patterns, typically measured over 30 years or more, while weather refers to short-term atmospheric conditions.'
          },
          icon: Brain
        }
      ]
    },
    "2": {
      id: "2",
      title: "The Greenhouse Effect",
      difficulty: "Easy",
      xp: 75,
      description: "Learn how greenhouse gases trap heat in our atmosphere",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'How the Greenhouse Effect Works',
          content: 'The greenhouse effect is a natural process that warms Earth\'s surface and makes life possible.',
          points: [
            'Sunlight enters our atmosphere and reaches Earth',
            'Earth\'s surface absorbs energy and warms up',
            'Warm Earth radiates heat back toward space',
            'Greenhouse gases trap some heat, warming the atmosphere'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'analogy',
          title: 'The Car Window Analogy',
          content: 'The greenhouse effect works like a car parked in the sun.',
          points: [
            'Sun\'s rays enter through car windows (atmosphere)',
            'Interior surfaces absorb the heat and warm up',
            'Heat gets trapped inside the car',
            'Car becomes much hotter than outside temperature'
          ],
          icon: Lightbulb
        },
        {
          id: 3,
          type: 'concept',
          title: 'Key Greenhouse Gases',
          content: 'Different gases contribute to the greenhouse effect in various ways.',
          points: [
            'Carbon Dioxide (CO₂) - Primary gas from human activities',
            'Methane (CH₄) - More potent, from agriculture and leaks',
            'Water Vapor (H₂O) - Most abundant, acts as feedback',
            'Nitrous Oxide (N₂O) - From fertilizers and fossil fuels'
          ],
          icon: Target
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Greenhouse Effect Quiz',
          content: 'Test your understanding of the greenhouse effect.',
          quiz: {
            question: 'Is the natural greenhouse effect harmful to Earth?',
            options: [
              'Yes, it\'s always harmful to the environment',
              'No, it\'s essential for keeping Earth warm enough for life',
              'It only became harmful when humans appeared',
              'It only affects the polar ice caps'
            ],
            correct: 1,
            explanation: 'The natural greenhouse effect is essential for life on Earth! Without it, our planet would be too cold to support most life forms. The problem is the enhanced greenhouse effect from human activities.'
          },
          icon: Brain
        }
      ]
    },
    "3": {
      id: "3",
      title: "Carbon Footprint Basics",
      difficulty: "Medium",
      xp: 100,
      description: "Understanding your personal impact on climate change",
      cards: [
        {
          id: 1,
          type: 'concept',
          title: 'What is a Carbon Footprint?',
          content: 'A carbon footprint measures the total greenhouse gases generated by your actions.',
          points: [
            'Includes all greenhouse gases, not just CO₂',
            'Measured in CO₂ equivalent units',
            'Covers both direct and indirect emissions',
            'Helps identify areas for improvement'
          ],
          icon: BookOpen
        },
        {
          id: 2,
          type: 'concept',
          title: 'Direct vs Indirect Emissions',
          content: 'Understanding the two types of emissions in your carbon footprint.',
          points: [
            'Direct: Emissions you control (car exhaust, home heating)',
            'Indirect: Emissions from products/services you use',
            'Indirect often larger than direct emissions',
            'Both types matter for total impact'
          ],
          icon: Target
        },
        {
          id: 3,
          type: 'example',
          title: 'Main Footprint Components',
          content: 'The biggest contributors to your personal carbon footprint.',
          points: [
            'Home Energy: Electricity, heating, cooling (25-30%)',
            'Transportation: Cars, flights, public transport (20-25%)',
            'Food: Production, processing, transport (15-20%)',
            'Consumption: Goods, services, manufacturing (20-25%)'
          ],
          icon: Lightbulb
        },
        {
          id: 4,
          type: 'quiz',
          title: 'Carbon Footprint Quiz',
          content: 'Test your knowledge about carbon footprints.',
          quiz: {
            question: 'The emissions from the power plant generating your electricity are:',
            options: [
              'Direct emissions from your activities',
              'Indirect emissions from your electricity use',
              'Not part of your carbon footprint',
              'Only counted if you own the power plant'
            ],
            correct: 1,
            explanation: 'These are indirect emissions because while you don\'t directly control the power plant, your electricity consumption drives the demand for power generation.'
          },
          icon: Brain
        }
      ]
    }
  };

  const lesson = lessons[lessonId as string];
  
  useEffect(() => {
    if (lesson) {
      setCardProgress(new Array(lesson.cards.length).fill(false));
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentCardData = lesson.cards[currentCard];
  const progress = ((currentCard + 1) / lesson.cards.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentCardData.quiz) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === currentCardData.quiz.correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: "Great job understanding the concept!",
      });
    } else {
      toast({
        title: "Not quite right 🤔",
        description: "Review the explanation and keep learning!",
        variant: "destructive",
      });
    }

    // Mark card as completed
    setCardProgress(prev => {
      const newProgress = [...prev];
      newProgress[currentCard] = true;
      return newProgress;
    });
  };

  const handleNextCard = () => {
    if (currentCard < lesson.cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setLessonCompleted(true);
      const finalScore = Math.round((correctAnswers / lesson.cards.filter(c => c.type === 'quiz').length) * 100);
      
      toast({
        title: "Lesson Complete! 🌱",
        description: `You earned ${lesson.xp} XP! Keep up the great work!`,
      });
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const markCardComplete = () => {
    setCardProgress(prev => {
      const newProgress = [...prev];
      newProgress[currentCard] = true;
      return newProgress;
    });
  };

  if (lessonCompleted) {
    const quizCards = lesson.cards.filter(c => c.type === 'quiz').length;
    const finalScore = quizCards > 0 ? Math.round((correctAnswers / quizCards) * 100) : 100;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-success to-leaf rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Lesson Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-3xl font-bold text-success">{finalScore}%</p>
              <p className="text-muted-foreground">Understanding Score</p>
            </div>
            <div>
              <p className="text-xl font-semibold">+{lesson.xp} XP</p>
              <p className="text-sm text-muted-foreground">Experience Points Earned</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Cards Completed: {cardProgress.filter(Boolean).length}/{lesson.cards.length}</p>
              <p>Quiz Questions: {correctAnswers}/{quizCards}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => navigate("/")} className="flex-1">
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "concept": return "bg-blue-500";
      case "example": return "bg-green-500";
      case "analogy": return "bg-purple-500";
      case "quiz": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-nature-primary to-nature-secondary text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Lesson
            </Button>
            <div className="text-center">
              <h1 className="font-semibold">{lesson.title}</h1>
              <p className="text-sm opacity-80">Card {currentCard + 1} of {lesson.cards.length}</p>
            </div>
            <Badge className={getDifficultyColor(lesson.difficulty)}>
              {lesson.difficulty}
            </Badge>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      {/* Card Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${getCardTypeColor(currentCardData.type)} text-white flex items-center justify-center`}>
                  <currentCardData.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentCardData.title}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {currentCardData.type.charAt(0).toUpperCase() + currentCardData.type.slice(1)}
                  </Badge>
                </div>
              </div>
              {cardProgress[currentCard] && (
                <CheckCircle className="h-6 w-6 text-success" />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-lg text-muted-foreground">
              {currentCardData.content}
            </div>

            {currentCardData.points && (
              <div className="space-y-3">
                {currentCardData.points.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-nature-primary text-white flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="flex-1">{point}</p>
                  </div>
                ))}
              </div>
            )}

            {currentCardData.type === 'quiz' && currentCardData.quiz && (
              <div className="space-y-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <h3 className="font-semibold mb-3">{currentCardData.quiz.question}</h3>
                  <div className="space-y-3">
                    {currentCardData.quiz.options.map((option, index) => {
                      let buttonClass = "w-full text-left p-4 border-2 transition-all duration-200 ";
                      
                      if (!showResult) {
                        buttonClass += selectedAnswer === index 
                          ? "border-nature-primary bg-nature-primary/10" 
                          : "border-border hover:border-nature-primary/50";
                      } else {
                        if (index === currentCardData.quiz!.correct) {
                          buttonClass += "border-success bg-success/10 text-success";
                        } else if (selectedAnswer === index && index !== currentCardData.quiz!.correct) {
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
                            {showResult && index === currentCardData.quiz!.correct && (
                              <CheckCircle className="ml-auto h-5 w-5" />
                            )}
                            {showResult && selectedAnswer === index && index !== currentCardData.quiz!.correct && (
                              <X className="ml-auto h-5 w-5" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showResult && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-nature-primary mt-1" />
                        <div>
                          <p className="font-medium mb-1">Explanation</p>
                          <p className="text-sm text-muted-foreground">{currentCardData.quiz.explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevCard}
                disabled={currentCard === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex space-x-2">
                {lesson.cards.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentCard
                        ? 'bg-nature-primary'
                        : cardProgress[index]
                        ? 'bg-success'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {currentCardData.type === 'quiz' ? (
                !showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextCard}>
                    {currentCard < lesson.cards.length - 1 ? "Next Card" : "Complete Lesson"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )
              ) : (
                <Button 
                  onClick={() => {
                    if (!cardProgress[currentCard]) {
                      markCardComplete();
                    }
                    handleNextCard();
                  }}
                >
                  {currentCard < lesson.cards.length - 1 ? "Next Card" : "Complete Lesson"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonDetail;