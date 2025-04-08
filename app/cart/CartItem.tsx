import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}) => {
  return (
    <View className="flex-row items-center p-3 mx-4 my-2 bg-white rounded-lg shadow-sm">
      {/* If you want to show the item image */}
      {/* <Image source={{ uri: item.image }} className="w-20 h-20 mr-3 rounded-lg" /> */}

      <View className="flex-1 mr-2">
        <Text className="mb-1 text-base font-medium">{item.name}</Text>
        <Text className="text-base font-bold text-gray-700">
          ${item.price.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center mr-3">
        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
          onPress={() => onDecrement(item.id)}
        >
          <Text className="text-base font-bold">-</Text>
        </TouchableOpacity>

        <Text className="mx-3 text-base font-medium">{item.quantity}</Text>

        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
          onPress={() => onIncrement(item.id)}
        >
          <Text className="text-base font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="p-2" onPress={() => onRemove(item.id)}>
        <Feather name="trash-2" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
