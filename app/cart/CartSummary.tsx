// CartSummary.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CartSummaryProps {
  subtotal: number;
  
  total: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  subtotal, 
   
  total, 
  onCheckout, 
  onClearCart 
}) => {
  return (
    <View className="p-4 bg-white border-t border-gray-200">

     
      <View className="flex-row justify-between pt-2 mt-2 mb-2 border-t border-gray-200">
        <Text className="text-lg font-bold">Total</Text>
        <Text className="text-lg font-bold text-blue-600">${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity 
        className="items-center py-4 mt-2 bg-blue-600 rounded-lg"
        onPress={onCheckout}
      >
        <Text className="text-base font-bold text-white">Proceed to Checkout</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="items-center py-4 mt-2 border border-gray-500 rounded-lg"
        onPress={onClearCart}
      >
        <Text className="text-base text-gray-500">Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartSummary;
