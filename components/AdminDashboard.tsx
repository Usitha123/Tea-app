import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'
import { Button } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Account from './Account'
import Test from './Test'

// Define user role type
type UserRole = 'user' | 'admin'

// Profile interface
interface Profile {
  id: string
  username: string | null
  email: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export default function AdminDashboard({ session }: { session: Session }) {
  const [showAccount, setShowAccount] = useState(false)
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
      
      if (profilesError) throw profilesError
      
      const { data: authUsers, error: authError } = await supabase
        .from('users')
        .select('id, email, created_at')
      
      if (authError) throw authError
      
      const mergedUsers = profiles.map(profile => {
        const authUser = authUsers?.find(user => user.id === profile.id)
        return {
          ...profile,
          email: authUser?.email || null,
          created_at: authUser?.created_at || profile.created_at
        }
      })
      
      setUsers(mergedUsers)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error fetching users', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
      
      if (error) throw error
      
      Alert.alert('Success', 'User role updated successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error updating role', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing out', error.message)
      }
    }
  }

  if (showAccount) {
    return <Account session={session} goBack={() => setShowAccount(false)} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {session.user.email}</Text>
      
      <View style={styles.adminBadge}>
        <Text style={styles.adminBadgeText}>ADMIN</Text>
      </View>
      
      
      <View style={styles.buttonContainer}>
        <Button
          title="Edit My Profile"
          onPress={() => setShowAccount(true)}
          buttonStyle={styles.button}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          buttonStyle={[styles.button, styles.signOutButton]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  adminBadge: {
    backgroundColor: '#ff9500',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  adminBadgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutButton: {
    backgroundColor: '#ff6b6b',
  },
})
