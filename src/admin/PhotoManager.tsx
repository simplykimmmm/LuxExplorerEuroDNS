import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PhotoUpload } from './PhotoUpload';
import { PhotoEditor } from './PhotoEditor';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Image as ImageIcon } from 'lucide-react';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_full: string;
  public_url_thumb: string;
  starred: boolean;
  housed: boolean;
  storage_path_full: string;
  storage_path_thumb: string;
  created_at: string;
}

export function PhotoManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          Photo Library
        </h2>
        <button
          onClick={() => setIsUploading(!isUploading)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isUploading
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md hover:shadow-lg'
          }`}
        >
          {isUploading ? 'Cancel Upload' : (
            <>
              <Plus className="w-4 h-4" />
              Upload Photos
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <PhotoUpload onUploadComplete={() => {
              setIsUploading(false);
              fetchPhotos();
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-xl font-medium text-zinc-900 dark:text-white mb-2">No photos yet</p>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Upload your first photo to start building your portfolio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map(photo => (
            <PhotoEditor key={photo.id} photo={photo} onUpdate={fetchPhotos} />
          ))}
        </div>
      )}
    </div>
  );
}
