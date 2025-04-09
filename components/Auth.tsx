import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { View, Alert, Text } from 'react-native'
import { Button, Input } from '@rneui/themed'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing in', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function signUpWithEmail() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      Alert.alert('Success!', 'Check your email for the confirmation link!')
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing up', error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="px-4 mt-10">
      <Text className="mb-5 text-2xl font-bold text-center">Login or Sign Up</Text>

      <View className="w-full py-1">
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      <View className="w-full py-1">
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      <View className="w-full py-1 mt-5">
        <Button
          title="Sign in"
          disabled={loading}
          onPress={signInWithEmail}
        />
      </View>

      <View className="w-full py-1">
        <Button
          title="Sign up"
          disabled={loading}
          onPress={signUpWithEmail}
        />
      </View>
    </View>
  )
}
