import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className={cn(
            "text-lg font-medium tracking-tight transition-colors",
            isHome ? "text-white" : "text-zinc-900 dark:text-white"
          )}
        >
          Luxembourg Explorer
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-100",
              isHome ? "text-white/80" : "text-zinc-600 dark:text-zinc-400",
              location.pathname === '/' && !isHome ? "text-zinc-900 dark:text-white" : ""
            )}
          >
            Home
          </Link>
          <Link 
            to="/gallery" 
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-100",
              isHome ? "text-white/80" : "text-zinc-600 dark:text-zinc-400",
              location.pathname === '/gallery' ? (isHome ? "text-white" : "text-zinc-900 dark:text-white") : ""
            )}
          >
            Gallery
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
