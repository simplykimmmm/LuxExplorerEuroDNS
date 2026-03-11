import { createClient } from '@supabase/supabase-js';

try {
  const supabase = createClient('https://placeholder.supabase.co', '');
  console.log('Success');
} catch (e: any) {
  console.error('Error:', e.message);
}
