import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
//import { Joystick } from "react-joystick-component";
// 배경 이미지 import (TypeScript에서 모듈 선언이 없을 경우 호환되도록 require 사용)
//const mountainBackground: string = require("../assets/images/mountain-background.png");

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;
const WORLD_HEIGHT = 10000; // 100m 목표
const PLAYER_SIZE = 40;
const GRAVITY = 0.3;
const JUMP_STRENGTH = -17;
const MOVE_SPEED = 7.5;

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "static" | "movingX";
  // 움직이는 발판용 데이터
  direction?: number;
  range?: number;
  originX?: number;
}

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
          </div>
        </div>
      </div>
    </div>
  );
};

const ClimbingMinigamePlay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty, isSpeedRunMode } = location.state || {
    difficulty: "정보 없음",
    isSpeedRunMode: false,
  };

  const [showTerminationModal, setShowTerminationModal] = useState(true);

  const handleCloseModal = () => {
    setShowTerminationModal(false);
  };

  const handleRedirect = () => {
    navigate("/minigames");
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Service Termination Modal */}
      <ServiceTerminationModal
        isOpen={showTerminationModal}
        onClose={handleCloseModal}
        onRedirect={handleRedirect}
      />
    </div>
  );
};

export default ClimbingMinigamePlay;
