import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, Play, Globe, Zap, Target, Leaf } from "lucide-react";

interface PathwayProps {
  completedLessons: number[];
}

export const LearningPathway = ({ completedLessons }: PathwayProps) => {
  const navigate = useNavigate();

  const pathwaySteps = [
    {
      id: 1,
      title: "Climate Basics",
      description: "Foundation of climate science",
      icon: Globe,
      color: "from-blue-500 to-cyan-400",
      lessons: [1, 2, 3, 4, 5],
      unlocked: true,
    },
    {
      id: 2,
      title: "Renewable Energy",
      description: "Clean energy solutions",
      icon: Zap,
      color: "from-yellow-500 to-orange-400",
      lessons: [6, 7, 8, 9, 10],
      unlocked: false,
    },
    {
      id: 3,
      title: "Waste Management",
      description: "Sustainable waste practices",
      icon: Target,
      color: "from-green-500 to-emerald-400",
      lessons: [11, 12, 13, 14, 15],
      unlocked: false,
    },
    {
      id: 4,
      title: "Ecosystem Protection",
      description: "Biodiversity conservation",
      icon: Leaf,
      color: "from-emerald-600 to-green-500",
      lessons: [16, 17, 18, 19, 20],
      unlocked: false,
    },
  ];

  const isStepUnlocked = (stepId: number) => {
    if (stepId === 1) return true;
    
    const previousStep = pathwaySteps[stepId - 2];
    if (!previousStep) return false;
    
    return previousStep.lessons.every(lessonId => completedLessons.includes(lessonId));
  };

  const getStepProgress = (lessons: number[]) => {
    const completed = lessons.filter(id => completedLessons.includes(id)).length;
    return Math.round((completed / lessons.length) * 100);
  };

  const getStepStatus = (stepId: number, lessons: number[]) => {
    const unlocked = isStepUnlocked(stepId);
    const progress = getStepProgress(lessons);
    
    if (!unlocked) return 'locked';
    if (progress === 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'available';
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Learning Pathway</h2>
        <p className="text-muted-foreground">Follow the path to become a climate champion</p>
      </div>

      <div className="relative">
        {/* Pathway Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-nature-primary/30 to-nature-secondary/30 h-full hidden md:block" />

        {pathwaySteps.map((step, index) => {
          const unlocked = isStepUnlocked(step.id);
          const progress = getStepProgress(step.lessons);
          const status = getStepStatus(step.id, step.lessons);
          const Icon = step.icon;
          const isEven = index % 2 === 0;

          return (
            <div key={step.id} className="relative mb-8 md:mb-12">
              {/* Pathway Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                  status === 'completed' 
                    ? 'bg-gradient-to-br from-success to-leaf' 
                    : status === 'in-progress'
                      ? `bg-gradient-to-br ${step.color}`
                      : unlocked
                        ? 'bg-white border-nature-primary'
                        : 'bg-muted border-muted-foreground/30'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="h-8 w-8 text-white" />
                  ) : status === 'locked' ? (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Icon className={`h-6 w-6 ${unlocked ? 'text-nature-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
              </div>

              {/* Content Card */}
              <div className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
                <div className={`w-full md:w-80 ${isEven ? 'md:mr-24' : 'md:ml-24'}`}>
                  <Card className={`transition-all duration-300 cursor-pointer ${
                    unlocked ? 'hover:shadow-lg hover:scale-105' : 'opacity-60'
                  } ${
                    status === 'completed' 
                      ? 'border-success bg-success/5' 
                      : status === 'in-progress'
                        ? 'border-nature-primary bg-nature-primary/5'
                        : ''
                  }`}
                  onClick={() => unlocked && navigate(`/lessons/${step.id}`)}
                  >
                    <CardContent className="p-6">
                      {/* Mobile Icon */}
                      <div className="flex items-center justify-between mb-4 md:hidden">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          status === 'completed' 
                            ? 'bg-gradient-to-br from-success to-leaf text-white' 
                            : status === 'in-progress'
                              ? `bg-gradient-to-br ${step.color} text-white`
                              : unlocked
                                ? 'bg-nature-primary/10 text-nature-primary'
                                : 'bg-muted text-muted-foreground'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : status === 'locked' ? (
                            <Lock className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <Badge className={
                          status === 'completed' 
                            ? 'bg-success text-success-foreground'
                            : status === 'in-progress'
                              ? 'bg-nature-primary text-white'
                              : status === 'locked'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-accent text-accent-foreground'
                        }>
                          {status === 'completed' ? 'Completed' : 
                           status === 'in-progress' ? 'In Progress' :
                           status === 'locked' ? 'Locked' : 'Available'}
                        </Badge>
                      </div>

                      {/* Desktop Badge */}
                      <div className="hidden md:flex justify-end mb-4">
                        <Badge className={
                          status === 'completed' 
                            ? 'bg-success text-success-foreground'
                            : status === 'in-progress'
                              ? 'bg-nature-primary text-white'
                              : status === 'locked'
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-accent text-accent-foreground'
                        }>
                          {status === 'completed' ? 'Completed' : 
                           status === 'in-progress' ? 'In Progress' :
                           status === 'locked' ? 'Locked' : 'Available'}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {step.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {step.lessons.filter(id => completedLessons.includes(id)).length}/{step.lessons.length} lessons
                            </span>
                          </div>
                          <Progress value={unlocked ? progress : 0} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {unlocked ? progress : 0}% complete
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-sm text-muted-foreground">
                            {step.lessons.length} lessons
                          </div>
                          {unlocked && (
                            <div className="flex items-center text-nature-primary text-sm font-medium">
                              <Play className="h-4 w-4 mr-1" />
                              {progress === 100 ? 'Review' : progress > 0 ? 'Continue' : 'Start'}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Connection Line for Mobile */}
              {index < pathwaySteps.length - 1 && (
                <div className="flex justify-center mt-4 md:hidden">
                  <div className="w-1 h-8 bg-gradient-to-b from-nature-primary/50 to-nature-secondary/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-nature-primary/10 to-nature-secondary/10 border-nature-primary/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-nature-primary">
                  {pathwaySteps.filter(step => getStepStatus(step.id, step.lessons) === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Categories Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {completedLessons.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">
                  {Math.round((completedLessons.length / 20) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {pathwaySteps.filter(step => isStepUnlocked(step.id)).length}
                </div>
                <div className="text-sm text-muted-foreground">Unlocked Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};