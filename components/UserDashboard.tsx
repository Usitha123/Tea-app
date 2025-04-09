import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import Account from './Account';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

interface UserDashboardProps {
  session: Session;
}

export default function UserDashboard({ session }: UserDashboardProps) {
  const [showAccount, setShowAccount] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
        setFilteredProducts(data);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = query
      ? products.filter((product) =>
          product.product_name.toLowerCase().includes(query.toLowerCase())
        )
      : products;
    setFilteredProducts(filtered);
  };

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

  const onAddToCart = (product: any) => {
    Alert.alert('Added to cart', product.product_name);
  };

  if (showAccount) {
    return <Account session={session} goBack={() => setShowAccount(false)} />;
  }

  return (
    <View className="flex-1 px-5 mt-10 bg-green-100 rounded-lg">
      {/* Header */}
      <View className="flex-row items-center justify-between mt-5 mb-4">
        <TouchableOpacity onPress={() => setShowAccount(true)}>
          <Icon name="user" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold">AROMA</Text>

        <Link href="/cart/CartComponent" asChild>
          <TouchableOpacity>
            <Icon name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity onPress={showAlert}>
          <Icon name="sign-out" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Greeting & Search */}
      <Text className="mb-5 text-lg text-gray-600">
        A Perfect Blend of Tea & Coffee
      </Text>

      <View className="flex-row items-center p-3 mb-5 bg-white rounded-lg shadow-md">
        <Icon name="search" size={20} color="black" className="mr-3" />
        <TextInput
          className="flex-1 text-base"
          placeholder="Search your Tea or Coffee"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* User Info */}
      <View className="p-4 mb-5 bg-gray-200 rounded-md">
        <Text className="mb-1 text-sm">You are logged in as a standard user.</Text>
        <Text className="mb-2 text-sm">You can view and edit your profile information.</Text>
        <Link href="/home">
          <Text className="text-blue-600">Go to Home</Text>
        </Link>
      </View>

      {/* Categories */}
      <View className="mb-5">
        <Text className="p-3 text-base font-semibold">Categories</Text>
      </View>

      <View className="flex-row justify-around mb-6">
        <Link href="/tea/tea">
          <Text className="text-blue-600">Tea</Text>
        </Link>
        <Link href="/coffee/coffee">
          <Text className="text-blue-600">Coffee</Text>
        </Link>
      </View>

      <Text className="p-3 text-base font-semibold">All</Text>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg mb-4 w-[48%] p-2">
            <Image
              source={{ uri: item.product_image }}
              className="w-full rounded-lg h-36"
              resizeMode="cover"
            />
            <Link href={`/products/${item.id}`}>
              <Text className="mt-2 font-medium">{item.product_name}</Text>
            </Link>
            <Text className="text-xs text-gray-500">
              {item.description || 'No description'}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm font-bold text-black">{item.price}</Text>
              <Icon
                name="shopping-cart"
                size={14}
                color="#16a34a"
                style={{ marginLeft: 8 }}
              />
            </View>
            <View className="h-1 mt-2 bg-green-500 rounded-full" />
          </View>
        )}
      />

      {/* Bottom Navigation */}
      <View className="flex-row justify-around mb-6">
        <Link href="/">
          <Text className="text-blue-600">Home</Text>
        </Link>
        <Link href="/tea/tea">
          <Text className="text-blue-600">Orders</Text>
        </Link>
      </View>
    </View>
  );
}
