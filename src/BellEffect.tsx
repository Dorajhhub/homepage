import React, { useEffect } from "react";
import "./NewYear.css";

const BellEffect: React.FC = () => {
  useEffect(() => {
    const container = document.body;

    const bell = document.createElement("div");
    bell.innerHTML = "🔔";
    bell.className = "ringing-bell animate-ring";

    container.appendChild(bell);

    const handleAnimationEnd = () => {
      if (bell.parentNode) {
        bell.remove();
      }
    };
    bell.addEventListener("animationend", handleAnimationEnd);

    return () => {
      bell.removeEventListener("animationend", handleAnimationEnd);
      if (bell.parentNode) {
        bell.remove();
      }
    };
  }, []);

  return null;
};

export default BellEffect;
