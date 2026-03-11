import React from 'react';
import { motion } from 'motion/react';
import { useParallax } from '../hooks/useParallax';
import { ChevronDown } from 'lucide-react';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

interface HeroSectionProps {
  housedPhotoUrl: string | null;
}

export function HeroSection({ housedPhotoUrl }: HeroSectionProps) {
  const y = useParallax(150);
  const prefersReducedMotion = useReducedMotionPreference();

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : y }}
        className="absolute inset-0 -z-10"
      >
        {housedPhotoUrl ? (
          <img
            src={housedPhotoUrl}
            alt="Hero Background"
            className="w-full h-[120%] object-cover object-center"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
        )}
      </motion.div>

      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-white mb-6 drop-shadow-2xl"
        >
          Luxembourg Explorer
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-white/80 font-light tracking-wide mb-12 max-w-2xl drop-shadow-md"
        >
          {housedPhotoUrl ? 'Discover the hidden beauty of the Grand Duchy.' : 'A hero image can be set in the admin panel.'}
        </motion.p>

        <motion.button
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleScrollDown}
          className="group flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          Explore Selected Works
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  );
}
