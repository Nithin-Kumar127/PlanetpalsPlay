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
      {/* Large floating orbs with slow movement */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-nature-primary/20 to-nature-secondary/15 rounded-full blur-3xl transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.1}px) translateY(${scrollY * 0.05}px)`,
          left: '10%',
          top: '20%',
        }}
      />
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-success/15 to-leaf/20 rounded-full blur-2xl transition-transform duration-1200 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.08}px) translateY(${scrollY * 0.08}px)`,
          right: '15%',
          top: '40%',
        }}
      />
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-accent/15 to-nature-secondary/10 rounded-full blur-3xl transition-transform duration-1500 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.12}px, ${mousePosition.y * 0.15}px) translateY(${scrollY * 0.03}px)`,
          left: '60%',
          bottom: '20%',
        }}
      />

      {/* Geometric shapes for clean design */}
      <div
        className="absolute w-32 h-32 border border-nature-primary/20 rounded-full transition-transform duration-2000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.06}px) translateY(${scrollY * 0.04}px) rotate(${mousePosition.x * 0.1}deg)`,
          left: '20%',
          top: '60%',
        }}
      />
      <div
        className="absolute w-24 h-24 border border-success/25 rounded-lg transition-transform duration-1800 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -0.06}px, ${mousePosition.y * 0.08}px) translateY(${scrollY * 0.06}px) rotate(${mousePosition.x * -0.08}deg)`,
          right: '25%',
          top: '70%',
        }}
      />

      {/* Subtle floating particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-nature-primary/30 rounded-full transition-transform duration-3000 ease-out"
            style={{
              left: `${15 + (i * 10)}%`,
              top: `${20 + (i * 8)}%`,
              transform: `translate(${mousePosition.x * (0.03 + i * 0.01)}px, ${mousePosition.y * (0.02 + i * 0.008)}px) translateY(${scrollY * (0.02 + i * 0.005)}px)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Clean leaf elements */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="absolute text-nature-primary/40 text-5xl transition-transform duration-2500 ease-out animate-float-slow"
            style={{
              left: `${25 + (i * 20)}%`,
              top: `${15 + (i * 15)}%`,
              transform: `translate(${mousePosition.x * (0.05 + i * 0.02)}px, ${mousePosition.y * (0.04 + i * 0.015)}px) translateY(${scrollY * (0.03 + i * 0.01)}px)`,
              animationDelay: `${i * 1.2}s`,
            }}
          >
            🍃
          </div>
        ))}
      </div>
    </div>
  );
};