import React, { useState } from 'react'
import { StyleSheet, View, Text, Alert } from 'react-native'
import { Button } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import Account from './Account'

export default function UserDashboard({ session }: { session: Session }) {
  const [showAccount, setShowAccount] = useState(false)

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
      <Text style={styles.title}>User Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {session.user.email}</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>You are logged in as a standard user.</Text>
        <Text style={styles.infoText}>You can view and edit your profile information.</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Edit Profile"
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
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