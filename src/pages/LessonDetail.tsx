import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, X, Lightbulb, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const LessonDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const lessons = {
    "1": {
      title: "What is Climate Change?",
      xp: 50,
      questions: [
        {
          question: "What is the primary cause of climate change?",
          options: [
            "Natural weather variations",
            "Greenhouse gas emissions from human activities",
            "Solar radiation changes",
            "Ocean currents"
          ],
          correct: 1,
          explanation: "Human activities, particularly burning fossil fuels, release greenhouse gases that trap heat in the atmosphere."
        },
        {
          question: "Which gas is the most significant contributor to climate change?",
          options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
          correct: 2,
          explanation: "CO2 is the most abundant greenhouse gas released by human activities and remains in the atmosphere for centuries."
        },
        {
          question: "What is the greenhouse effect?",
          options: [
            "Plants growing in greenhouses",
            "Heat being trapped in Earth's atmosphere",
            "The effect of green energy",
            "Melting of polar ice caps"
          ],
          correct: 1,
          explanation: "The greenhouse effect is when certain gases in the atmosphere trap heat from the sun, warming the planet."
        }
      ]
    },
    "2": {
      title: "The Greenhouse Effect",
      xp: 75,
      questions: [
        {
          question: "Which of these is NOT a greenhouse gas?",
          options: ["Carbon Dioxide", "Methane", "Nitrogen", "Water Vapor"],
          correct: 2,
          explanation: "Nitrogen makes up 78% of our atmosphere but doesn't trap heat like greenhouse gases do."
        },
        {
          question: "What percentage of the atmosphere is made up of greenhouse gases?",
          options: ["About 50%", "About 20%", "Less than 1%", "About 10%"],
          correct: 2,
          explanation: "Greenhouse gases make up less than 1% of the atmosphere, but they have a huge impact on Earth's temperature."
        }
      ]
    }
  };

  const lesson = lessons[lessonId as keyof typeof lessons];
  const totalQuestions = lesson?.questions.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

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

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    const isCorrect = selectedAnswer === lesson.questions[currentQuestion].correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast({
        title: "Correct! 🎉",
        description: `+${Math.floor(lesson.xp / totalQuestions)} XP`,
      });
    } else {
      toast({
        title: "Not quite right 🤔",
        description: "Don't worry, learning takes practice!",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson completed
      setLessonCompleted(true);
      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
      
      toast({
        title: "Lesson Complete! 🌱",
        description: `You scored ${finalScore}% and earned ${lesson.xp} XP!`,
      });
    }
  };

  const retryLesson = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setLessonCompleted(false);
  };

  if (lessonCompleted) {
    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
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
              <p className="text-muted-foreground">Final Score</p>
            </div>
            <div>
              <p className="text-xl font-semibold">+{lesson.xp} XP</p>
              <p className="text-sm text-muted-foreground">Experience Points Earned</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={retryLesson} variant="outline" className="flex-1">
                Try Again
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

  const currentQ = lesson.questions[currentQuestion];

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
              <p className="text-sm opacity-80">Question {currentQuestion + 1} of {totalQuestions}</p>
            </div>
            <div className="w-20"> {/* Spacer */}</div>
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/20" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
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
                    onClick={() => !showResult && handleAnswerSelect(index)}
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
                    <Lightbulb className="h-5 w-5 text-nature-primary mt-1" />
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
                  {currentQuestion < totalQuestions - 1 ? "Next Question" : "Complete Lesson"}
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