import React, { useState } from "react";
import { Link } from "react-router-dom";

type Difficulty = "보통";

interface ServiceTerminationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirect: () => void;
}

const ServiceTerminationModal: React.FC<ServiceTerminationModalProps> = ({
  isOpen,
  onClose,
  onRedirect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 transition-all transform bg-white shadow-2xl dark:bg-gray-800 rounded-xl">
        <div className="text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h3 className="mb-4 text-xl font-bold text-red-600 dark:text-red-400">
            서비스 종료 안내
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            클라이밍 미니게임은 서비스가 종료되었습니다. 다른 미니게임을
            즐겨보세요!
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onRedirect}
              className="flex-1 px-4 py-3 font-bold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg"
            >
              미니게임 목록으로 이동
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 font-bold text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-gray-400 to-gray-600 hover:shadow-lg"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClimbingMinigame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("보통");
  const [isSpeedRunMode, setIsSpeedRunMode] = useState(false);
  const [showTerminationModal, setShowTerminationModal] = useState(true);

  const difficulties: Difficulty[] = ["보통"];

  const handleCloseModal = () => {
    setShowTerminationModal(false);
  };

  const handleRedirect = () => {
    window.location.href = "/#/minigames";
  };

  return (
    <div className="max-w-2xl p-8 mx-auto text-center bg-gray-100 shadow-lg dark:bg-gray-800 rounded-2xl">
      <h1 className="mb-10 text-5xl font-extrabold text-gray-800 dark:text-white">
        클라이밍 미니게임(섭종)
      </h1>

      {/* 난이도 설정 */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-700 dark:text-gray-300">
          난이도
        </h2>
        <div className="flex justify-center gap-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-xl">
          {difficulties.map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-300
                ${
                  difficulty === level
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 추가 모드 */}
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-700 dark:text-gray-300">
          추가 모드
        </h2>
        <label className="inline-flex items-center cursor-pointer"></label>
      </div>

      {/* 게임 시작 버튼 */}
      <Link
        to="/climbing-minigame/play"
        state={{ difficulty, isSpeedRunMode }}
        className="inline-block w-full px-8 py-4 text-2xl font-bold text-white transition-all duration-300 transform bg-green-600 shadow-lg rounded-xl hover:bg-green-700 hover:scale-105"
      >
        START
      </Link>

      {/* Service Termination Modal */}
      <ServiceTerminationModal
        isOpen={showTerminationModal}
        onClose={handleCloseModal}
        onRedirect={handleRedirect}
      />
    </div>
  );
};

export default ClimbingMinigame;
