import React from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const CheckoutButton: React.FC = () => {
  const handleCheckout = async (): Promise<void> => {
    try {
      const res = await fetch('https://tea-app-web.vercel.app/api/checkout', {
        method: 'POST',
      });

      const data: { url?: string } = await res.json();

      if (data.url) {
        await WebBrowser.openBrowserAsync(data.url);
      } else {
        Alert.alert('Error', 'No checkout URL returned');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  };

  return <Button title="Buy Now" onPress={handleCheckout} />;
};

export default CheckoutButton;
