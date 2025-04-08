import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Button,
  StyleSheet,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { CartItemType } from './CartComponent';

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Product Details</Text>
      <Text style={styles.detail}>Product ID: {id}</Text>

      {product && (
        <>
          <Text style={styles.detail}>Name: {product.product_name}</Text>
          <Text style={styles.detail}>Description: {product.description}</Text>
          <Text style={styles.detail}>Price: ${product.price.toFixed(2)}</Text>
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
    <View style={styles.addItemContainer}>
      <Image 
        source={{ uri: item.image }} 
        style={{ width: 80, height: 80 }} 
        resizeMode="contain" 
      />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },
  detail: {
    marginBottom: 8,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
  },
  addItemContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  itemName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  itemPrice: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
});

export default ProductDetails;
