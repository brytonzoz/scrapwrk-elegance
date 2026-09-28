import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://qrknuoukghnjjcoiyota.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFya251b3VrZ2huampjb2l5b3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwOTU5ODcsImV4cCI6MjAyOTY3MTk4N30.7o82m8yKBOUc8_tZzXeE3VmcxVbIOrgNKZ7uPXfZ-Ew';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 