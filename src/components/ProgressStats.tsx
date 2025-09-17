import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressStatsProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export const ProgressStats = ({ title, value, icon: Icon, color, onClick }: ProgressStatsProps) => {
  return (
    <Card 
      className={`hover:shadow-md transition-all duration-300 hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
          </div>
          <div className={`p-2 rounded-lg bg-muted ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};