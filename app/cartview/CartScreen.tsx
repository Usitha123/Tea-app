import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '@/context/CartContext';
import EmptyCart from './EmptyCart';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import useSession from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
}

const CartScreen = () => {
  const navigation = useNavigation();
  const { session, sessionLoading } = useSession(); // Ensure session is available
  const [address, setAddress] = useState('');
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, clearCart, calculateTotal } = useCart();

  const typedCartItems = cartItems as CartItem[];
  const total = calculateTotal();

  // Fetch profiles and user address
  const fetchProfiles = async () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id);

      if (error) throw error;
      setAddress(data?.[0]?.address || ''); // Safely access address
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  useEffect(() => {
    if (session && !sessionLoading) {
      fetchProfiles();
    }
  }, [session, sessionLoading]);

  const handleRemove = (id: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => removeFromCart(id.toString()), style: 'destructive' },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: clearCart, style: 'destructive' },
    ]);
  };

  const handleCheckout = async () => {
    try {
      const lineItems = cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.product_name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      const res = await fetch('https://stripe-beta-gilt.vercel.app/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line_items: lineItems,
          cart_items: cartItems,
        }),
      });

      const data = await res.json();

      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
      } else {
        Alert.alert('Checkout Error', data.error || 'No URL returned');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row items-center p-4 mb-3 bg-white shadow-sm rounded-xl">
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{item.product_name}</Text>
        <Text className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</Text>
      </View>
      <View className="flex-row items-center mr-2">
        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          onPress={() => decrementQuantity(item.id.toString())}
        >
          <Text className="text-lg font-medium text-gray-700">-</Text>
        </TouchableOpacity>
        <Text className="w-10 mx-2 text-base font-medium text-center">{item.quantity}</Text>
        <TouchableOpacity
          className="items-center justify-center w-8 h-8 bg-gray-100 rounded-full"
          onPress={() => incrementQuantity(item.id.toString())}
        >
          <Text className="text-lg font-medium text-gray-700">+</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center ml-2">
        <Text className="mr-4 text-base font-semibold text-gray-800">
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity className="p-2" onPress={() => handleRemove(item.id)}>
          <Icon name="trash" size={18} color="#ff4d4f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 mt-5 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 mr-3 rounded-full bg-gray-50"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Shopping Cart</Text>
        </View>
        {typedCartItems.length > 0 && (
          <TouchableOpacity className="px-3 py-1.5 bg-red-100 rounded-full" onPress={handleClear}>
            <Text className="text-sm font-medium text-red-700">Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 px-5 pt-4">
        {typedCartItems.length > 0 ? (
          <>
            <FlatList
              data={typedCartItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCartItem}
              showsVerticalScrollIndicator={false}
              className="mb-4"
            />

            {/* Order Summary */}
            <View className="p-5 mt-auto mb-4 bg-white shadow-sm rounded-xl">
              <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Shipping Address</Text>
                <Link href="/cartview/changeaddress">
                <Text className="text-base font-medium text-green-800">Change</Text>
                </Link>
               
              </View>

              <View className="flex-row justify-between mb-2">
              <Text className="text-base text-gray-600">{address}</Text>
              </View>

              <View className="my-3 border-t border-gray-200" />

              <View className="flex-row justify-between mb-1">
                <Text className="text-lg font-bold text-gray-800">Total</Text>
                <Text className="text-lg font-bold text-green-600">${total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                className="items-center py-4 mt-5 bg-green-600 rounded-lg"
                onPress={handleCheckout}
              >
                <Text className="text-base font-bold text-white">Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyCart />
        )}
      </View>

      {/* Bottom Navigation */}
      <View className="flex-row items-center justify-around px-5 py-3 bg-white border-t border-gray-100 shadow-lg">
        <Link href="/" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="home" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Home</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/orders/orders" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="package" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Orders</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/profiles/useraccount" asChild>
          <TouchableOpacity className="items-center">
            <Icon name="user" size={22} color="#9ca3af" />
            <Text className="mt-1 text-xs text-gray-600">Profile</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

export default CartScreen;
