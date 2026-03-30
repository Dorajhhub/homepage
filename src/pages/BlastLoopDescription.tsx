import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import {
  Gamepad2,
  Users,
  ArrowRight,
  Sword,
  Map,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

// --- Types ---
interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  game: string;
}

const Rpg: React.FC = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/news.json`)
      .then((res) => res.json())
      .then((data) => {
        // Filter for announcements or relevant news
        setNews(
          data.newsList
            .filter((n: NewsItem) => n.game === "blastloop")
            .slice(0, 3)
        );
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white selection:bg-pink-500/30">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full top-[-10%] left-[-10%] bg-pink-500/10 blur-[120px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-5%] right-[-5%] bg-purple-500/10 blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 px-6 py-8 mx-auto max-w-7xl">
        {/* Navigation / Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors text-slate-400 hover:text-pink-400 group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          돌아가기
        </button>

        {/* Hero Section */}
        <div className="relative mb-16 group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-1 shadow-2xl transition-all duration-500 hover:shadow-pink-500/20">
          <div className="relative bg-[#0f172a] dark:bg-slate-950 rounded-[2.4rem] p-10 md:p-16 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute w-64 h-64 rounded-full -top-24 -right-24 bg-pink-500/10 blur-3xl animate-pulse" />
            <div className="absolute w-64 h-64 rounded-full -bottom-24 -left-24 bg-purple-500/10 blur-3xl animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-8 text-7xl"
              >
                ⚔️
              </motion.div>
              <h1 className="mb-6 text-5xl font-black tracking-tighter text-transparent md:text-7xl bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text">
                BLAST LOOP
              </h1>
              <p className="max-w-2xl mb-10 text-lg font-light leading-relaxed text-slate-300 md:text-xl">
                대규모 오픈월드 · 실시간 전투 · 성장 중심 RPG. <br className="hidden md:block" />
                끝없는 루프 속에서 당신만의 전설을 써내려 가세요.
              </p>
              <div className="flex flex-col justify-center w-full gap-4 sm:flex-row">
                <div className="flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl cursor-default">
                  <SparklesIcon className="w-5 h-5 text-pink-400" />
                  개발 진행 중
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-8">
            {/* Intro Card */}
            <section className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-10 h-10 bg-pink-500/10 rounded-xl text-pink-400">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  Project Introduction
                </h2>
              </div>

              <p className="mb-8 text-lg font-light leading-relaxed text-slate-300">
                BLAST LOOP는 차세대 오픈월드 RPG를 목표로 개발 중인 프로젝트입니다. 
                정교한 액션 시스템과 방대한 세계관, 그리고 유저 간의 긴밀한 협동을 통해 
                몰입감 넘치는 모험을 제공합니다.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[
                  { icon: Sword, label: "전투", desc: "실시간 액션" },
                  { icon: Map, label: "월드", desc: "대형 오픈월드" },
                  { icon: Users, label: "협동", desc: "멀티플레이" },
                  { icon: Sparkles, label: "성장", desc: "커스터마이징" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 transition-all border border-transparent rounded-2xl bg-white/5 hover:border-pink-500/20 group"
                  >
                    <div className="mb-3">
                      <item.icon className="w-8 h-8 text-pink-400 transition-transform group-hover:scale-110" />
                    </div>
                    <div className="mb-1 font-bold">
                      {item.label}
                    </div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* World Perspective */}
            <section className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-3xl -mr-32 -mt-32" />
              <h2 className="mb-6 text-2xl font-black tracking-tight uppercase">세계관</h2>
              <p className="max-w-3xl mb-8 text-lg font-light leading-relaxed text-slate-300">
                지역마다 다른 몬스터, 스토리, 음악이 존재하는 장기 서비스형 RPG. 
                각 대륙은 고유의 생태계와 역사를 품고 있으며, 플레이어의 선택이 세계에 영향을 미칩니다.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-48 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/5 border border-white/5 flex items-center justify-center text-pink-400/40 font-bold">CONCEPT ART A</div>
                <div className="h-48 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/5 border border-white/5 flex items-center justify-center text-blue-400/40 font-bold">CONCEPT ART B</div>
              </div>
            </section>

            {/* Roadmap */}
            <section className="p-8 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl">
              <h2 className="mb-10 text-2xl font-black tracking-tight uppercase">Roadmap</h2>
              <div className="space-y-8">
                {[
                  { phase: "ALPHA(0.0.01)", desc: "데이터 저장 및 불러오기 시스템 구현", status: "Completed" },
                ].map((step, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-pink-500/30">
                    <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                    <div className="mb-1 text-sm font-bold text-pink-400">{step.phase}</div>
                    <div className="text-lg font-medium">{step.desc}</div>
                    <div className="mt-2 inline-block px-2 py-0.5 text-xs font-bold rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      {step.status}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="sticky top-24">
              {/* Sidebar News */}
              <div className="p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl">
                <h3 className="flex items-center gap-2 mb-6 text-xl font-black">
                  <SparklesIcon className="w-5 h-5 text-pink-400" />
                  최신 소식
                </h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
                  ) : news.length > 0 ? (
                    news.map((item) => (
                      <a
                        key={item.id}
                        href={`#/news?id=${item.id}`}
                        className="block p-4 transition-all border border-transparent rounded-2xl bg-white/5 hover:border-pink-500/30 group"
                      >
                        <div className="mb-1 text-xs font-bold text-pink-400">
                          {item.date}
                        </div>
                        <h4 className="font-bold text-slate-200 transition-colors group-hover:text-pink-400 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-1 mt-2 text-xs font-bold text-slate-500 group-hover:text-pink-400">
                          READ MORE <ArrowRight className="w-3 h-3" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-500 text-center italic">
                      진행 중인 소식이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Specs */}
              <div className="mt-8 p-6 border border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl">
                <h3 className="mb-4 text-lg font-bold">Quick Specs</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Genre</span>
                    <span className="font-medium text-pink-400">Open World RPG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Platform</span>
                    <span className="font-medium">PC / Mobile</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Engine</span>
                    <span className="font-medium">Roblox</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Rpg;
