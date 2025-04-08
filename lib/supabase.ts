import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://dbwbdjpqitqpjrmyameb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid2JkanBxaXRxcGpybXlhbWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MTk1NTgsImV4cCI6MjA1ODI5NTU1OH0.w8kGgnU9tMInV7S4mN-rw2XttI7Gt__TsYWLHwIcFyI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})