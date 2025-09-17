import { useEffect, useState } from 'react';

export const ParallaxBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-nature-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs that follow mouse */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-nature-primary/10 to-nature-secondary/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px) translateY(${scrollY * 0.1}px)`,
          left: '10%',
          top: '20%',
        }}
      />
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-nature-secondary/15 to-accent/10 rounded-full blur-2xl"
        style={{
          transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px) translateY(${scrollY * 0.15}px)`,
          right: '15%',
          top: '40%',
        }}
      />
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-success/10 to-leaf/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * 0.04}px) translateY(${scrollY * 0.08}px)`,
          left: '60%',
          bottom: '20%',
        }}
      />

      {/* Animated leaf shapes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute text-nature-primary/20 text-4xl animate-float-slow"
            style={{
              left: `${20 + (i * 12)}%`,
              top: `${10 + (i * 8)}%`,
              transform: `translate(${mousePosition.x * (0.01 + i * 0.005)}px, ${mousePosition.y * (0.01 + i * 0.005)}px) translateY(${scrollY * (0.05 + i * 0.01)}px)`,
              animationDelay: `${i * 0.8}s`,
            }}
          >
            🍃
          </div>
        ))}
      </div>
    </div>
  );
};