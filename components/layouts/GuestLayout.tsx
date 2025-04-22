import { useEffect, useCallback, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Auth from '@/services/authservice'
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
  
});


export default function GuestManager({children}: {children: React.ReactNode}) {
    // This is the guest layout component that wraps the children components in a scrollable view with a specific background color.
    // It is used to provide a consistent layout for guest screens in the application.
    // The layout is designed to be used in a mobile application built with React Native and Expo.
    // The layout is styled using Tailwind CSS classes.
    const [appIsReady, setAppIsReady] = useState(false);

    const auth = new Auth()

    const router = useRouter()

    function login(){
        alert('login')
    }

    

    useEffect(() => {

        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                const token = auth.getToken()

                // Artificially delay for two seconds to simulate a slow loading
                // experience. Remove this if you copy and paste the code!
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (token) {
                    router.replace('/(tabs)')
                }
                
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(() => {
            if (appIsReady) {
                // This tells the splash screen to hide immediately! If we call this after
                // `setAppIsReady`, then we may see a blank screen while the app is
                // loading its initial state and rendering its first pixels. So instead,
                // we hide the splash screen once we know the root view has already
                // performed layout.
                SplashScreen.hide();
            }
        }, [appIsReady]);
    
        if (!appIsReady) {
            return null;
        }

  return (
    <SafeAreaView >
        <ScrollView className="w-screen h-screen bg-[#fb6f16]">
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}