import React, { useState, useEffect, useRef, useMemo } from "react";

// --- ⚙️ 고급 물리 엔진 기반 Snowfall ---
const Snowfall = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let snowflakes = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    class Flake {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.parallaxFactor = this.size * 0.5; // 큰 눈송이가 더 빨리 움직임
      }
      update() {
        this.y += this.speedY;
        this.x +=
          this.speedX +
          (mouse.current.x - canvas.width / 2) * 0.001 * this.parallaxFactor;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 200; i++) snowflakes.push(new Flake());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 배경 그라데이션 미세 효과
      const gradient = ctx.createRadialGradient(
        mouse.current.x,
        mouse.current.y,
        0,
        mouse.current.x,
        mouse.current.y,
        400
      );
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.05)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((f) => {
        f.update();
        f.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none"
    />
  );
};

// --- 🌲 인터랙티브 데코레이션 요소 ---
const HangingOrnaments = () => {
  return (
    <div className="fixed top-0 left-0 z-30 flex justify-around w-full h-40 px-20 pointer-events-none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex flex-col items-center animate-swing origin-top delay-[${
            i * 200
          }ms]`}
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 to-white/40" />
          <div
            className={`text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}
          >
            {i % 2 === 0 ? "🔔" : "🎁"}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 🎁 메인 애플리케이션 ---
const ChristmasApp = () => {
  const [stage, setStage] = useState("loading"); // loading -> intro -> main
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gift");

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenChristmasIntro");
    const timer = setTimeout(() => {
      setStage(hasSeen ? "main" : "intro");
      if (!hasSeen) {
        sessionStorage.setItem("hasSeenChristmasIntro", "true");
        setTimeout(() => setStage("main"), 4500);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#02040a] overflow-hidden text-slate-100 font-sans">
      <Snowfall />
      <HangingOrnaments />

      {/* --- 1. 진보된 인트로 (코드 2 & 4 확장) --- */}
      {stage === "intro" && (
        <div className="intro-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-3xl">
          <div className="relative text-center">
            <div className="flex justify-center mb-8 space-x-6 text-6xl md:text-8xl">
              <span className="inline-block intro-icon">🎄</span>
              <span
                className="inline-block intro-icon"
                style={{ animationDelay: "0.4s" }}
              >
                ✨
              </span>
              <span
                className="inline-block intro-icon"
                style={{ animationDelay: "0.2s" }}
              >
                🎁
              </span>
            </div>
            <h1 className="intro-text text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]">
              MERRY
              <br />
              <span className="font-serif italic text-red-600">Christmas</span>
            </h1>
            <div className="mt-8 w-40 h-[2px] bg-red-600 mx-auto overflow-hidden">
              <div className="w-full h-full bg-white animate-loading-bar" />
            </div>
          </div>
        </div>
      )}

      {/* --- 2. 스마트 알림 배너 (코드 3 확장) --- */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-0 w-[90%] max-w-2xl transition-all duration-1000 delay-[4000ms]
        ${
          stage === "main"
            ? "translate-y-0 opacity-100"
            : "-translate-y-20 opacity-0"
        }`}
      >
        <div className="relative p-[1.5px] rounded-2xl overflow-hidden group opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-green-500 to-red-600 animate-border-flow" />
          <div className="relative flex items-center justify-between px-6 py-3 border bg-black/80 backdrop-blur-2xl rounded-2xl border-white/10">
            <span className="text-xs font-bold tracking-[0.2em] text-red-500">
              EVENT LIVE
            </span>
            <p className="text-sm font-medium">
              크리스마스 특별 선물 상자가 활성화되었습니다!
            </p>
            <button className="text-[10px] px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              Details
            </button>
          </div>
        </div>
      </nav>

      {/* --- 3. 메인 대시보드 UI --- */}
      <main
        className={`relative z-10 pt-32 pb-20 flex flex-col items-center min-h-screen px-6 transition-all duration-[2500ms]
        ${
          stage === "main"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {/* 거대 트리 형상 배경 */}
        <div className="absolute flex items-center justify-center w-full h-full overflow-hidden -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none top-1/2 left-1/2">
          <div className="w-[800px] h-[800px] bg-emerald-900/10 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
        </div>

        {/* 헤더 섹션 */}
        <header className="relative mb-16 space-y-4 text-center">
          <div className="inline-block px-4 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-[10px] font-bold tracking-[0.3em] text-red-400 uppercase">
            Limited Edition UI 2025
          </div>
          <h2 className="text-5xl font-light tracking-tight md:text-7xl">
            Magical{" "}
            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-white animate-shimmer bg-[length:200%_auto]">
              Season
            </span>
          </h2>
          <p className="max-w-md mx-auto text-sm font-light leading-relaxed text-slate-400">
            당신의 스크린 속에 찾아온 따뜻한 겨울의 조각입니다.
            <br />올 한 해의 소중한 순간들을 기록하고 나누어보세요.
          </p>
        </header>

        {/* 3D 인터랙티브 허브 */}
        <div className="flex flex-col items-center justify-center w-full max-w-6xl gap-10 lg:flex-row">
          {/* 3D Flip Card (메인 카드) */}
          <div
            onClick={() => setIsCardOpen(!isCardOpen)}
            className="group relative w-full max-w-[380px] aspect-[4/5] cursor-pointer"
            style={{ perspective: "2500px" }}
          >
            <div
              className={`relative w-full h-full transition-all duration-[1000ms] cubic-bezier(0.23, 1, 0.32, 1) transform-style-3d shadow-2xl rounded-[3rem] ${
                isCardOpen
                  ? "rotate-y-180"
                  : "hover:rotate-x-12 hover:scale-[1.02]"
              }`}
            >
              {/* 앞면: 미니멀 프리미엄 디자인 */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-zinc-900 to-black rounded-[3rem] border border-white/10 flex flex-col items-center justify-between p-12 overflow-hidden shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]">
                <div className="flex items-start justify-between w-full opacity-40">
                  <span className="font-mono text-xs">NO. 1225-2025</span>
                  <span className="font-mono text-xs">CONFIDENTIAL</span>
                </div>
                <div className="relative transition-transform duration-700 group-hover:scale-110">
                  <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse" />
                  <span className="relative text-9xl">🎅</span>
                </div>
                <div className="w-full space-y-2">
                  <div className="w-12 h-1 bg-red-600" />
                  <p className="text-2xl font-black tracking-widest uppercase">
                    Secret Message
                  </p>
                  <p className="text-[10px] text-white/30 tracking-[0.4em]">
                    TOUCH TO UNLOCK THE MAGIC
                  </p>
                </div>
              </div>

              {/* 뒷면: 따뜻한 편지지 디자인 */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#ffffff] rounded-[3rem] p-12 flex flex-col justify-between text-zinc-900 shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
                <div className="space-y-8">
                  <div className="flex justify-between">
                    <div className="flex space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 bg-red-600 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-zinc-400">
                      DEC 25
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black leading-tight tracking-tighter">
                      Merry
                      <br />
                      <span className="text-red-600">Christmas!</span>
                    </h3>
                    <p className="text-lg font-medium leading-relaxed text-zinc-600">
                      소중한 당신의 2025년이
                      <br />
                      행복하게 마무리되길 바라며,
                      <br />
                      축복의 마음을 보냅니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between pt-6 border-t border-zinc-100">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                      Sent From
                    </p>
                    <p className="font-serif text-lg italic text-red-600"></p>
                  </div>
                  <span className="text-5xl">🕊️</span>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드 대시보드 리스트 */}
          <div className="flex flex-col gap-4 w-full max-w-[400px]">
            {["Music List", "Gift History", "Friends Invite"].map(
              (item, idx) => (
                <div
                  key={item}
                  className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/5 hover:border-white/20 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-300 cursor-pointer"
                  style={{ transitionDelay: `${4000 + idx * 150}ms` }}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform bg-red-600/20 rounded-2xl group-hover:scale-110">
                      {idx === 0 ? "🎵" : idx === 1 ? "🎁" : "👥"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide">
                        {item}
                      </h4>
                      <p className="text-[10px] text-white/40">
                        업데이트 완료: 2025-12-25
                      </p>
                    </div>
                  </div>
                  <span className="transition-opacity duration-300 transform translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
                    →
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        <footer className="mt-auto pt-20 text-[10px] tracking-[0.6em] font-light text-white/20 uppercase flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <span>Security Verified</span>
            <span>256-Bit Encrypted</span>
            <span>Holiday Mode On</span>
          </div>
          <p>© 2025 THE MAGICAL UI ENGINE. ALL RIGHTS RESERVED.</p>
        </footer>
      </main>

      {/* --- ✨ 마법의 CSS 주입 (코드 4 확장) --- */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@400;700&display=swap");

        .intro-overlay {
          animation: fadeOut 1s ease-out 4s forwards;
        }

        .intro-text {
          font-family: "Mountains of Christmas", cursive;
          animation: zoomIn 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .intro-icon {
          animation: popIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
          transform: scale(0);
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.5) translateY(40px) rotate(-5deg);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0) rotate(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-45deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes loading-bar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes swing {
          0%,
          100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes border-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
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
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-x-12 {
          transform: rotateX(12deg);
        }

        .animate-swing {
          animation: swing 4s ease-in-out infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
        .animate-border-flow {
          background-size: 200% 200%;
          animation: border-flow 4s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ChristmasApp;
