import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwdtzjujtfcaakkbmyhs.supabase.co';
const supabaseKey = 'sb_publishable_H-oIhkolSjTmlX82unF67Q_ySk5kuBT';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' 
  }
});
