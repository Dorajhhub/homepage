import React, { useState, useEffect, useRef, useCallback } from "react";
import "./NewYear.css";

// --- 🎆 1. Fireworks Engine: 물리 연산 및 색상 동기화 ---
const Fireworks = ({ isActive }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    class Particle {
      constructor(x, y, color, speedScale = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 5 + 2) * speedScale;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.007;
        this.gravity = 0.06;
        this.friction = 0.97;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createFirework = (x, y, isSpecial = false) => {
      const colors = isSpecial
        ? ["#FFD700", "#FFF"]
        : ["#FFD700", "#FF4500", "#00BFFF", "#FF69B4", "#ADFF2F"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = isSpecial ? 100 : 50;
      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(
            x || Math.random() * canvas.width,
            y || Math.random() * canvas.height * 0.4,
            color,
            isSpecial ? 1.5 : 1
          )
        );
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)"; // 잔상 효과 최적화
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.04) createFirework();
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // 전역 창으로 노출 (종소리와 동기화용)
    window.triggerFirework = (x, y) => createFirework(x, y, true);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [isActive]);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

// --- 🔔 2. New Year Bell Effect: 인터랙티브 종소리 트리거 ---
const BellManager = ({ onBellRing }) => {
  useEffect(() => {
    const triggerBell = () => {
      const bell = document.createElement("div");
      bell.innerHTML = "🔔";
      bell.className = "ringing-bell animate-ring";
      document.body.appendChild(bell);

      // 종이 울릴 때 불꽃 피날레 연동
      if (window.triggerFirework) {
        window.triggerFirework(window.innerWidth / 2, window.innerHeight * 0.4);
      }
      if (onBellRing) onBellRing();

      bell.addEventListener("animationend", () => bell.remove());
    };

    const timer = setTimeout(triggerBell, 4500); // 인트로 종료 직후 실행
    return () => clearTimeout(timer);
  }, [onBellRing]);
  return null;
};

// --- 🌅 3. New Year Master App ---
const NewYearApp = () => {
  const [stage, setStage] = useState("loading"); // loading -> intro -> main
  const [isNewYearActive, setIsNewYearActive] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenNewYearIntro");
    if (hasSeen) {
      setStage("main");
      setIsNewYearActive(true);
    } else {
      setStage("intro");
      sessionStorage.setItem("hasSeenNewYearIntro", "true");
      setTimeout(() => {
        setStage("main");
        setIsNewYearActive(true);
      }, 4000);
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#020202] text-[#ffd700] overflow-hidden font-sans selection:bg-[#ffd700] selection:text-black">
      <Fireworks isActive={isNewYearActive} />
      {isNewYearActive && (
        <BellManager onBellRing={() => console.log("Happy 2026!")} />
      )}

      {/* --- Intro Layer (Code 2, 4 통합) --- */}
      {stage === "intro" && (
        <div className="ny-intro-overlay backdrop-blur-3xl bg-black/90">
          <div className="flex-col gap-6 scale-110 ny-intro-content md:scale-150">
            <div className="flex gap-4">
              <span className="ny-intro-icon">🥳</span>
              <span
                className="ny-intro-icon"
                style={{ animationDelay: "0.3s" }}
              >
                ✨
              </span>
            </div>
            <h1 className="font-black tracking-tighter text-center ny-intro-text">
              HAPPY
              <br />
              <span className="font-serif italic">NEW YEAR</span>
            </h1>
            <p className="text-xs tracking-[1em] opacity-50 animate-pulse uppercase">
              Entering 2026
            </p>
          </div>
        </div>
      )}

      {/* --- Gold Banner (Code 3 통합) --- */}
      <nav
        className={`fixed top-0 left-0 w-full z-[0] transition-all duration-1000 ${
          stage === "main" ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-[#111] border-b-[3px] border-[#ffd700] py-4 shadow-[0_0_30px_rgba(255,215,0,0.3)] opacity-50">
          <div className="flex items-center justify-between px-8 mx-auto max-w-7xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">🧧</span>
              <span className="text-lg font-bold tracking-widest">
                2026 PREMIERE
              </span>
            </div>
            <p className="hidden lg:block font-medium tracking-[0.2em] animate-shimmer bg-gradient-to-r from-[#ffd700] via-white to-[#ffd700] bg-clip-text text-transparent bg-[length:200%_auto]">
              새로운 태양 아래, 당신의 모든 꿈이 이루어지는 한 해가 되길
              바랍니다.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
              <span className="font-mono text-xs opacity-60">
                SEOUL 00:00:00
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Main Contents --- */}
      <main
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen pt-20 transition-all duration-[2000ms] ${
          stage === "main"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        {/* 거대 골든 오로라 배경 */}
        <div className="absolute w-full h-full overflow-hidden -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-600/5 blur-[180px] rounded-full animate-pulse" />
        </div>

        <header className="relative mb-16 space-y-6 text-center">
          <div className="inline-block px-6 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-full text-xs font-bold tracking-[0.4em] uppercase">
            Official 2026 Release
          </div>
          <h2 className="text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-[#ffd700] to-yellow-800 drop-shadow-[0_10px_30px_rgba(255,215,0,0.4)]">
            DAWN
          </h2>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            어둠을 뚫고 솟아오르는 빛처럼,
            <br />
            당신의 <span className="font-bold text-white">2026년</span>은 더욱
            찬란할 것입니다.
          </p>
        </header>

        {/* 인터랙티브 타일 메뉴 */}
        <div className="grid w-full grid-cols-1 gap-6 px-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl">
          {[
            { label: "New Plan", icon: "📝", val: "소망 기록" },
            { label: "Fortune", icon: "🔮", val: "신년 운세" },
            { label: "Gallery", icon: "📸", val: "기억 저장" },
            { label: "Settings", icon: "⚙️", val: "환경 설정" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-1 overflow-hidden transition-all duration-500 cursor-pointer group rounded-3xl hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#111] p-8 rounded-[1.4rem] border border-white/5 flex flex-col items-center gap-4">
                <span className="text-4xl transition-transform duration-300 group-hover:rotate-12">
                  {item.icon}
                </span>
                <div className="text-center">
                  <h4 className="font-bold tracking-widest text-white">
                    {item.label}
                  </h4>
                  <p className="text-[10px] opacity-40 uppercase mt-1">
                    {item.val}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="pb-10 mt-24 space-y-4 text-center">
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mx-auto opacity-30"></div>
          <p className="text-[9px] tracking-[0.8em] font-light opacity-30 uppercase">
            Designed for the New Beginnings & Prosperity
          </p>
        </footer>
      </main>

      {/* --- 🎨 코드 4 확장 CSS --- */}
      <style jsx>{`
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* NewYear.css의 기존 애니메이션들을 React 내부에 최적화 배치 가능 */
      `}</style>
    </div>
  );
};

export default NewYearApp;
