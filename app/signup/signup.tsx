import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const signUpWithEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Alert.alert('Success!', 'Check your email for the confirmation link!');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error signing up', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-4 mt-10">
      <Text className="mb-5 text-2xl font-bold text-center">Sign Up</Text>

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
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      <View className="w-full py-1">
        <Button
          title="Sign Up"
          disabled={loading}
          onPress={signUpWithEmail}
        />
      </View>

      <Text className="mt-5 mb-2 text-center">Already have an account?</Text>
      <TouchableOpacity
        className="items-center p-2 bg-gray-100 rounded-full"
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
      >
        <Text>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
