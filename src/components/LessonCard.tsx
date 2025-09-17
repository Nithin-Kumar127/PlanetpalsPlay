import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Lock } from "lucide-react";

interface LessonCardProps {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  difficulty: string;
  color: string;
  onStartLearning?: () => void;
}

export const LessonCard = ({
  title,
  description,
  icon: Icon,
  progress,
  lessonsCompleted,
  totalLessons,
  difficulty,
  color,
  onStartLearning,
}: LessonCardProps) => {
  const isLocked = progress === 0 && lessonsCompleted === 0;
  
  const difficultyColors = {
    Beginner: "bg-success text-success-foreground",
    Intermediate: "bg-warning text-warning-foreground", 
    Advanced: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge className={difficultyColors[difficulty as keyof typeof difficultyColors]}>
            {difficulty}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-nature-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{lessonsCompleted}/{totalLessons} lessons</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {progress}% complete
          </div>
        </div>
        
        <Button 
          className="w-full" 
          variant={isLocked ? "secondary" : "default"}
          disabled={isLocked}
          onClick={onStartLearning}
        >
          {isLocked ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Complete previous lessons
            </>
          ) : progress === 100 ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Review Lessons
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Continue Learning
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};