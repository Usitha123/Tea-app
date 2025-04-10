import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';

export default function Account() {
  const [showAccount, setShowAccount] = useState(false);

  return (
    <View>
      <Text>Orders</Text>

      {/* Bottom Navigation */}
      <View className="flex-row items-center justify-around px-5 py-3 bg-white border-t border-gray-100 shadow-lg">
        {/* Home Link */}
        <Link href="/" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="home" size={22} color="#16a34a" />
            <Text className="mt-1 text-xs text-gray-600">Home</Text>
          </TouchableOpacity>
        </Link>

        {/* Orders Link */}
        <Link href="/orders/orders" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="package" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Orders</Text>
          </TouchableOpacity>
        </Link>

        {/* Profile Button */}
        <TouchableOpacity className="items-center" onPress={() => setShowAccount(true)}>
          <Icon name="user" size={22} color="#9ca3af" />
          <Text className="mt-1 text-xs text-gray-600">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
