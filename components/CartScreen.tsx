// components/CartScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from '@/context/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();

  // Remove item from cart
  const handleRemove = (id: number) => {
    Alert.alert('Remove from Cart', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => removeFromCart(id) },
    ]);
  };

  return (
    <View className="flex-1 p-5 bg-green-100">
      <Text className="text-xl font-bold">Your Cart</Text>
      
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between p-3 mb-3 bg-white rounded-lg">
            <Text className="font-medium">{item.product_name}</Text>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Icon name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default CartScreen;
