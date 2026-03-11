import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PhotoGrid } from '../components/PhotoGrid';
import { supabase } from '../lib/supabaseClient';
import { ArrowDownUp } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_full: string;
  public_url_thumb: string;
}

type SortOrder = 'newest' | 'oldest';

export function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  useEffect(() => {
    async function fetchPhotos() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: sortOrder === 'oldest' });

        if (error) throw error;
        if (data) setPhotos(data);
      } catch (error) {
        console.error('Error fetching gallery photos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, [sortOrder]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-4">
              Gallery
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
              A complete collection of moments captured across the Grand Duchy and beyond.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-800"
          >
            <div className="pl-3 pr-1 text-zinc-500 dark:text-zinc-400">
              <ArrowDownUp className="w-4 h-4" />
            </div>
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortOrder === 'newest'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortOrder === 'oldest'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Oldest
            </button>
          </motion.div>
        </div>

        <PhotoGrid photos={photos} loading={loading} />
      </div>
    </div>
  );
}
