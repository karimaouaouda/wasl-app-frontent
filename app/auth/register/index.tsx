import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { I18nManager } from "react-native";
import AuthManager from "@/services/authservice";
import '@/global.css';


interface ErrorsProps {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
}
import ScreenTitle from "@/components/partials/ScreenTitle";

export default function RegisterScreen() {
    // generate a login page containing login form email password and login button
    const [token, setToken] = useState(null);
    const [errors, setErrors] = useState<ErrorsProps | null>(null);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const auth = new AuthManager()


    useEffect(() => {
        // check whether there is a token in secure storage
        if(auth.check()){
            router.navigate('/(tabs)')
        }
    }, [])


    function register() {
        let errors = {}
        setErrors(null)
        setLoading(true);
        console.log(auth.register(name, email, password, passwordConfirmation))
        setLoading(false);
    }


    return (
        <View
            className="flex flex-col min-h-screen bg-[#fb6f16] w-screen relative"
        >
            <ScreenTitle
                classes="text-white"
                title="back" />
            <View className="flex justify-start flex-row space-x-2 items-center w-full px-10 mt-20">
                <Image
                    source={require('@/assets/icons/delivery-white.png')}
                    alt="Logo"
                    className="!w-24 !h-24"
                    resizeMode="contain"
                />
                <View className="flex flex-1 flex-col items-start justify-center space-y-2">
                    <Text className="text-start w-fit text-2xl font-bold p-0 text-white">
                        {I18nManager.isRTL ? 'وصل - إفتح حسابا ' : 'Register'}
                    </Text>
                    <Text className="text-start text-white text-md word-wrap overflow-wrap">
                        {I18nManager.isRTL ? 'وصل المطاعم بمندوبي التوصيل المتعاقدين معنا' : 'Connection restaurents with delivery partners'}
                    </Text>
                </View>
            </View>

            <View className="w-full flex flex-col items-center justify-center mt-10 px-14 gap-4">
                <TextInput
                    placeholder="Name"
                    onChangeText={setName}
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
                {errors?.name && <Text className="text-white text-sm">{errors.name}</Text>}
                <TextInput
                    placeholder="Email"
                    onChangeText={setEmail}
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
                {errors?.email && <Text className="text-white text-sm">{errors.email}</Text>}
                <TextInput
                    placeholder="Password"
                    onChangeText={setPassword}
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
                {errors?.password && <Text className="text-white text-sm">{errors.password}</Text>}
                <TextInput
                    onChangeText={setPasswordConfirmation}
                    placeholder="Password Confirmation"
                    className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
                {errors?.password_confirmation && <Text className="text-white text-sm">{errors.password_confirmation}</Text>}
                <TouchableOpacity
                    disabled={loading}
                    className="w-1/2 bg-slate-100 rounded-lg py-3 flex flex-row space-x-2 items-end justify-center" onPress={register}>
                    {loading ? <ActivityIndicator size="small" color="red" /> : <Text> Register</Text>}
                </TouchableOpacity>
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
