
import { createClient } from '@supabase/supabase-js';

const config = {
  url: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '',
  key: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
};

const isConfigured = !!(config.url && config.key);

if (!isConfigured) {
  console.warn("EasygoPharm: Supabase credentials missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(
  config.url || 'https://placeholder.supabase.co',
  config.key || 'placeholder'
);

export const hasValidDb = () => isConfigured;
