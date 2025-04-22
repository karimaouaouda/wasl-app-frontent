import { useEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Auth from '@/services/authservice'
import { router } from "expo-router";

export default function GuestManager({children}: {children: React.ReactNode}) {
    // This is the guest layout component that wraps the children components in a scrollable view with a specific background color.
    // It is used to provide a consistent layout for guest screens in the application.
    // The layout is designed to be used in a mobile application built with React Native and Expo.
    // The layout is styled using Tailwind CSS classes.


    const auth = new Auth()

    function login(){
        alert('login')
    }

    useEffect(() => {
        // on every guest screen we must check if he is logged in or not
        // if he is logged in we redirect him to the tabs page
        function checkAuth() {
            const token = auth.getToken()
            if (token) {
                router.replace('/(tabs)')
                alert('already logged in')
            }else{
                alert('not logged in')
            }
        }

        checkAuth()
    }, []);

  return (
    <SafeAreaView>
        <ScrollView className="w-screen h-screen bg-[#fb6f16]">
            {children}
        </ScrollView>
    </SafeAreaView>
  );
}