import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useCart } from '@/context/CartContext';
import EmptyCart from './EmptyCart';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const {
    cartItems,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    calculateTotal,
  } = useCart();

  // Handle item removal from the cart with a confirmation prompt
  const handleRemove = (id: number) => {
    Alert.alert('Remove from Cart', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => removeFromCart(id) },
    ]);
  };

  // Handle clear  from the cart with a confirmation prompt
  const handleClear = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear this cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes', onPress: () => clearCart() },
    ]);
  };

  // Calculate total cost
  const total = calculateTotal();

  const renderCartItem = ({ item }) => (
    <View className="flex-row items-center p-4 mb-3 bg-white shadow-sm rounded-xl">
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{item.product_name}</Text>
        <Text className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</Text>
      </View>
      
      <View className="flex-row items-center mr-2">
        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          onPress={() => decrementQuantity(item.id)}
        >
          <Text className="text-lg font-medium text-gray-700">-</Text>
        </TouchableOpacity>

        <Text className="w-10 mx-2 text-base font-medium text-center">{item.quantity}</Text>

        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          onPress={() => incrementQuantity(item.id)}
        >
          <Text className="text-lg font-medium text-gray-700">+</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row items-center ml-2">
        <Text className="mr-4 text-base font-semibold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        
        <TouchableOpacity 
          className="p-2" 
          onPress={() => handleRemove(item.id)}
        >
          <Icon name="trash" size={18} color="#ff4d4f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            className="p-2 mr-3 rounded-full bg-gray-50"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Shopping Cart</Text>
        </View>
        
        {cartItems.length > 0 && (
          <TouchableOpacity 
            className=" mt-5 px-3 py-1.5 rounded-full bg-green-300"
            onPress={() => handleClear()}
          >
            <Text className="text-sm text-gray-700 ">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 px-5 pt-4">
        {cartItems.length > 0 ? (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              className="mb-4"
            />

            {/* Order Summary */}
            <View className="p-5 mt-auto mb-4 bg-white shadow-sm rounded-xl">
              <Text className="mb-4 text-lg font-bold text-gray-800">Order Summary</Text>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Subtotal</Text>
                <Text className="text-base font-medium text-gray-800">${total.toFixed(2)}</Text>
              </View>
              
              <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Shipping</Text>
                <Text className="text-base font-medium text-gray-800">$0.00</Text>
              </View>
              
              <View className="my-3 border-t border-gray-200" />
              
              <View className="flex-row justify-between mb-1">
                <Text className="text-lg font-bold text-gray-800">Total</Text>
                <Text className="text-lg font-bold text-green-600">${total.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity className="items-center py-4 mt-5 bg-green-600 rounded-lg">
                <Text className="text-base font-bold text-white">Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyCart />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;