import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import {
  ArrowDownTrayIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gamepad2,
  Heart,
  Trophy,
  Users,
  Coins,
  ArrowRight,
} from "lucide-react";

const NyangNyangDescription = () => {
  return (
    <>
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <h1 className="mb-4 text-3xl font-bold">Nyang Nyang Description</h1>
        <p className="mb-4 text-lg">
          Welcome to the Nyang Nyang description page!
        </p>
        <button
          className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => {
            window.location.href = "https://nyangofficialpage.pages.dev";
          }}
        >
          리뉴얼 된 공식페이지로 가기
        </button>
      </div>
    </>
  );
};

export default NyangNyangDescription;
