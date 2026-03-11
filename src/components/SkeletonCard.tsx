import React from 'react';

export function SkeletonCard() {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 w-3/4 bg-white/20 rounded mb-2" />
        <div className="h-4 w-1/2 bg-white/20 rounded" />
      </div>
    </div>
  );
}
