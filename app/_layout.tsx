import { Stack } from "expo-router";
import { I18nManager } from 'react-native';


export default function RootLayout() {
  return (<>
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
    </Stack>
  </>)
}
