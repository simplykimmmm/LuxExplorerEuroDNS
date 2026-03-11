import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

interface AboutSectionProps {
  content: string;
  loading: boolean;
}

export function AboutSection({ content, loading }: AboutSectionProps) {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-200 dark:bg-zinc-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-zinc-300 dark:bg-zinc-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-3xl p-8 md:p-16 shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-8 text-center">
            About the Explorer
          </h2>
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-4/6" />
            </div>
          ) : (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
              {content || 'About content will appear here once added in the admin panel.'}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
