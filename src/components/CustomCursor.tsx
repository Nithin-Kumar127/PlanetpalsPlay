import { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isInChatbot, setIsInChatbot] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if mouse is over chatbot
      const target = e.target as HTMLElement;
      const chatbotContainer = target.closest('.chatbot-container');
      setIsInChatbot(!!chatbotContainer);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof Element && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.closest('[role="button"]'))) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target instanceof Element && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.closest('[role="button"]'))) {
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

  // Don't render custom cursor when in chatbot
  if (isInChatbot) {
    return null;
  }

  return (
    <>
      {/* Main cursor - larger and more visible */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-300 ease-out ${
          isHovering ? 'scale-200' : 'scale-100'
        } ${isClicking ? 'scale-75' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-nature-primary to-nature-secondary rounded-full shadow-lg border-2 border-white/50" />
      </div>

      {/* Cursor trail - larger and more visible */}
      <div
        className="fixed pointer-events-none z-40 transition-all duration-500 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className={`w-12 h-12 border-3 border-nature-primary/60 rounded-full ${
          isHovering ? 'scale-250' : 'scale-100'
        } transition-transform duration-400`} />
      </div>

      {/* Outer glow ring */}
      <div
        className="fixed pointer-events-none z-35 transition-all duration-700 ease-out"
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div className={`w-16 h-16 border border-nature-primary/30 rounded-full ${
          isHovering ? 'scale-300' : 'scale-100'
        } transition-transform duration-500`} />
      </div>

      {/* Leaf cursor for eco theme - larger */}
      {isHovering && (
        <div
          className="fixed pointer-events-none z-45 transition-all duration-300"
          style={{
            left: position.x + 20,
            top: position.y - 20,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <span className="text-nature-primary text-2xl animate-bounce drop-shadow-lg">🍃</span>
        </div>
      )}

      {/* Click ripple effect */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-30 animate-ping"
          style={{
            left: position.x,
            top: position.y,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <div className="w-20 h-20 border-2 border-nature-primary/50 rounded-full" />
        </div>
      )}
    </>
  );
};