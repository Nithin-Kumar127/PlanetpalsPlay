import { DivideIcon as LucideIcon } from "lucide-react";
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
  unlocked: boolean;
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
  unlocked,
  onStartLearning,
}: LessonCardProps) => {
  
  const difficultyColors = {
    Beginner: "bg-success text-success-foreground",
    Intermediate: "bg-warning text-warning-foreground", 
    Advanced: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className={`group transition-all duration-300 overflow-hidden ${
      unlocked ? 'hover:shadow-lg hover:scale-[1.02]' : 'opacity-60'
    }`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${unlocked ? color : 'bg-muted'} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge className={difficultyColors[difficulty as keyof typeof difficultyColors]}>
            {difficulty}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold transition-colors ${
            unlocked ? 'text-card-foreground group-hover:text-nature-primary' : 'text-muted-foreground'
          }`}>
            {title}
          </h3>
          <p className={`text-sm ${unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
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
          <Progress value={unlocked ? progress : 0} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {unlocked ? progress : 0}% complete
          </div>
        </div>
        
        <Button 
          className="w-full" 
          variant={!unlocked ? "secondary" : "default"}
          disabled={!unlocked}
          onClick={onStartLearning}
        >
          {!unlocked ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Complete previous category
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