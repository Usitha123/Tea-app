import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert, Text, View } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

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
    <View className="flex-1 p-5 mt-10">
      <Text className="mb-5 text-2xl font-bold text-center">Your Profile</Text>
      
      <View className="items-center mb-5">
        {role === 'admin' && (
          <Text className="px-4 py-2 rounded-full font-bold bg-[#fff0e0] text-[#ff9500]">
            Role: {role.toUpperCase()}
          </Text>
        )}
      </View>
      
      <View className="bg-[#f9f9f9] p-4 rounded-lg mb-5">
        <View className="mb-3">
          <Input label="Email" value={session?.user?.email} disabled />
        </View>
        
        <View className="mb-3">
          <Input 
            label="Username" 
            value={username || ''} 
            onChangeText={(text) => setUsername(text)} 
            placeholder="Enter a username"
          />
        </View>
        
        <View className="mb-3">
          <Input 
            label="Website" 
            value={website || ''} 
            onChangeText={(text) => setWebsite(text)} 
            placeholder="Enter your website URL"
          />
        </View>

        <View className="mt-5">
          <Button
            title={loading ? 'Loading...' : 'Update Profile'}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            disabled={loading}
            buttonStyle="bg-[#2089dc] py-3 mb-3 rounded-lg"
          />
          
          {goBack && (
            <Button
              title="Back to Dashboard"
              onPress={goBack}
              buttonStyle="bg-[#28a745] py-3 mb-3 rounded-lg"
            />
          )}
          
          {!goBack && (
            <Button 
              title="Sign Out" 
              onPress={() => supabase.auth.signOut()} 
              buttonStyle="bg-[#ff6b6b] py-3 rounded-lg"
            />
          )}
        </View>
      </View>
    </View>
  )
}
