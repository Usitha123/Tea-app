import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase'; // Make sure your Supabase client is set up properly
import { Link } from 'expo-router';

export default function CoffeeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Coffee'); // Filter by category "Tea"
  
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

  return (
    <View className="flex-1 px-4 pt-12 bg-white">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Coffee</Text>
      </View>

      {/* Search Box */}
      <View className="flex-row items-center px-4 py-2 mb-4 bg-green-100 rounded-lg">
        <Icon name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search your Coffee"
          className="flex-1 text-black"
          placeholderTextColor="#555"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Coffee Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg mb-4 w-[48%]">
            <Image
              source={{ uri: item.product_image }}
              className="w-full rounded-lg h-36"
              resizeMode="cover"
            />
            <Link href={`/products/${item.id}`}>
                            <Text className="font-medium">{item.product_name}</Text>
                          </Link>
            <Text className="text-xs text-gray-500">{item.description || 'No description'}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm font-bold text-black">{item.price}</Text>
              <Icon name="shopping-cart" size={14} color="#16a34a" style={{ marginLeft: 8 }} />
            </View>
            <View className="h-1 mt-2 bg-green-500 rounded-full" />
          </View>
        )}
      />
    </View>
  );
}
