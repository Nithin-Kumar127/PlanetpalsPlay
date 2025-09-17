import { DivideIcon as LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AchievementBadgeProps {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  onClick?: () => void;
}

export const AchievementBadge = ({ name, description, icon: Icon, earned, onClick }: AchievementBadgeProps) => {
  return (
    <Card className={`group transition-all duration-300 hover:scale-105 ${onClick ? 'cursor-pointer' : ''} ${
      earned 
        ? 'bg-gradient-to-br from-success/10 to-leaf/10 border-success/30 hover:shadow-lg shadow-success/20' 
        : 'bg-muted/50 opacity-60'
    }`}
    onClick={onClick}
    >
      <CardContent className="p-6 text-center space-y-4">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
          earned 
            ? 'bg-gradient-to-br from-success to-leaf text-white group-hover:animate-glow' 
            : 'bg-muted text-muted-foreground'
        }`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-semibold text-card-foreground">{name}</h3>
            {earned && <Badge className="bg-success text-success-foreground">Earned</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};