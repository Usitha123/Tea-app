import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

// Define user role type
type UserRole = 'user' | 'admin'

export default function Account({ 
  session, 
  goBack 
}: { 
  session: Session, 
  goBack?: () => void 
}) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [role, setRole] = useState<UserRole>('user')

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, role`)
        .eq('id', session?.user.id)
        .single()
      
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setRole(data.role || 'user')
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error loading profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
      
      Alert.alert('Success', 'Profile updated successfully!')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error updating profile', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <View style={styles.roleContainer}>
  {role === 'admin' && (
    <Text style={[styles.roleLabel, styles.adminRoleLabel]}>
      Role: {role.toUpperCase()}
    </Text>
  )}
</View>


      
      <View style={styles.formContainer}>
        <View style={styles.fieldContainer}>
          <Input label="Email" value={session?.user?.email} disabled />
        </View>
        
        <View style={styles.fieldContainer}>
          <Input 
            label="Username" 
            value={username || ''} 
            onChangeText={(text) => setUsername(text)} 
            placeholder="Enter a username"
          />
        </View>
        
        <View style={styles.fieldContainer}>
          <Input 
            label="Website" 
            value={website || ''} 
            onChangeText={(text) => setWebsite(text)} 
            placeholder="Enter your website URL"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? 'Loading...' : 'Update Profile'}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            disabled={loading}
            buttonStyle={styles.updateButton}
          />
          
          {goBack && (
            <Button
              title="Back to Dashboard"
              onPress={goBack}
              buttonStyle={styles.backButton}
            />
          )}
          
          {!goBack && (
            <Button 
              title="Sign Out" 
              onPress={() => supabase.auth.signOut()} 
              buttonStyle={styles.signOutButton}
            />
          )}
        </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  roleLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  adminRoleLabel: {
    backgroundColor: '#fff0e0',
    color: '#ff9500',
  },
  userRoleLabel: {
    backgroundColor: '#e0f0ff',
    color: '#2089dc',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#2089dc',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  signOutButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
  },
})