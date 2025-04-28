import { Link, router, useRouter } from "expo-router";
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
    const router = useRouter()


    useEffect(() => {
        // check whether there is a token in secure storage
        // if there is a token, navigate to home page
        if( auth.getToken() ){
            router.replace('/(tabs)')
        }
    }, [])


    function register() {
        setErrors(null)
        setLoading(true)

        var payload = new FormData
        payload.append('name', name)
        payload.append('email', email)
        payload.append('password', password)
        payload.append('password_confirmation', passwordConfirmation)
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/register`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                contentType: 'application/json',
                accept: 'application/json'
            },
            method: 'POST',
            body: payload
        }).then(res => res.json())
        .then(json_data => {
            if( json_data && 'success' in json_data ){
                let token = json_data['token']
                auth.setToken(token)
                router.replace('/(tabs)')
                return
            }

            if( json_data && 'errors' in json_data ){
                setErrors(json_data.errors)
            }else{
                alert(json_data.message)
            }
        }).catch(err => {
            alert(err)
        }).finally(() => {
            setLoading(false)
        })
    }


    return (
        <View
            className="flex flex-col min-h-screen bg-[#fb6f16] w-screen relative"
        >
            <ScreenTitle
                classes="text-white"
                title="back" />
            <View className="flex flex-row items-center justify-start w-full px-10 mt-20 space-x-2">
                <Image
                    source={require('@/assets/icons/delivery-white.png')}
                    alt="Logo"
                    className="!w-24 !h-24"
                    resizeMode="contain"
                />
                <View className="flex flex-col items-start justify-center flex-1 space-y-2">
                    <Text className="p-0 text-2xl font-bold text-white text-start w-fit">
                        {I18nManager.isRTL ? 'وصل - إفتح حسابا ' : 'Register'}
                    </Text>
                    <Text className="text-white text-start text-md word-wrap overflow-wrap">
                        {I18nManager.isRTL ? 'وصل المطاعم بمندوبي التوصيل المتعاقدين معنا' : 'Connection restaurents with delivery partners'}
                    </Text>
                </View>
            </View>

            <View className="flex flex-col items-center justify-center w-full gap-4 mt-10 px-14">
                <TextInput
                    placeholder="Name"
                    onChangeText={setName}
                    className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
                {errors?.name && <Text className="text-sm text-white">{errors.name}</Text>}
                <TextInput
                    placeholder="Email"
                    onChangeText={setEmail}
                    className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
                {errors?.email && <Text className="text-sm text-white">{errors.email}</Text>}
                <TextInput
                    placeholder="Password"
                    onChangeText={setPassword}
                    className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
                {errors?.password && <Text className="text-sm text-white">{errors.password}</Text>}
                <TextInput
                    onChangeText={setPasswordConfirmation}
                    placeholder="Password Confirmation"
                    className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
                {errors?.password_confirmation && <Text className="text-sm text-white">{errors.password_confirmation}</Text>}
                <TouchableOpacity
                    disabled={loading}
                    className="flex flex-row items-end justify-center w-1/2 py-3 space-x-2 rounded-lg bg-slate-100" onPress={register}>
                    {loading ? <ActivityIndicator size="small" color="red" /> : <Text> Register</Text>}
                </TouchableOpacity>
                <Text className="text-sm text-white">Or</Text>
                <TouchableOpacity
                    className="flex flex-row items-center justify-center w-full py-3 space-x-2 bg-white rounded-lg" onPress={() => { }}>
                    <Image
                        source={require('@/assets/icons/google.png')}
                        alt="Google" className="!w-8 !h-8"
                        resizeMode="contain" />
                    <Text className="text-lg text-center text-black">Register with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex flex-row items-center justify-center w-full py-3 space-x-2 bg-white rounded-lg" onPress={() => { }}>
                    <Image
                        source={require('@/assets/icons/facebook-f.png')}
                        alt="Google" className="!w-6 !h-6"
                        resizeMode="contain" />
                    <Text className="text-lg text-center text-black">Register with Facebook</Text>
                </TouchableOpacity>
                <Text className="text-sm text-white">Don't have an account? <Link href="/auth/register" className="font-bold text-white">Register</Link></Text>
                <Text className="text-sm text-center text-white">By signing in you agree to our <Link href={"/home"} className="font-bold text-white">Terms of Service</Link> and <Link href="/home" className="font-bold text-white">Privacy Policy</Link></Text>

            </View>
            <Text className="absolute left-0 w-full text-sm text-center text-white bottom-4">© 2025 Wasl. All rights reserved.</Text>
        </View>
    );
}
