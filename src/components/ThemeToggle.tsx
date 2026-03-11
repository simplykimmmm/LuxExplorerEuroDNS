import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-zinc-200/50 dark:bg-black/20 backdrop-blur-md border border-zinc-300/50 dark:border-white/10 shadow-sm hover:bg-zinc-300/50 dark:hover:bg-white/5 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-white" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-900" />
        )}
      </motion.div>
    </button>
  );
}
