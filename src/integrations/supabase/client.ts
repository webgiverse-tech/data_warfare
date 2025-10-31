import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhohvqxaumevnlqkfmml.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZob2h2cXhhdW1ldm5scWtmbW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTMyNjUsImV4cCI6MjA3Njk2OTI2NX0.4dh9-XsJpy6sWEuu5LyPuaExaOVItADIM92uuyDOa48';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);