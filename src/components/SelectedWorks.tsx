import React from 'react';
import { PhotoGrid } from './PhotoGrid';
import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_full: string;
  public_url_thumb: string;
}

interface SelectedWorksProps {
  photos: Photo[];
  loading: boolean;
}

export function SelectedWorks({ photos, loading }: SelectedWorksProps) {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
            Selected Works
          </h2>
          <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </motion.div>

        <PhotoGrid photos={photos} loading={loading} />
      </div>
    </section>
  );
}
