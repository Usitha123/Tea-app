import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import FeaturedProducts from './AddItemComponent';

// Define the CartItem type
interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Interface for product items that can be added to cart
interface ProductType {
  id: string;
  name: string;
  price: number;
  image: string;
}

const CartComponent: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  // Sample products that can be added to cart (in a real app, this would come from props or API)
  const featuredProducts: ProductType[] = [
    {
      id: 'prod1',
      name: 'Product 1',
      price: 19.99,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 'prod2',
      name: 'Product 2',
      price: 29.99,
      image: 'https://via.placeholder.com/100',
    },
  ];

  // Load cart items from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCartItems = async () => {
      const storedCart = await AsyncStorage.getItem('cartItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    };
    loadCartItems();
  }, []);

  // Save cart items to AsyncStorage whenever cartItems changes
  useEffect(() => {
    const saveCartItems = async () => {
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    };
    saveCartItems();
  }, [cartItems]);

  const addItem = (newItem: CartItemType) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedCart = cartItems.map(item =>
        item.id === newItem.id
          ? { ...item, quantity: item.quantity + newItem.quantity }
          : item
      );
      setCartItems(updatedCart);
    } else {
      // Add new item
      setCartItems([...cartItems, newItem]);
    }
  };

  // Handle adding product to cart from featured products
  const handleAddToCart = (product: ProductType) => {
    const cartItem: CartItemType = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    addItem(cartItem);
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const incrementQuantity = (id: string) => {
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decrementQuantity = (id: string) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = (): number => {
    return calculateSubtotal();
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold">Shopping Cart</Text>
        <Text className="text-sm text-gray-600">{cartItems.length} items</Text>
      </View>


     {/* Featured Products component */}
     <FeaturedProducts 
        products={featuredProducts} 
        onAddToCart={handleAddToCart} 
      />

      {cartItems.length > 0 ? (
        <>
          <ScrollView className="flex-1">
            {cartItems.map(item => (
              <View key={item.id} className="mb-6">
                <CartItem
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onIncrement={() => incrementQuantity(item.id)}
                  onDecrement={() => decrementQuantity(item.id)}
                />
              </View>
            ))}
          </ScrollView>
 
          <CartSummary
            subtotal={calculateSubtotal()}
            total={calculateTotal()}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
          />
        </>
      ) : (
        <EmptyCart />
      )}
    </View>
  );
};

export default CartComponent;