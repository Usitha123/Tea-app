import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="dark" hidden={false} translucent={true} backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }} />
     </CartProvider>
  );
}
