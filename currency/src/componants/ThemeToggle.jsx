import React from "react";

export default function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Light" : "Dark"}
    className="rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all inline-flex items-center gap-2"
    >
      {isDarkMode ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7a1 1 0 0 1 1 1h1a1 1 0 1 1 0 2h-1a1 1 0 1 1-2 0 1 1 0 0 1 1-1Zm-8 8a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4 11a1 1 0 0 1 1-1H6a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm.636-6.364a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414Zm0 12.728a1 1 0 0 1 1.414 0l.707.707A1 1 0 1 1 5.343 20.2l-.707-.707a1 1 0 0 1 0-1.414ZM17.95 5.05a1 1 0 0 1 1.415 0l.707.707a1 1 0 1 1-1.415 1.415l-.707-.707a1 1 0 0 1 0-1.415Zm0 12.728a1 1 0 0 1 1.415 0l.707.707a1 1 0 1 1-1.415 1.415l-.707-.707a1 1 0 0 1 0-1.415Z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
