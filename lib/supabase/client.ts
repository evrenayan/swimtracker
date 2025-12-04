import { createBrowserClient } from '@supabase/ssr';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'test') {
    console.warn('Supabase not configured for tests. Using placeholder values.');
  } else {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
    );
  }
}

// Create and export Supabase client for browser
export const supabase = createBrowserClient(
  supabaseUrl || 'https://test.supabase.co',
  supabaseAnonKey || 'test-anon-key'
);
