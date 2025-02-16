import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";

const Index = () => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const moveNoButton = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    // Get viewport dimensions
    const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    // Button dimensions with extra padding for safety
    const buttonWidth = 160;  // Width + padding
    const buttonHeight = 70;  // Height + padding
    
    // Safe zone margins
    const safeMargin = 20;
    
    // Calculate maximum positions while keeping the button fully visible
    const maxX = viewportWidth - buttonWidth - safeMargin;
    const maxY = viewportHeight - buttonHeight - safeMargin;
    
    // Generate random position within safe bounds
    const x = Math.min(Math.max(safeMargin, Math.random() * maxX), maxX);
    const y = Math.min(Math.max(safeMargin, Math.random() * maxY), maxY);
    
    // Double-check that the position is within viewport
    const finalX = Math.min(Math.max(safeMargin, x), maxX);
    const finalY = Math.min(Math.max(safeMargin, y), maxY);
    
    setNoButtonPosition({ x: finalX, y: finalY });
  }, [hasInteracted]);

  useEffect(() => {
    // Create floating hearts
    const initialHearts = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
    }));
    setHearts(initialHearts);

    // Add window resize handler with debounce
    let resizeTimeout: number;
    const handleResize = () => {
      if (hasInteracted) {
        // Clear any existing timeout
        window.clearTimeout(resizeTimeout);
        // Set new timeout
        resizeTimeout = window.setTimeout(() => {
          moveNoButton();
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(resizeTimeout);
    };
  }, [moveNoButton, hasInteracted]);

  const handleYesClick = () => {
    setAccepted(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Floating Hearts Background */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.id * 0.5}s`,
          }}
        >
          <Heart
            className="text-pink-300"
            size={heart.id % 2 ? 24 : 16}
            fill="currentColor"
          />
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full mx-auto text-center">
          {!accepted ? (
            <>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100">
                <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-pink-600">
                  Will you be my Valentine?
                </h1>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={handleYesClick}
                    className="button-hover bg-pink-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:bg-pink-600 transition-all duration-300"
                  >
                    Yes
                  </button>
                  <button
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                    className="button-hover bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-medium shadow-lg hover:bg-gray-200 transition-all duration-300"
                    style={{
                      position: hasInteracted ? "absolute" : "relative",
                      left: hasInteracted ? `${noButtonPosition.x}px` : "auto",
                      top: hasInteracted ? `${noButtonPosition.y}px` : "auto",
                      zIndex: 50,
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="success-message bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100">
              <Heart
                className="text-pink-500 mx-auto mb-4"
                size={48}
                fill="currentColor"
              />
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-pink-600">
                I'm glad I found you!
              </h2>
              <p className="text-gray-600 text-lg">
                Thank you for making my heart smile
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
