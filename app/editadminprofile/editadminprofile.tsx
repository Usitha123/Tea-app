import { useState, useEffect } from 'react';
import { Alert, Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { supabase } from '@/lib/supabase';
import useSession from '@/hooks/useSession';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Session } from '@supabase/supabase-js';

export default function EditUserAccount() {
  const { session } = useSession() as { session: Session | null };
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (session && session.user) getProfile();
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, phonenumber, address')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Fetched data:', data);

        setFormData({
          fullName: data.full_name || '',
          username: data.username || '',
          phoneNumber: String(data.phonenumber || ''),
          address: data.address || ''
        });
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        Alert.alert('Error loading profile', (error as any).message || 'An unknown error occurred');
      } else {
        Alert.alert('Error loading profile', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          username: formData.username,
          phonenumber: formData.phoneNumber,
          address: formData.address
        })
        .eq('id', session?.user?.id);

      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        Alert.alert('Error updating profile', (error as any).message || 'An unknown error occurred');
      } else {
        Alert.alert('Error updating profile', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold">Edit Profile</Text>
        </View>

        <View className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            placeholder="Enter your full name"
          />

          <Input
            label="Username"
            value={formData.username}
            onChangeText={(value) => handleChange('username', value)}
            placeholder="Enter your username"
          />

          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleChange('phoneNumber', value)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Input
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleChange('address', value)}
            placeholder="Enter your address"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Update Profile"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            containerStyle={{ marginTop: 20 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
