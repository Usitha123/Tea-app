import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '@/components/Account'
import AdminDashboard from '@/components/AdminDashboard'
import UserDashboard from '../components/UserDashboard'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Session } from '@supabase/supabase-js'

// Define user role type
type UserRole = 'user' | 'admin'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<UserRole>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) getUserRole(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) getUserRole(session)
    })
  }, [])

  async function getUserRole(session: Session) {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error)
        setUserRole('user') // Default to user role on error
      }

      if (data) {
        setUserRole(data.role || 'user')
      }
    } catch (error) {
      console.error('Error getting user role:', error)
      setUserRole('user') // Default to user role on error
    } finally {
      setLoading(false)
    }
  }

  // Loading screen while checking authentication and role
  if (session && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {session && session.user ? (
        userRole === 'admin' ? (
          <AdminDashboard session={session} />
        ) : (
          <UserDashboard session={session} />
        )
      ) : (
        <Auth />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  }
})