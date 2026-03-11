import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { SelectedWorks } from '../components/SelectedWorks';
import { AboutSection } from '../components/AboutSection';
import { ContactSection } from '../components/ContactSection';
import { supabase } from '../lib/supabaseClient';

interface Photo {
  id: string;
  title: string;
  description: string;
  public_url_full: string;
  public_url_thumb: string;
  starred: boolean;
  housed: boolean;
}

export function HomePage() {
  const [housedPhotoUrl, setHousedPhotoUrl] = useState<string | null>(null);
  const [starredPhotos, setStarredPhotos] = useState<Photo[]>([]);
  const [aboutContent, setAboutContent] = useState('');
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingAbout, setLoadingAbout] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .or('housed.eq.true,starred.eq.true')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const housed = data.find(p => p.housed);
          if (housed) {
            setHousedPhotoUrl(housed.public_url_full);
            // Preload housed image
            const img = new Image();
            img.src = housed.public_url_full;
          }

          setStarredPhotos(data.filter(p => p.starred).slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoadingPhotos(false);
      }
    }

    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('value')
          .eq('key', 'about_text')
          .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found
        if (data) setAboutContent(data.value);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoadingAbout(false);
      }
    }

    fetchPhotos();
    fetchAbout();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <HeroSection housedPhotoUrl={housedPhotoUrl} />
      <SelectedWorks photos={starredPhotos} loading={loadingPhotos} />
      <AboutSection content={aboutContent} loading={loadingAbout} />
      <ContactSection />
    </div>
  );
}
