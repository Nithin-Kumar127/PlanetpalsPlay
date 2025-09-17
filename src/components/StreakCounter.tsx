import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCounterProps {
  streak: number;
  onClick?: () => void;
}

export const StreakCounter = ({ streak, onClick }: StreakCounterProps) => {
  return (
    <Card 
      className={`hover:shadow-md transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Learning Streak</p>
            <p className="text-2xl font-bold text-card-foreground">{streak} days</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white animate-bounce-gentle">
            <Flame className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};