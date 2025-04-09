import React, { useState, useEffect } from 'react'
import { View, Text, Alert, TouchableOpacity, } from 'react-native'
import { Button } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Account from './Account'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

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
          created_at: authUser?.created_at || profile.created_at,
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

const showAlert = () => {
    Alert.alert('Sign Out', 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: handleSignOut },
    ]);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing out', error.message);
      }
    }
  };
  
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      Alert.alert('Success', 'User role updated successfully')
      fetchUsers()
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error updating role', error.message)
      }
    } finally {
      setLoading(false)
    }
  }


  if (showAccount) {
    return <Account session={session} goBack={() => setShowAccount(false)} />
  }

  return (
    <View className="flex-1 p-5 mt-5 bg-white">
      {/* Header */}
            <View className="flex-row items-center justify-between mt-5 mb-4">
              <TouchableOpacity onPress={() => setShowAccount(true)}>
                <Icon name="user" size={24} color="black" />
              </TouchableOpacity>
      
              <Text className="text-2xl font-bold">Admin Dashboard</Text>
         
              <TouchableOpacity onPress={showAlert}>
                <Icon name="sign-out" size={24} color="black" />
              </TouchableOpacity>
            </View>
 
      <Text className="mb-2 text-base text-gray-600">Welcome, {session.user.email}</Text>

      <View className="self-start px-3 py-1 mb-5 bg-orange-500 rounded-xl">
        <Text className="font-bold text-white">ADMIN</Text>
      </View>

      <View className="mt-3">
        <Button
          title="Add Products"
          onPress={() => setShowAccount(true)}
          buttonStyle={{
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: '#2089dc', // Optional custom RNE color
          }}
          containerStyle={{ marginVertical: 8 }}
        />
        <Button
          title="Manage Orders"
          onPress={handleSignOut}
          buttonStyle={{
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: '#ff6b6b',
          }}
          containerStyle={{ marginVertical: 8 }}
        />
      </View>
    </View>
  )
}
