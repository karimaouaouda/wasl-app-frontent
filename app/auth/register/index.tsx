import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import '@/global.css';
interface ErrorsProps {
    email?: string;
    password?: string;
}
import ScreenTitle from "@/components/partials/ScreenTitle";
import Btn from "@/components/utils/Btn";

export default function RegisterScreen() {
    // generate a login page containing login form email password and login button
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    const [token, setToken] = useState(null);
    const [errors, setErrors] = useState<ErrorsProps | null>(null);


    return (
        <View
            className="flex flex-col min-h-screen bg-[#fb6f16] w-screen relative"
        >
            <ScreenTitle
                classes="text-white"
                title="back" />
            <View className="flex justify-start flex-row space-x-2 items-center w-full px-10 mt-20">
                <Image
                    source={require('@/assets/icons/delivery-color.png')}
                    alt="Logo"
                    className="!w-24 !h-24"
                    resizeMode="contain"
                />
                <View className="flex flex-1 flex-col items-start justify-center space-y-2">
                    <Text className="text-start w-fit text-2xl font-bold p-0 text-white">Wasl</Text>
                    <Text className="text-start text-white text-sm word-wrap overflow-wrap">
                        Connection restaurents with delivery partners
                    </Text>
                </View>
            </View>

            <View className="w-full flex flex-col items-center justify-center mt-10 px-14 space-y-4">
                <TextInput
                    placeholder="Name"

                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
                <TextInput
                    placeholder="Email"
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />

                <TextInput
                    placeholder="Password"
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />

                <TextInput
                    placeholder="Password Confirmation"
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />

                <Btn text="Register" classes="bg-white !text-black w-1/3 py-2 font-semibold" textClasses="!text-slate-800"></Btn>
                <Text className="text-white text-sm">Or</Text>
                <TouchableOpacity
                    className="w-full bg-white rounded-lg py-3 flex flex-row space-x-2 items-center justify-center" onPress={() => { }}>
                    <Image
                        source={require('@/assets/icons/google.png')}
                        alt="Google" className="!w-8 !h-8"
                        resizeMode="contain" />
                    <Text className="text-black text-center text-lg">Register with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full bg-white rounded-lg py-3 flex flex-row space-x-2 items-center justify-center" onPress={() => { }}>
                    <Image
                        source={require('@/assets/icons/facebook-f.png')}
                        alt="Google" className="!w-6 !h-6"
                        resizeMode="contain" />
                    <Text className="text-black text-center text-lg">Register with Facebook</Text>
                </TouchableOpacity>
                <Text className="text-white text-sm">Don't have an account? <Link href="/auth/register" className="text-white font-bold">Register</Link></Text>
                <Text className="text-white text-sm text-center">By signing in you agree to our <Link href={"/home"} className="text-white font-bold">Terms of Service</Link> and <Link href="/home" className="text-white font-bold">Privacy Policy</Link></Text>

            </View>

            <Text className="w-full text-white text-sm text-center absolute bottom-4 left-0">© 2025 Wasl. All rights reserved.</Text>
        </View>
    );
}
