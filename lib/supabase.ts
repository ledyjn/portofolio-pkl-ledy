import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a supabase client with fallback for development
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Types for Database
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  detail: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
  is_featured: boolean;
}

// Backward compatibility alias
export type Portfolio = Project;

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'visitor';
  created_at: string;
}
