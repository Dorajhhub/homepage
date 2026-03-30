import React from "react";
import { Link } from "react-router-dom";

const Minigames: React.FC = () => {
  return (
    <div className="max-w-4xl p-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center text-gray-800 dark:text-white">
        미니게임
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/climbing-minigame"></Link>
      </div>
    </div>
  );
};

export default Minigames;
