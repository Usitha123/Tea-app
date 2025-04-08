import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" hidden={false} translucent={true} backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
