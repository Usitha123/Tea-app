import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert, Text, View, TouchableOpacity } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { useTailwind } from 'tailwind-rn'  // Fixed import
import { Session } from '@supabase/supabase-js'
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

type UserRole = 'user' | 'admin'

export default function Account({ 
  session, 
  goBack 
}: { 
  session: Session, 
  goBack?: () => void 
}) {
  const tw = useTailwind() // Initialize tailwind
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
    <View style={tw('flex-1 p-5 mt-10')}>
      <Text style={tw('mb-5 text-2xl font-bold text-center')}>Your Profile</Text>
      
      <View style={tw('items-center mb-5')}>
        {role === 'admin' && (
          <Text style={tw('px-4 py-2 rounded-full font-bold bg-orange-100 text-orange-500')}>
            Role: {role.toUpperCase()}
          </Text>
        )}
      </View>
      
      <View style={tw('bg-gray-100 p-4 rounded-lg mb-5')}>
        <View style={tw('mb-3')}>
          <Input label="Email" value={session?.user?.email} disabled />
        </View>
        
        <View style={tw('mb-3')}>
          <Input 
            label="Username" 
            value={username || ''} 
            onChangeText={(text) => setUsername(text)} 
            placeholder="Enter a username"
          />
        </View>
        
        <View style={tw('mb-3')}>
          <Input 
            label="Website" 
            value={website || ''} 
            onChangeText={(text) => setWebsite(text)} 
            placeholder="Enter your website URL"
          />
        </View>

        <View style={tw('mt-5')}>
          <Button
            title={loading ? 'Loading...' : 'Update Profile'}
            onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
            disabled={loading}
            buttonStyle={tw('bg-blue-500 py-3 mb-3 rounded-lg')}
          />
          
          {goBack && (
            <Button
              title="Back to Dashboard"
              onPress={goBack}
              buttonStyle={tw('bg-green-500 py-3 mb-3 rounded-lg')}
            />
          )}

          {/* Bottom Navigation */}
                <View className="flex-row items-center justify-around px-5 py-3 bg-white border-t border-gray-100 shadow-lg">
                  <Link href="/" asChild>
                    <TouchableOpacity className="items-center">
                      <Icon name="home" size={22} color="#16a34a" />
                      <Text className="mt-1 text-xs text-gray-600">Home</Text>
                    </TouchableOpacity>
                  </Link>
                  
                  <Link href="/orders/orders" asChild>
                    <TouchableOpacity className="items-center">
                      <Icon name="package" size={22} color="#9ca3af" />
                      <Text className="mt-1 text-xs text-gray-600">Orders</Text>
                    </TouchableOpacity>
                  </Link>
                  
                 
                  
                  <TouchableOpacity className="items-center" onPress={() => setShowAccount(true)}>
                    <Icon name="user" size={22} color="#9ca3af" />
                    <Text className="mt-1 text-xs text-gray-600">Profile</Text>
                  </TouchableOpacity>
                </View>
          
          {!goBack && (
            <Button 
              title="Sign Out" 
              onPress={() => supabase.auth.signOut()} 
              buttonStyle={tw('bg-red-500 py-3 rounded-lg')}
            />
          )}
        </View>
      </View>
    </View>
  )
}