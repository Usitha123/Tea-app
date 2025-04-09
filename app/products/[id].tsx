import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Button,
  Image,
 TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { CartItemType } from './CartComponent';
import Icon from 'react-native-vector-icons/Feather';

// Strongly typed product model
type Product = {
  id: string;
  product_name: string;
  description: string;
  price: number;
};

interface AddItemProps {
  item: CartItemType;
  onAddToCart: (newItem: CartItemType) => void;
}

const ProductDetails: React.FC = () => {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProduct(data);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 p-4">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 p-4">
        <Text className="mb-4 text-lg text-center text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="flex-row items-center mb-4">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={24} color="black" style={{ marginRight: 16 }} />
              </TouchableOpacity>
              
            </View>
      <Text className="mb-4 text-2xl font-bold">Product Details</Text>
      <Text className="mb-2 text-lg">Product ID: {id}</Text>

      {product && (
        <>
          <Text className="mb-2 text-lg">Name: {product.product_name}</Text>
          <Text className="mb-2 text-lg">Description: {product.description}</Text>
          <Text className="mb-4 text-lg">Price: ${product.price.toFixed(2)}</Text>
        </>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const AddItemComponent: React.FC<AddItemProps> = ({ item, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(item);
  };

  return (
    <View className="p-4 mb-4 bg-white border border-gray-300 shadow-md rounded-xl">
      <Image 
        source={{ uri: item.image }} 
        className="object-contain w-20 h-20"
      />
      <Text className="mt-2 text-lg font-semibold">{item.name}</Text>
      <Text className="mb-2 text-base text-gray-600">${item.price.toFixed(2)}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

export default ProductDetails;
