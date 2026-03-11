import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import toast from 'react-hot-toast';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  onUploadComplete: () => void;
}

export function PhotoUpload({ onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setUploading(true);
    setProgress(0);

    const totalFiles = acceptedFiles.length;
    let completed = 0;

    for (const file of acceptedFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
        const fullPath = `full/${fileName}.${fileExt}`;
        const thumbPath = `thumb/${fileName}.webp`;

        // 1. Compress for thumbnail
        const thumbOptions = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: 'image/webp' as const,
        };
        const compressedThumb = await imageCompression(file, thumbOptions);

        // 2. Upload full image
        const { error: fullError } = await supabase.storage
          .from('photos')
          .upload(fullPath, file, { cacheControl: '3600', upsert: false });
        if (fullError) throw fullError;

        // 3. Upload thumbnail
        const { error: thumbError } = await supabase.storage
          .from('photos')
          .upload(thumbPath, compressedThumb, { cacheControl: '3600', upsert: false });
        if (thumbError) throw thumbError;

        // 4. Get public URLs
        const { data: { publicUrl: fullUrl } } = supabase.storage.from('photos').getPublicUrl(fullPath);
        const { data: { publicUrl: thumbUrl } } = supabase.storage.from('photos').getPublicUrl(thumbPath);

        // 5. Insert DB record
        const { error: dbError } = await supabase.from('photos').insert([{
          title: file.name.replace(`.${fileExt}`, ''),
          description: '',
          storage_path_full: fullPath,
          storage_path_thumb: thumbPath,
          public_url_full: fullUrl,
          public_url_thumb: thumbUrl,
        }]);

        if (dbError) throw dbError;

        completed++;
        setProgress(Math.round((completed / totalFiles) * 100));
      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setUploading(false);
    if (completed > 0) {
      toast.success(`Successfully uploaded ${completed} photo(s)`);
      onUploadComplete();
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    disabled: uploading,
  } as any);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800/50'
            : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-zinc-900 dark:text-white animate-spin mb-4" />
            <p className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              Uploading... {progress}%
            </p>
            <div className="w-full max-w-xs h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-900 dark:bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
            </div>
            <p className="text-xl font-medium text-zinc-900 dark:text-white mb-2">
              {isDragActive ? 'Drop photos here' : 'Drag & drop photos'}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400">
              or click to select files (JPEG, PNG, WebP)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
