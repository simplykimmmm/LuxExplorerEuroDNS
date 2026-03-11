import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.');
}

// Ensure the URL is valid to prevent createClient from throwing a fatal error
let validUrl = supabaseUrl || 'https://placeholder.supabase.co';
if (validUrl && !validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
  validUrl = `https://${validUrl}`;
}

try {
  // Test if it's a valid URL object
  new URL(validUrl);
} catch (e) {
  console.error('Invalid Supabase URL provided:', validUrl);
  validUrl = 'https://placeholder.supabase.co';
}

let supabaseClient;
try {
  supabaseClient = createClient(
    validUrl,
    supabaseAnonKey || 'placeholder-key'
  );
} catch (error) {
  console.error('Failed to initialize Supabase client. Check your environment variables.', error);
  // Fallback to prevent app crash
  supabaseClient = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = supabaseClient;
