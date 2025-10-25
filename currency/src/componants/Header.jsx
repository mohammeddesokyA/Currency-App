
import React from "react";
import ThemeToggle from "../componants/ThemeToggle";
import { HiOutlineStar } from "react-icons/hi2";

export default function Header({ isDarkMode, toggleTheme, toggleMobileFavorites }) {
  return (
    <header className="absolute top-0 left-0 z-40 w-full py-4">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="group inline-flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-white">
            <span className="text-green-500">$</span>Converter
          </span>
        </a>
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <a
            href="https://frankfurter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 hover:text-green-600 dark:hover:text-green-400 transition-colors hidden sm:block"
          >
            API: frankfurter.app
          </a>
          
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          <button
            type="button"
            onClick={toggleMobileFavorites}
            className="p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden" // (هيختفي ع الشاشات الكبيرة lg)
            aria-label="Toggle favorites"
          >
            <HiOutlineStar className="h-5 w-5" />
          </button>

        </nav>
      </div>
    </header>
  );
}