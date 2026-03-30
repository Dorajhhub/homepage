import React, { useState } from "react";
import axios from "axios";
import {
  SignalIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const TARGET_URL = "https://dorajhhub.github.io/homepage#/ping";

const PingChecker = () => {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<
    "ready" | "checking" | "success" | "error"
  >("ready");

  const checkServerStatus = async () => {
    setStatus("checking");
    setLatency(null);

    const startTime = Date.now();

    try {
      // 캐시 방지를 위한 타임스탬프와 헤더 설정
      await axios.get(`${TARGET_URL}`, {
        params: { t: new Date().getTime() },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      const measuredLatency = Date.now() - startTime;
      setLatency(measuredLatency);
      setStatus("success");
    } catch (error) {
      console.error("Server check failed:", error);
      setStatus("error");
    }
  };

  // 응답 속도에 따른 상태 텍스트 및 컬러 판별
  const getPingQuality = (ms: number) => {
    if (ms < 150)
      return {
        label: "Excellent",
        color: "text-emerald-500",
        bg: "border-emerald-500",
      };
    if (ms < 400)
      return {
        label: "Normal",
        color: "text-amber-500",
        bg: "border-amber-500",
      };
    return { label: "Slow", color: "text-rose-500", bg: "border-rose-500" };
  };

  const quality = latency ? getPingQuality(latency) : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl p-10 overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl text-center">
        {/* Background Decorative Element */}
        <div className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-white shadow-lg rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/30 animate-float">
            <SignalIcon className="w-8 h-8" />
          </div>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            네트워크 상태 진단
          </h2>
          <p className="font-medium text-gray-500 dark:text-gray-400">
            서버와의 연결 품질을 실시간으로 측정합니다.
          </p>
        </div>

        {/* Status Visualizer */}
        <div className="relative flex flex-col items-center justify-center mb-10">
          <div
            className={`w-56 h-56 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-700 ${
              status === "checking"
                ? "border-indigo-500 border-t-transparent animate-spin"
                : status === "success"
                  ? quality?.bg
                  : status === "error"
                    ? "border-rose-500 shadow-lg shadow-rose-500/20"
                    : "border-dashed border-gray-300 dark:border-gray-700"
            }`}
          >
            {/* Inner Content (Spinning 방지를 위해 별도 div) */}
            <div
              className={`flex flex-col items-center ${
                status === "checking" ? "animate-reverse-spin" : ""
              }`}
            >
              {status === "ready" && (
                <span className="font-bold tracking-widest text-gray-400 uppercase">
                  Standby
                </span>
              )}

              {status === "checking" && (
                <div className="text-indigo-500 animate-pulse">
                  <span className="text-2xl font-black tracking-tighter">
                    Testing...
                  </span>
                </div>
              )}

              {status === "success" && (
                <div className="animate-scale-in">
                  <div className="mb-1 text-5xl font-black text-gray-900 dark:text-white">
                    {latency}
                  </div>
                  <div
                    className={`text-sm font-black uppercase tracking-widest ${quality?.color}`}
                  >
                    ms / {quality?.label}
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="animate-shake">
                  <XCircleIcon className="mb-2 w-14 h-14 text-rose-500" />
                  <span className="font-bold uppercase text-rose-500">
                    Timeout
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={checkServerStatus}
          disabled={status === "checking"}
          className="group relative w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowPathIcon
              className={`w-5 h-5 ${
                status === "checking"
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
            {status === "checking" ? "진단 중..." : "테스트 시작하기"}
          </div>
        </button>

        {/* Footer Info */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" /> Good
            (&lt;150ms)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" /> Fair
            (&lt;400ms)
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-rose-500" /> Poor (400ms+)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PingChecker;
