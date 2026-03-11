import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_thumb: string;
}

interface PhotoCardProps {
  key?: React.Key;
  photo: Photo;
  onClick: () => void;
  index?: number;
}

export function PhotoCard({ photo, onClick, index = 0 }: PhotoCardProps) {
  const prefersReducedMotion = useReducedMotionPreference();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={prefersReducedMotion ? {} : { y: -8, scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onClick}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer bg-zinc-100 dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <img
        src={photo.public_url_thumb}
        alt={photo.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Liquid Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      {/* Shimmer Sweep */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="text-xl font-medium text-white mb-2 tracking-tight">{photo.title}</h3>
        <p className="text-sm text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {photo.description}
        </p>
      </div>
    </motion.div>
  );
}
