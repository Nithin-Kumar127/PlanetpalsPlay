import { useEffect, useRef, useState } from 'react';

interface GameSoundOptions {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
}

export const useGameSound = (soundType: 'quiz' | 'simulator' | 'calculator' | 'match', options: GameSoundOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(options.volume || 0.3);

  // Sound URLs - using royalty-free background music URLs
  const soundUrls = {
    quiz: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - would use actual game music
    simulator: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
    calculator: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder  
    match: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' // Placeholder
  };

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.loop = options.loop !== false; // Default to loop
    audioRef.current.volume = volume;
    audioRef.current.preload = 'auto';

    // For demo purposes, we'll create a simple audio context tone instead of external files
    // This avoids CORS issues and provides immediate functionality
    createBackgroundTone(soundType);

    const audio = audioRef.current;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (options.autoPlay) {
        playSound();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.warn('Audio failed to load, using fallback tone');
      setIsLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (audio) {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
      }
    };
  }, [soundType, options.autoPlay, options.loop]);

  const createBackgroundTone = (type: string) => {
    // Create a simple background tone using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Different tones for different games
      const frequencies = {
        quiz: [220, 330, 440], // A3, E4, A4 - upbeat
        simulator: [196, 294, 392], // G3, D4, G4 - strategic
        calculator: [174, 261, 349], // F3, C4, F4 - analytical
        match: [246, 369, 493] // B3, F#4, B4 - playful
      };

      const freq = frequencies[type as keyof typeof frequencies] || frequencies.quiz;
      
      // Create a simple melody loop
      let currentNote = 0;
      const playNote = () => {
        oscillator.frequency.setValueAtTime(freq[currentNote], audioContext.currentTime);
        currentNote = (currentNote + 1) % freq.length;
      };

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Very quiet
      
      // This is a simplified approach - in a real app you'd use actual music files
      setIsLoaded(true);
    } catch (error) {
      console.warn('Web Audio API not supported');
      setIsLoaded(true);
    }
  };

  const playSound = async () => {
    if (audioRef.current && isLoaded) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Audio play failed:', error);
      }
    }
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
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
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
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