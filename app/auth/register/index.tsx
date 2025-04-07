import ScreenTitle from "@/components/partials/ScreenTitle";
import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "react-bootstrap-icons";
import AppLogo from "@/components/utils/AppLogo";
import Input from "@/components/utils/Input";


interface ErrorsProps {
    email?: string;
    password?: string;
    name?: string;
    password_confirmation?: string;
}

export default function RegisterScreen() {
    // generate a login page containing login form email password and login button
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    const [token, setToken] = useState(null);
    const [errors, setErrors] = useState<ErrorsProps|null>(null);

    useEffect(() => {
        axios.get('http://localhost:8000/sanctum/csrf-cookie')
    }, [])
    function register() {

    }
    return (
        <View className="h-screen w-screen bg-white">
            <ScreenTitle title="Register Page" />

            <View className="flex flex-col items-center justify-center space-y-4 mt-20">
                <AppLogo />

                <Input
                    placeholder="Name"
                    keyboardType="default"
                    autoCapitalize="words"
                    inputErrorClasses="border-red-500"
                    error={errors?.name} />

                <Input
                    placeholder="Email"
                    keyboardType="email-address"
                    inputErrorClasses="border-red-500"
                    error={errors?.email} />

                <Input
                    placeholder="password"
                    keyboardType="default"
                    secureTextEntry={true}
                    inputErrorClasses="border-red-500"
                    error={errors?.password} />
                <Input
                    placeholder="password confirmation"
                    keyboardType="default"
                    secureTextEntry={true}
                    inputErrorClasses="border-red-500"
                    error={errors?.password_confirmation} />

                <TouchableOpacity onPress={register} className="bg-red-500 rounded-lg p-2 w-80">
                    <Text className="text-white font-bold text-center">Register</Text>
                </TouchableOpacity>
                <View className="flex flex-row space-x-2 mt-4">
                    <Text className="text-gray-500">Already have an account?</Text>
                    <Link href="/auth/login" asChild>
                        <Text className="text-red-500 font-bold">Login</Text>
                    </Link>
                </View>
            </View>

        </View>
    );
}
