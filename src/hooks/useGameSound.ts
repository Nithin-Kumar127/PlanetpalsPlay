import { useEffect, useRef, useState } from 'react';

interface GameSoundOptions {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export const useGameSound = (soundType: 'quiz' | 'simulator' | 'calculator' | 'match', options: GameSoundOptions = {}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(options.volume || 0.3);

  useEffect(() => {
    // Initialize audio context
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsLoaded(true);
      
      if (options.autoPlay) {
        setTimeout(() => playSound(), 100);
      }
    } catch (error) {
      console.warn('Web Audio API not supported');
      setIsLoaded(true);
    }

    return () => {
      stopSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [soundType]);

  const createBackgroundTone = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Resume audio context if suspended (required by browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Different musical patterns for each game
    const soundConfigs = {
      quiz: {
        frequencies: [261.63, 329.63, 392.00], // C4, E4, G4 - Major chord
        waveType: 'sine' as OscillatorType,
        filterFreq: 800,
        baseVolume: 0.15
      },
      simulator: {
        frequencies: [220.00, 261.63, 329.63], // A3, C4, E4 - Am chord
        waveType: 'triangle' as OscillatorType,
        filterFreq: 600,
        baseVolume: 0.12
      },
      calculator: {
        frequencies: [196.00, 246.94, 293.66], // G3, B3, D4 - G major
        waveType: 'sawtooth' as OscillatorType,
        filterFreq: 1000,
        baseVolume: 0.1
      },
      match: {
        frequencies: [293.66, 369.99, 440.00], // D4, F#4, A4 - D major
        waveType: 'square' as OscillatorType,
        filterFreq: 1200,
        baseVolume: 0.18
      }
    };

    const config = soundConfigs[soundType];
    
    // Set up filter for smoother sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(config.filterFreq, audioContext.currentTime);
    
    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.type = config.waveType;
    oscillator.frequency.setValueAtTime(config.frequencies[0], audioContext.currentTime);
    
    // Set volume
    gainNode.gain.setValueAtTime(config.baseVolume * volume, audioContext.currentTime);
    
    // Create a simple melody pattern
    let noteIndex = 0;
    const changeNote = () => {
      if (oscillatorRef.current && audioContextRef.current) {
        noteIndex = (noteIndex + 1) % config.frequencies.length;
        oscillator.frequency.setValueAtTime(
          config.frequencies[noteIndex], 
          audioContext.currentTime
        );
      }
    };

    // Change notes every 2 seconds for variety
    const noteInterval = setInterval(changeNote, 2000);
    
    // Start the oscillator
    oscillator.start();
    
    // Store references
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    // Clean up interval when oscillator ends
    oscillator.onended = () => {
      clearInterval(noteInterval);
    };

    return () => {
      clearInterval(noteInterval);
    };
  };

  const playSound = async () => {
    if (!audioContextRef.current || !isLoaded) return;

    try {
      // Stop any existing sound
      stopSound();
      
      // Create new background tone
      createBackgroundTone();
      setIsPlaying(true);
      
    } catch (error) {
      console.warn('Audio play failed:', error);
    }
  };

  const pauseSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        setIsPlaying(false);
      } catch (error) {
        console.warn('Audio pause failed:', error);
      }
    }
  };

  const stopSound = () => {
    pauseSound();
  };

  const toggleSound = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };

  const changeVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        clampedVolume * 0.15, 
        audioContextRef.current?.currentTime || 0
      );
    }
  };

  return {
    isPlaying,
    isLoaded,
    volume,
    playSound,
    pauseSound,
    stopSound,
    toggleSound,
    changeVolume
  };
};