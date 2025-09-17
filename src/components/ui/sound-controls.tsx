import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SoundControlsProps {
  isPlaying: boolean;
  volume: number;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export const SoundControls: React.FC<SoundControlsProps> = ({
  isPlaying,
  volume,
  onToggleSound,
  onVolumeChange,
  className = ''
}) => {
  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSound}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex items-center space-x-2 min-w-[100px]">
            {volume === 0 ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              max={100}
              step={5}
              className="flex-1"
            />
          </div>
          
          <span className="text-xs text-white/70 min-w-[30px]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};