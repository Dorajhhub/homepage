import React, { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import PingChecker from "./PingChecker";
import Home from "./pages/Home";
import NyangNyangDescription from "./pages/NyangNyangDescription";
import BlastLoopDescription from "./pages/BlastLoopDescription";
import BugReport from "./pages/BugReport";
import NewsDetail from "./pages/NewsDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChristmasApp from "./Christmas";
import NewYearApp from "./NewYear";
import Minigames from "./pages/Minigames";
import ClimbingMinigame from "./pages/ClimbingMinigame";
import ClimbingMinigamePlay from "./pages/ClimbingMinigamePlay";
import { ErrorBoundary } from "./components/console/ErrorBoundary";
import { ErrorAlert } from "./components/console/ErrorAlert";
import BirthdayPage from "./pages/BirthdayPage";

const getSeasonalTheme = () => {
  const now = new Date();
  const year = now.getFullYear();

  // 크리스마스 기간: 12월 20일 ~ 12월 31일
  const christmasStart = new Date(year, 11, 20); // 11 = 12월
  const christmasEnd = new Date(year, 11, 31, 23, 59, 59);
  if (now >= christmasStart && now <= christmasEnd) {
    return "christmas";
  }

  // 새해 기간: 1월 1일 ~ 1월 15일
  const newYearStart = new Date(year, 0, 1); // 0 = 1월
  const newYearEnd = new Date(year, 0, 3, 23, 59, 59);
  if (now >= newYearStart && now <= newYearEnd) {
    return "newyear";
  }

  return null; // 계절 테마 없음
};

// A layout component that includes the Navbar and a placeholder for the page content
const AppLayout: React.FC = () => {
  const seasonalTheme = getSeasonalTheme();
  const [manualTheme, setManualTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    // Check system preference if no theme is saved
    if (!savedTheme) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return savedTheme;
  });

  const theme = seasonalTheme || manualTheme;
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes first
    root.classList.remove("light", "dark", "christmas", "newyear");

    if (seasonalTheme) {
      // Apply seasonal theme
      // Note: We don't add a specific class for seasonal, but we remove light/dark
      // The styling is handled by the 'themeClasses' on the main div
    } else {
      // Apply manual theme
      root.classList.add(manualTheme);
      localStorage.setItem("theme", manualTheme);
    }
  }, [manualTheme, seasonalTheme]);

  // 계절 테마에 따른 동적 클래스
  const seasonalClasses = {
    christmas:
      "bg-gradient-to-b from-green-900 to-black text-white font-['Mountains_of_Christmas']",
    newyear:
      "bg-gradient-to-b from-red-400 via-orange-300 to-yellow-200 text-black font-gowun-dodum",
  };

  const themeClasses = seasonalTheme
    ? seasonalClasses[seasonalTheme]
    : "bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200";

  return (
    <div
      className={`flex flex-col min-h-screen font-sans transition-all duration-1000 ease-in-out ${themeClasses}`}
    >
      {/* Render Snowfall only on the maintenance page */}
      {location.pathname === "/servernotice" && <ChristmasApp />}
      {/* Don't render Navbar and Footer for Final Exam page */}
      {location.pathname !== "/final-exam" && (
        <Navbar
          theme={manualTheme}
          setTheme={setManualTheme}
          isSeasonal={!!seasonalTheme}
        />
      )}
      {/* 계절별 이펙트 렌더링 */}
      {theme === "christmas" && (
        <>
          <ChristmasApp />
        </>
      )}
      {theme === "newyear" && (
        <>
          <NewYearApp />
        </>
      )}
      <div className="flex flex-col flex-grow">
        <main
          className={`flex-grow p-3 mx-auto sm:p-4 md:p-6 lg:p-8 max-w-7xl ${
            location.pathname === "/final-exam" ? "pt-6" : "pt-24 sm:pt-28"
          }`}
        >
          <Outlet /> {/* This will render the matched child route element */}
        </main>
        {/* Don't render Footer for Final Exam page */}
        {location.pathname !== "/final-exam" && <Footer />}
      </div>
    </div>
  );
};

function App() {
  const seasonalTheme = getSeasonalTheme();
  const isChristmasEvent = seasonalTheme === "christmas";

  return (
    <ErrorBoundary>
      <ErrorAlert />
      <HashRouter>
        <Routes>
          {/* Secret Birthday Page (No Navbar/Footer) */}
          <Route path="/secret-birthday" element={<BirthdayPage />} />
          // Main app routes with layout
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/ping" element={<PingChecker />} />
            <Route path="/nyangnyang" element={<NyangNyangDescription />} />
            <Route path="/blastloop" element={<BlastLoopDescription />} />
            <Route path="/bugs" element={<BugReport />} />
            <Route path="/news" element={<NewsDetail />} />
            <Route path="/minigames" element={<Minigames />} />
            <Route
              path="/climbing-minigame"
              element={<ClimbingMinigame />}
            />{" "}
            <Route
              path="/climbing-minigame/play"
              element={<ClimbingMinigamePlay />}
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default App;
