import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

// Define the product types
interface ProductType {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Define the props for the FeaturedProducts component
interface FeaturedProductsProps {
  products: ProductType[];
  onAddToCart: (product: ProductType) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onAddToCart }) => {
  return (
    <View className="p-4 mb-2 bg-white">
      <Text className="mb-3 text-lg font-semibold">Featured Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
        {products.map(product => (
          <View key={product.id} className="w-20 mr-4 bg-white rounded-lg shadow">
            <Image 
              source={{ uri: product.image }} 
              className="w-40 h-40 rounded-t-lg" 
              resizeMode="cover"
            />
            <View className="p-2">
              <Text className="font-medium">{product.name}</Text>
              <Text className="text-gray-600">${product.price.toFixed(2)}</Text>
              <TouchableOpacity 
                onPress={() => onAddToCart(product)}
                className="px-3 py-2 mt-2 bg-blue-500 rounded-lg"
              >
                <Text className="font-medium text-center text-white">Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedProducts;