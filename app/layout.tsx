'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue('--initial-color-mode');

    if (initialColorValue === 'dark') {
      setIsDarkMode(true);
      root.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <html lang="en">
      <body>
        <div className="absolute top-4 right-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        {children}
      </body>
    </html>
  );
}
