
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-game-wood-light">
      <div className="text-center game-panel">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">The zombies have eaten this page!</p>
        <a href="/" className="game-button inline-block">
          Return to the Battlefield
        </a>
      </div>
    </div>
  );
};

export default NotFound;
