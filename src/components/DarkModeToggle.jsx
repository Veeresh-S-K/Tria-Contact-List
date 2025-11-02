import React from "react";

export default function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div
      onClick={() => setDarkMode(!darkMode)}
      className="relative w-16 h-8 bg-gray-900 dark:bg-gray-300 rounded-full cursor-pointer flex items-center justify-between px-2 transition-all"
    >
      <span className={`text-xs ${darkMode ? 'text-gray-900' : 'text-yellow-400'}`}>☀</span>
      <span className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>🌙</span>
      <div
        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          darkMode ? 'translate-x-8' : ''
        }`}
      />
    </div>
  );
}
