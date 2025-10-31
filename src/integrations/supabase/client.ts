import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fhohvqxaumevnlqkfmml.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob2h2cXhhdW1ldm5scWtmbW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTMyNjUsImV4cCI6MjA3Njk2OTI2NX0.4dh9-XsJpy6sWEuu5LyPuaExaOVItADIM92uuyDO448';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);