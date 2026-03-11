import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Star, Home, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

interface PhotoEditorProps {
  key?: React.Key;
  photo: Photo;
  onUpdate: () => void | Promise<void>;
}

export function PhotoEditor({ photo, onUpdate }: PhotoEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(photo.title);
  const [description, setDescription] = useState(photo.description);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('photos')
        .update({ title, description })
        .eq('id', photo.id);

      if (error) throw error;
      toast.success('Photo updated');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update photo');
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async () => {
    try {
      if (!photo.starred) {
        // Check if we already have 6 starred photos
        const { count, error: countError } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .eq('starred', true);

        if (countError) throw countError;
        if (count && count >= 6) {
          toast.error('Maximum 6 photos can be starred');
          return;
        }
      }

      const { error } = await supabase
        .from('photos')
        .update({ starred: !photo.starred })
        .eq('id', photo.id);

      if (error) throw error;
      toast.success(photo.starred ? 'Removed from Selected Works' : 'Added to Selected Works');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update star status');
    }
  };

  const toggleHouse = async () => {
    try {
      if (!photo.housed) {
        // Unset previous housed photo
        const { error: unsetError } = await supabase
          .from('photos')
          .update({ housed: false })
          .eq('housed', true);

        if (unsetError) throw unsetError;
      }

      const { error } = await supabase
        .from('photos')
        .update({ housed: !photo.housed })
        .eq('id', photo.id);

      if (error) throw error;
      toast.success(photo.housed ? 'Removed Hero Image' : 'Set as Hero Image');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update house status');
    }
  };

  const handleDelete = async () => {
    try {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.storage_path_full, photo.storage_path_thumb]);

      if (storageError) throw storageError;

      // 2. Delete from DB
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      toast.success('Photo deleted');
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete photo');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] group">
          <img
            src={photo.public_url_thumb}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={toggleStar}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                photo.starred
                  ? 'bg-yellow-500/90 text-white hover:bg-yellow-600'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={photo.starred ? 'Remove Star' : 'Star (max 6)'}
            >
              <Star className={`w-5 h-5 ${photo.starred ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={toggleHouse}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                photo.housed
                  ? 'bg-blue-500/90 text-white hover:bg-blue-600'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
              title={photo.housed ? 'Remove Hero' : 'Set as Hero'}
            >
              <Home className={`w-5 h-5 ${photo.housed ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsDeleting(true)}
              className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-600 backdrop-blur-md transition-all"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none text-zinc-900 dark:text-white"
                placeholder="Title"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white outline-none resize-none text-zinc-900 dark:text-white"
                placeholder="Description"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-zinc-900 dark:text-white truncate" title={photo.title}>
                  {photo.title || 'Untitled'}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2" title={photo.description}>
                {photo.description || 'No description'}
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleting}
        title="Delete Photo"
        message="Are you sure? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleting(false)}
      />
    </>
  );
}
