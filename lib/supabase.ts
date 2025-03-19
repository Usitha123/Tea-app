import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tvxdqiugekwvczbesklc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2eGRxaXVnZWt3dmN6YmVza2xjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTU3MjMsImV4cCI6MjA1Nzk3MTcyM30.GRwdTs4JZhag671uSo-Qce9k1BN9XaJkiBmoVxnj464";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})