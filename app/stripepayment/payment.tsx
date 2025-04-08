import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';

export default function CheckoutScreen() {
  const [publishableKey, setPublishableKey] = useState('pk_test_51RBEWGP7K68X3iwBrwXlNeiY1BFrwCoVDmO7lzRFLCD9QIXGryULUcDc5Op9JX7b7IGZq3BHrzggFkWNlm72nZn000FmBeTcXt');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const API_URL = 'http://192.168.0.199:3000/api';

  const fetchPaymentSheetParams = async () => {
    try {
      // Validate amount
      if (!amount || isNaN(parseFloat(amount))) {
        Alert.alert('Invalid Amount', 'Please enter a valid amount');
        return null;
      }

      // Convert amount to cents (Stripe requires amounts in cents)
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      console.log('Sending request with body:', JSON.stringify({ cost: amountInCents }));
      
      const response = await fetch(`${API_URL}/stripeServerProcess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cost: amountInCents })
      });
      
      // Add debugging for response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Try to parse JSON manually
      let jsonData;
      try {
        jsonData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Failed to parse server response: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        throw new Error(jsonData.error || 'Failed to process payment');
      }
      
      return jsonData;
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      Alert.alert('Payment Error', error.message || 'Failed to connect to payment server');
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    
    try {
      const params = await fetchPaymentSheetParams();
      
      if (!params) {
        setLoading(false);
        return;
      }
      
      console.log('Payment params received:', params);
      
      const { paymentIntent, ephemeralKey, customer } = params;

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Example, Inc.',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Setup Error', error.message);
      } else {
        openPaymentSheet();
      }
    } catch (error) {
      console.error('Error initializing payment sheet:', error);
      Alert.alert('Setup Error', error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Payment Failed`, error.message);
    } else {
      Alert.alert('Success', `Your payment of £${amount} was successful!`);
      setAmount("");
    }
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier"
      urlScheme="your-url-scheme"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Enter Payment Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
          placeholder="Enter amount (£)"
          keyboardType="numeric"
        />
        <Button
          title={loading ? "Processing..." : "Pay Now"}
          onPress={initializePaymentSheet}
          disabled={loading || !amount}
        />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  }
});