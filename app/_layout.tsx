import { Stack } from "expo-router";

export default function RootLayout() {
  return (<>
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="auth/forgot-password" />
    </Stack>
  </>)
}
