import React, { useState, useEffect } from 'react';
import { TextInput,TouchableOpacity, View, Text,Image, Alert, FlatList } from 'react-native';
import { Button } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import Account from './Account';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Link } from 'expo-router';

export default function UserDashboard({ session }: { session: Session }) {
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
    setFilteredProducts(
      query === ''
        ? products
        : products.filter((product) =>
            product.product_name.toLowerCase().includes(query.toLowerCase())
          )
    );
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

  if (showAccount) {
    return <Account session={session} goBack={() => setShowAccount(false)} />;
  }

  return (
    <View className="flex-1 p-5 mt-10 bg-green-100 rounded-lg">
      {/* Header */}
      <View className="flex flex-row items-center justify-between">
        <Icon name="user" size={24} color="black" onPress={() => setShowAccount(true)} />
        <Text className="mb-2 text-2xl font-bold">AROMA</Text>
        <Link href={"/cart/CartComponent"}>
        <Icon name="shopping-cart" size={24} color="black" />
        </Link>
        
        <Icon name="sign-out" size={24} color="black" onPress={showAlert} />
      </View>

      <Text className="mb-5 text-lg text-gray-600">A Perfect Blend of Tea & Coffee</Text>

      {/* Search Bar */}
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
        <Text className="text-sm">You can view and edit your profile information.</Text>
        <Link href="/home">Go to Home</Link>
        
      </View>

      {/* Categories */}
      <View>
        <Text className="p-3 text-base font-semibold">Categories</Text>
        <Text className="text-base font-semibold">Tea</Text>
        <Text className="text-base font-semibold">Coffee</Text>
        <Text className="text-base font-semibold">All</Text>
      </View>

{/* Product List */}
<FlatList
  data={filteredProducts}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View className="w-40 mr-4 bg-white rounded-lg shadow">
      <Image 
        source={{ uri: 'https://via.placeholder.com/100' }} 
        style={{ width: 160, height: 160, borderTopLeftRadius: 8 }} 
        resizeMode="cover" 
      />
      
      <View className="p-2">
        <Link href={`/products/${item.id}`}>
          <Text className="font-medium">{item.product_name}</Text>
        </Link>

        <TouchableOpacity className="px-3 py-2 mt-2 bg-blue-500 rounded-lg">
          <Text className="font-medium text-center text-white">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
/>


      <View>
      <Link href="/stripepayment/payment">Home</Link>
      <Link href="/cart/AddItemComponent">Orders</Link>
      </View>
    </View>
  );
}