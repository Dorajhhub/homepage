import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface NavbarProps {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
  isSeasonal: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme, isSeasonal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setTheme]);

  const navLinks = [
    { name: "홈", path: "/" },
    { name: "서버 체크", path: "/ping" },
    { name: "냥냥식당타이쿤", path: "/nyangnyang" },
    { name: "BlastLoop", path: "/blastloop" },
    { name: "미니게임", path: "/minigames" },
    { name: "뉴스", path: "/news" },
    { name: "버그 제보", path: "/bugs" },
  ];

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-slate-700/50"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 gap-3">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded group focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Home"
            >
              <div className="flex items-center justify-center w-10 h-10 text-xl transition-transform duration-300 shadow-lg rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110">
                🎮
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                MinDevX
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`
                }
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </NavLink>
            ))}

            <div className="w-px h-6 mx-4 bg-gray-300 dark:bg-slate-700"></div>

            <button
              onClick={toggleTheme}
              disabled={isSeasonal}
              className="p-2 text-gray-500 transition-all duration-300 rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              disabled={isSeasonal}
              className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={
                theme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6 text-yellow-400" />
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-7 h-7" />
              ) : (
                <Bars3Icon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 md:hidden bg-black/50 backdrop-blur-sm"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`md:hidden fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal={isMobileMenuOpen}
        role="dialog"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
          <div className="flex-1 px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-4 rounded-xl text-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`
                }
                onClick={toggleMobileMenu}
                aria-current={
                  location.pathname === link.path ? "page" : undefined
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
