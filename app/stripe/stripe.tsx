import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useCart } from '@/context/CartContext';
import useSession from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';

const API_URL = 'https://tea-app-web.vercel.app/api';

const StripeCheckout = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const { cartItems, calculateTotal, clearCart } = useCart();
  const total = calculateTotal();
  const { session } = useSession();

  const fetchPaymentSheetParams = async () => {
    try {
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.product_name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          line_items: lineItems,
          cart_items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'Tea App',
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Error', `Could not initialize payment sheet: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in initializePaymentSheet:', error);
      Alert.alert('Error', `Payment initialization failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('address')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      // Set in state and return the address
      setShippingAddress(data.address);
      return data.address;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return '';
    } finally {
      setLoading(false);
    }
  };

  const insertOrderWithProducts = async () => {
    if (!session?.user?.id) {
      console.error('No user session found');
      return { success: false, error: 'No user session found' };
    }

    // Make sure we have a shipping address
    if (!shippingAddress) {
      console.error('No shipping address found');
      return { success: false, error: 'No shipping address found' };
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_status: 'Pending',
            profiles_id: session.user.id,
            shipping_address: shippingAddress,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error('Error inserting order:', orderError);
        return { success: false, error: orderError };
      }

      const orderProducts = cartItems.map(item => ({
        order_id: orderData.id,
        product_name: item.product_name,
        product_quantity: item.quantity,
        product_price: item.price,
      }));

      const { error: productError } = await supabase
        .from('order_products')
        .insert(orderProducts);

      if (productError) {
        console.error('Error inserting order products:', productError);
        return { success: false, error: productError };
      }

      return { success: true, orderId: orderData.id };
    } catch (error) {
      console.error('Error in insertOrderWithProducts:', error);
      return { success: false, error };
    }
  };

  const handlePayPress = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checking out.');
      return;
    }

    try {
      setLoading(true);
      
      // First get the profile and ensure we have the shipping address
      const address = await getProfile();
      
      if (!address) {
        Alert.alert('Missing Information', 'Please update your profile with a shipping address before checkout.');
        setLoading(false);
        return;
      }
      
      // Then initialize payment sheet
      await initializePaymentSheet();

      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('Payment sheet error:', error);
        Alert.alert('Payment Failed', error.message);
      } else {
        // By this point, shippingAddress should be populated
        const result = await insertOrderWithProducts();

        if (result.success) {
          Alert.alert('Success', 'Payment successful! Your order has been placed.', [
            { text: 'OK', onPress: () => clearCart() },
          ]);
        } else {
          Alert.alert('Order Processing Error', 'Payment was successful, but there was an issue saving your order. Please contact support.');
          console.error('Order processing error:', result.error);
        }
      }
    } catch (error) {
      console.error('Error in handlePayPress:', error);
      Alert.alert('Error', `Payment processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load initial shipping address when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      getProfile();
    }
  }, [session]);

  // Initialize payment sheet when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      initializePaymentSheet();
    }
  }, [cartItems]);

  return (
    <TouchableOpacity
      className="w-full py-4 mt-4 bg-green-600 rounded-lg"
      disabled={loading || cartItems.length === 0}
      onPress={handlePayPress}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text className="text-base font-bold text-center text-white">
          Checkout (${total.toFixed(2)})
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default StripeCheckout;