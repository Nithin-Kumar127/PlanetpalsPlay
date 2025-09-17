import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const LessonPath = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedLessons, setCompletedLessons] = useState<number[]>([1, 2, 3]);

  const categories = {
    "1": {
      title: "Climate Basics",
      description: "Understanding greenhouse gases and global warming",
      color: "from-blue-500 to-cyan-400",
      lessons: [
        { id: 1, title: "What is Climate Change?", xp: 50, difficulty: "Easy" },
        { id: 2, title: "The Greenhouse Effect", xp: 75, difficulty: "Easy" },
        { id: 3, title: "Carbon Footprint Basics", xp: 100, difficulty: "Medium" },
        { id: 4, title: "Global Temperature Trends", xp: 125, difficulty: "Medium" },
        { id: 5, title: "Ice Caps and Sea Levels", xp: 150, difficulty: "Hard" },
      ]
    },
    "2": {
      title: "Renewable Energy",
      description: "Solar, wind, and sustainable power sources",
      color: "from-yellow-500 to-orange-400",
      lessons: [
        { id: 6, title: "Solar Power Fundamentals", xp: 75, difficulty: "Easy" },
        { id: 7, title: "Wind Energy Systems", xp: 100, difficulty: "Medium" },
        { id: 8, title: "Hydroelectric Power", xp: 125, difficulty: "Medium" },
        { id: 9, title: "Geothermal Energy", xp: 150, difficulty: "Hard" },
        { id: 10, title: "Energy Storage Solutions", xp: 200, difficulty: "Hard" },
      ]
    },
    "3": {
      title: "Waste Management",
      description: "Recycling, composting, and reducing waste",
      color: "from-green-500 to-emerald-400",
      lessons: [
        { id: 11, title: "The 3 R's: Reduce, Reuse, Recycle", xp: 50, difficulty: "Easy" },
        { id: 12, title: "Composting at Home", xp: 75, difficulty: "Easy" },
        { id: 13, title: "Plastic Pollution Solutions", xp: 100, difficulty: "Medium" },
        { id: 14, title: "Circular Economy Principles", xp: 150, difficulty: "Hard" },
        { id: 15, title: "Zero Waste Lifestyle", xp: 200, difficulty: "Hard" },
      ]
    },
    "4": {
      title: "Ecosystem Protection",
      description: "Biodiversity, conservation, and habitat preservation",
      color: "from-emerald-600 to-green-500",
      lessons: [
        { id: 16, title: "Biodiversity Basics", xp: 100, difficulty: "Medium" },
        { id: 17, title: "Forest Conservation", xp: 125, difficulty: "Medium" },
        { id: 18, title: "Ocean Protection", xp: 150, difficulty: "Hard" },
        { id: 19, title: "Wildlife Corridors", xp: 175, difficulty: "Hard" },
        { id: 20, title: "Sustainable Agriculture", xp: 200, difficulty: "Hard" },
      ]
    }
  };

  const category = categories[categoryId as keyof typeof categories];

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
    if (index === 0) return true;
    return completedLessons.includes(lessonId - 1);
  };

  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.includes(lessonId);
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
    // Map lesson IDs to the actual lesson content
    const lessonMap: Record<number, string> = {
      1: "1", // What is Climate Change?
      2: "2", // The Greenhouse Effect  
      3: "3", // Carbon Footprint Basics
      4: "4", // Global Temperature Trends
      5: "5", // Ice Caps and Sea Levels
      6: "1", // Map other lessons to available content for now
      7: "2",
      8: "3",
      9: "1",
      10: "2",
      11: "3",
      12: "1",
      13: "2",
      14: "3",
      15: "1",
      16: "2",
      17: "3",
      18: "1",
      19: "2",
      20: "3"
    };
    
    const mappedLessonId = lessonMap[lessonId] || "1";
    navigate(`/lesson/${mappedLessonId}`);
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
              value={(completedLessons.filter(id => 
                category.lessons.some(lesson => lesson.id === id)
              ).length / category.lessons.length) * 100} 
              className="h-3 bg-white/20"
            />
            <p className="text-sm mt-2 opacity-80">
              {completedLessons.filter(id => 
                category.lessons.some(lesson => lesson.id === id)
              ).length} of {category.lessons.length} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {category.lessons.map((lesson, index) => {
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
                            {lesson.xp} XP
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