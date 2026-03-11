import React, { useState } from 'react';
import { PhotoCard } from './PhotoCard';
import { LightboxModal } from './LightboxModal';
import { SkeletonCard } from './SkeletonCard';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_full: string;
  public_url_thumb: string;
}

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
}

export function PhotoGrid({ photos, loading }: PhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">No photos found.</p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">Check back later for new updates.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            onClick={() => setSelectedPhotoIndex(index)}
          />
        ))}
      </div>

      <LightboxModal
        photo={selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null}
        onClose={() => setSelectedPhotoIndex(null)}
        onNext={selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1 ? handleNext : undefined}
        onPrev={selectedPhotoIndex !== null && selectedPhotoIndex > 0 ? handlePrev : undefined}
      />
    </>
  );
}
