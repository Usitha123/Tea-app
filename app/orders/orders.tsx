import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

const CartScreen = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 mt-5 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 mr-3 rounded-full bg-gray-50"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Orders</Text>
        </View>
      </View>

      {/* User Details */}
      <View className="p-5 mt-auto mb-4 bg-white shadow-sm rounded-xl">
        <Text className="mb-4 text-lg font-bold text-gray-800">Details</Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Username</Text>
          <Text className="text-base font-medium text-gray-800">
            
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Full Name</Text>
          <Text className="text-base font-medium text-gray-800">
            
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Email</Text>
          <Text className="text-base font-medium text-gray-800">
            
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Phone Number</Text>
          <Text className="text-base font-medium text-gray-800">
            
          </Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Address</Text>
          <Text className="text-base font-medium text-gray-800">
           
          </Text>
        </View>

        <View className="my-3 border-t border-gray-200" />

        <TouchableOpacity
          className="items-center py-4 mt-5 bg-green-600 rounded-lg"
          accessibilityLabel="Edit profile"
        >
          <Text className="text-base font-bold text-white">Edit Orders</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View className="flex-row items-center justify-around px-5 py-3 bg-white border-t border-gray-100 shadow-lg">
        <Link href="/" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="home" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Home</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/orders/orders" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="package" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Orders</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profiles/useraccount" asChild>
                  <TouchableOpacity className="items-center">
                    <Icon name="user" size={22} color="#9ca3af" />
                    <Text className="mt-1 text-xs text-gray-600">Profile</Text>
                  </TouchableOpacity>
                </Link>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
