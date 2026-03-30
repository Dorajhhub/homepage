import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

const Home = () => {
  interface NewsItem {
    id: number;
    title: string;
    content: string;
    date: string;
    game: string;
  }

  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/news.json`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setNews(data.newsList))
      .catch((error) => console.error("Error fetching news:", error));
  }, []);

  const truncateContent = (content: string) => {
    return content.length > 80 ? content.substring(0, 80) + "..." : content;
  };

  return (
    <div className="pb-24 space-y-32 bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-10">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/20 blur-[120px] rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-10 border rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border-white/20 shadow-sm animate-fade-in-up">
            <span className="relative flex w-2.5 h-2.5">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-gray-600 uppercase dark:text-gray-300">
              Live Development
            </span>
          </div>

          <h1 className="mb-8 text-6xl font-black tracking-tighter md:text-8xl lg:text-9xl">
            <span className="inline-block leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Innovation
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Meets Reality</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg font-light leading-relaxed text-gray-600 md:text-2xl dark:text-gray-400">
            평범함을 넘어선{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              새로운 경험
            </span>
            . <br />
            MinDevX는 기술과 창의성으로 미래의 즐거움을 설계합니다.
          </p>

          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Link
              to="/nyangnyang"
              className="group relative flex items-center justify-center px-10 py-4 font-bold text-white transition-all bg-indigo-600 rounded-2xl hover:bg-indigo-700 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] active:scale-95"
            >
              <span>프로젝트 탐색</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/ping"
              className="px-10 py-4 font-bold text-gray-700 transition-all border-2 border-gray-200 rounded-2xl dark:text-white dark:border-white/10 hover:bg-white dark:hover:bg-white/5 backdrop-blur-sm active:scale-95"
            >
              서버 상태
            </Link>
          </div>
        </div>
      </section>

      {/* --- PROJECTS BENTO GRID --- */}
      <section className="px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Featured Works
          </h2>
          <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Main Project */}
          <div className="relative overflow-hidden md:col-span-8 group rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/5 shadow-2xl transition-all hover:-translate-y-2">
            <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-orange-400/10 to-pink-500/10 group-hover:opacity-100"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-14">
              <div>
                <div className="flex items-center justify-center mb-8 text-4xl shadow-2xl w-20 h-20 rounded-[2rem] bg-white dark:bg-white/10 backdrop-blur-3xl border border-white/20">
                  😸
                </div>
                <h3 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                  냥냥식당타이쿤
                </h3>
                <p className="max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                  귀여운 고양이들과 함께하는 힐링 경영 시뮬레이션. 당신만의
                  감성으로 최고의 식당을 만들어보세요.
                </p>
              </div>
              <div className="flex items-end justify-between mt-12">
                <div className="flex gap-3">
                  {["Simulation", "Tycoon", "Cute"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-xs font-bold tracking-widest text-gray-500 uppercase bg-gray-100 rounded-xl dark:bg-white/5 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to="/nyangnyang"
                  className="p-4 text-white transition-all bg-indigo-600 rounded-2xl hover:rotate-12 active:scale-90"
                >
                  <ArrowRightIcon className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>

          {/* Side Project */}
          <div className="relative overflow-hidden md:col-span-4 group rounded-[2.5rem] bg-[#1a1c1e] text-white shadow-2xl transition-all hover:-translate-y-2">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-10">
              <div className="flex items-center justify-center mb-6 text-2xl w-14 h-14 rounded-2xl bg-gradient-to-tr from-green-400 to-blue-500">
                ⚔️
              </div>
              <div>
                <h3 className="mb-2 text-2xl font-bold">Rpg Adventure</h3>
                <p className="mb-6 text-gray-400">
                  Roblox 기반의 광활한 모험 세계
                </p>
                <Link
                  to="/blastloop"
                  className="inline-block w-full py-4 font-bold text-center text-black transition-transform bg-white rounded-2xl hover:scale-105 active:scale-95"
                >
                  Play Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEWS SECTION --- */}
      <section className="px-6 mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="flex items-center gap-3 text-4xl font-bold tracking-tighter text-gray-900 uppercase dark:text-white">
              <BoltIcon className="w-8 h-8 text-yellow-400" />
              Latest News
            </h2>
          </div>
          <Link
            to="/news"
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.slice(0, 3).map((item) => (
            <Link
              to={`/news?id=${item.id}`}
              key={item.id}
              className="group p-8 rounded-[2rem] bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/5 hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 text-xs font-black tracking-widest text-indigo-600 uppercase rounded-lg bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {item.game}
                </span>
                <span className="font-mono text-sm text-gray-400">
                  {item.date}
                </span>
              </div>
              <h3 className="mb-4 text-xl font-bold leading-tight text-gray-900 transition-colors dark:text-white group-hover:text-indigo-600">
                {item.title}
              </h3>
              <p className="leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                {truncateContent(item.content)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="px-6 pb-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/5 rounded-[3rem] shadow-xl">
          {[
            {
              label: "Games",
              val: "2+",
              icon: RocketLaunchIcon,
              color: "text-blue-500",
            },
            {
              label: "Uptime",
              val: "99.9%",
              icon: GlobeAltIcon,
              color: "text-green-500",
            },
            {
              label: "Updates",
              val: "Weekly",
              icon: SparklesIcon,
              color: "text-purple-500",
            },
            {
              label: "Community",
              val: "Active",
              icon: SparklesIcon,
              color: "text-pink-500",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-8 text-center rounded-[2.5rem] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className={`mb-3 flex justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="mb-1 text-3xl font-black text-gray-900 dark:text-white">
                {stat.val}
              </div>
              <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
