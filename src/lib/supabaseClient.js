import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lkmseeublkgnqlyflvjw.supabase.co'


const supabaseAnonKey = 'sb_publishable_FMW1iAdDkCfELDjsXO6XMw_XWOXryeP'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)