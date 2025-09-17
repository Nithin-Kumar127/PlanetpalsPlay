import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
          isHovering ? 'scale-150' : 'scale-100'
        } ${isClicking ? 'scale-75' : ''}`}
        style={{
          left: position.x - 10,
          top: position.y - 10,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="w-5 h-5 bg-nature-primary rounded-full opacity-80 animate-pulse" />
      </div>

      {/* Cursor trail */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-500 ease-out"
        style={{
          left: position.x - 15,
          top: position.y - 15,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className={`w-8 h-8 border-2 border-nature-primary/40 rounded-full ${
          isHovering ? 'scale-200' : 'scale-100'
        } transition-transform duration-300`} />
      </div>

      {/* Leaf cursor for eco theme */}
      {isHovering && (
        <div
          className="fixed pointer-events-none z-45 transition-all duration-200"
          style={{
            left: position.x + 15,
            top: position.y - 15,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <span className="text-nature-primary text-lg animate-bounce">🍃</span>
        </div>
      )}
    </>
  );
};