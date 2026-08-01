import { createClient } from '@supabase/supabase-js'

const getEnvOrLocal = (key, localKey) => {
  return import.meta.env[key] || localStorage.getItem(localKey) || ''
}

// Mặc định kết nối thẳng project Supabase (anon key là public, dữ liệu
// được bảo vệ bởi RLS). Vẫn cho phép ghi đè qua .env hoặc màn hình cấu hình.
const defaultUrl = 'https://pnffavseesuvrvblsdpp.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZmZhdnNlZXN1dnJ2YmxzZHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MzY3NzUsImV4cCI6MjEwMTExMjc3NX0.ttHu4Igx_6PmPWOfsugSE7135OCcHAidPahwc0gw3nQ'

export let supabaseUrl = getEnvOrLocal('VITE_SUPABASE_URL', 'supabase_url') || defaultUrl
export let supabaseAnonKey = getEnvOrLocal('VITE_SUPABASE_ANON_KEY', 'supabase_anon_key') || defaultKey

export let supabase = createClient(supabaseUrl, supabaseAnonKey)

export function updateSupabaseConfig(newUrl, newKey) {
  localStorage.setItem('supabase_url', newUrl)
  localStorage.setItem('supabase_anon_key', newKey)
  supabaseUrl = newUrl
  supabaseAnonKey = newKey
  supabase = createClient(newUrl, newKey)
}

export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseAnonKey
}


