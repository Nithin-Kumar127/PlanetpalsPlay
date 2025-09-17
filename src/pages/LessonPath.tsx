import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLearning } from "@/contexts/LearningContext";

const LessonPath = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    lessons, 
    categories, 
    completedLessonIds, 
    loading 
  } = useLearning();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-nature-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lessons...</p>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id.toString() === categoryId);
  const categoryLessons = lessons.filter(l => l.category_id.toString() === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const isLessonUnlocked = (lessonId: number, index: number) => {
    // First lesson of Climate Basics is always unlocked
    if (categoryId === "1" && index === 0) return true;
    
    // For other categories, check if previous category is completed
    if (categoryId !== "1") {
      const previousCategoryId = parseInt(categoryId) - 1;
      const previousCategoryLessons = lessons.filter(l => l.category_id === previousCategoryId);
      const previousCategoryLessonIds = previousCategoryLessons.map(l => l.id);
      const previousCategoryCompleted = previousCategoryLessonIds.every(id => completedLessonIds.includes(id));
      if (!previousCategoryCompleted) return false;
    }
    
    // Within the same category, check if previous lesson is completed
    if (index === 0) return true; // First lesson of unlocked category
    const previousLessonId = categoryLessons[index - 1].id;
    return completedLessonIds.includes(previousLessonId);
  };

  const isLessonCompleted = (lessonId: number) => {
    return completedLessonIds.includes(lessonId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const startLesson = (lessonId: number) => {
    // All lessons are now available
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category.color} text-white py-8`}>
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">{category.title}</h1>
          <p className="text-xl opacity-90">{category.description}</p>
          <div className="mt-4">
            <Progress 
              value={(completedLessonIds.filter(id => 
                categoryLessons.some(lesson => lesson.id === id)
              ).length / categoryLessons.length) * 100}
              className="h-3 bg-white/20"
            />
            <p className="text-sm mt-2 opacity-80">
              {completedLessonIds.filter(id => 
                categoryLessons.some(lesson => lesson.id === id)
              ).length} of {categoryLessons.length} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {categoryLessons.map((lesson, index) => {
            const unlocked = isLessonUnlocked(lesson.id, index);
            const completed = isLessonCompleted(lesson.id);

            return (
              <Card 
                key={lesson.id}
                className={`transition-all duration-300 ${
                  unlocked ? 'hover:shadow-lg hover:scale-[1.02]' : 'opacity-60'
                } ${completed ? 'border-success bg-success/5' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        completed 
                          ? 'bg-success text-success-foreground' 
                          : unlocked 
                            ? `bg-gradient-to-br ${category.color} text-white`
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : unlocked ? (
                          <Play className="h-6 w-6" />
                        ) : (
                          <Lock className="h-6 w-6" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {lesson.difficulty}
                          </Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            {lesson.xp_reward} XP
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      disabled={!unlocked}
                      onClick={() => startLesson(lesson.id)}
                      variant={completed ? "outline" : "default"}
                    >
                      {completed ? "Review" : "Start Lesson"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LessonPath;