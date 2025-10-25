import React from "react";

function Footer() {
  return (
    <footer className="absolute bottom-0 w-full py-4 bg-transparent text-gray-600 dark:text-gray-300 text-sm">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        <p className="mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} $ Convert. Built with React + Tailwind.
        </p>
        <nav className="flex gap-4">
          <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Rates source
          </a>
          <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;