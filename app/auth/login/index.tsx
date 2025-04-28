import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, I18nManager, Image, Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import '@/global.css';
import { setItemAsync } from 'expo-secure-store';

interface ErrorsProps {
  email?: string;
  password?: string;
}

import ScreenTitle from "@/components/partials/ScreenTitle";
import GuestManager from "@/components/layouts/GuestLayout";
import Validator from "@/services/validationservice";
import Auth from "@/services/authservice";

export default function LoginScreen() {
  // generate a login page containing login form email password and login button
  const [errors, setErrors] = useState<ErrorsProps | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter()

  const auth = new Auth()

  function login(){
    setLoading(true)
    setErrors(null)
    let error:boolean|object = false
    
    if( (error = Validator.validate_data({email, password})) !== true ){
      setLoading(false)
      setErrors(error as ErrorsProps)
      return
    }

    var credentials = new FormData
    credentials.append('email', email)
    credentials.append('password', password)

    console.log(credentials)
    // if the data is valid we will send it to the server
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`,{
      headers:{
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({email, password}),
      method: 'POST',
    }).then(res => {
      if(res.status === 200 || res.status === 422){
        return res.json()
      }else{
        console.log(res)
        return {email: 'The email or password is incorrect'}
      }
    })
    .then(json_data => {
      setLoading(false) 

      if( 'token' in json_data ){
        // if the token is present in the response we will save it in the secure storage
        // and redirect the user to the home page
        
        Promise.all([
          auth.setToken(json_data.token),
          setItemAsync('user', JSON.stringify(json_data.user))  // نحفظ بيانات اليوزر هنا
        ]).then(() => {
          router.navigate('/(tabs)');
        })
      }else if( 'errors' in json_data ){
        // if the errors are present in the response we will
        // set the errors state to the errors object
        setErrors(json_data.errors)
      }else{
        alert('The email or password is incorrect')
        console.log(json_data)
      }
    })
    .catch(err => {
      setLoading(false)
      console.error(err)
      setErrors({email: 'Error connecting to the server'})
    })

  }

  useEffect(() => {
    console.log(auth.getToken())
  }, [])

  return (
    <GuestManager>
      <View
        className="flex flex-col min-h-screen bg-[#fb6f16] w-screen relative"
      >
        {/* header tab */}
        <ScreenTitle
          classes="text-white"
          title="back" />

          {/** the page content start by the header title and logo */}
        <View className="flex flex-row items-center justify-start w-full px-10 mt-20 space-x-2">
          <Image
            source={require('@/assets/icons/delivery-white.png')}
            alt="Logo"
            className="!w-24 !h-24"
            resizeMode="contain"
          />
          <View className="flex flex-col items-start justify-center flex-1 space-y-2">
            <Text className="p-0 text-2xl font-bold text-white text-start w-fit">
              {I18nManager.isRTL ? 'وصل - تسجيل الدخول' : 'Login'}
            </Text>
            <Text className="text-white text-start text-md word-wrap overflow-wrap">
              {I18nManager.isRTL ? 'وصل المطاعم بمندوبي التوصيل المتعاقدين معنا' : 'Connection restaurents with delivery partners'}
            </Text>
          </View>
        </View>

        {/* now we will define the form */}
        <View className="flex flex-col items-center justify-center w-full gap-4 mt-10 px-14">

          <TextInput
            id="email"
            onChangeText={setEmail}
            placeholder="Email"
            className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
          {errors?.email && <Text className="text-sm text-white">{errors.email}</Text>}

          <TextInput
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholder="Password"
            className="w-full p-4 text-sm text-gray-700 bg-white rounded-lg" />
          {errors?.password && <Text className="text-sm text-white">{errors.password}</Text>}

          {/** log in button */}
          <TouchableOpacity
            disabled={loading}
            className="flex flex-row items-end justify-center w-1/2 py-3 space-x-2 rounded-lg bg-slate-100"
            onPress={login}>
            {loading ? <ActivityIndicator size="small" color="red" /> : <Text> Log In</Text>}
          </TouchableOpacity>


          <Link href="/home" className="text-sm text-white">Forgot Password? click here</Link>

          <Text className="text-sm text-white">Or</Text>

          <TouchableOpacity
            className="flex flex-row items-center justify-center w-full py-3 space-x-2 bg-white rounded-lg" onPress={() => { }}>
            
            <Image
              source={require('@/assets/icons/google.png')}
              alt="Google" className="!w-8 !h-8"
              resizeMode="contain" />
            <Text className="text-lg text-center text-black">Login with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex flex-row items-center justify-center w-full py-3 space-x-2 bg-white rounded-lg" onPress={() => { }}>
            <Image
              source={require('@/assets/icons/facebook-f.png')}
              alt="Facebook" className="!w-6 !h-6"
              resizeMode="contain" />
            <Text className="text-lg text-center text-black">Login with Facebook</Text>
          </TouchableOpacity>
          <Text className="text-sm text-white">Don't have an account? <Link href="/auth/register" className="font-bold text-white">Register</Link></Text>
          <Text className="text-sm text-center text-white">By signing in you agree to our <Link href="/home" className="font-bold text-white">Terms of Service</Link> and <Link href="/home" className="font-bold text-white">Privacy Policy</Link></Text>

        </View>

        <Text className="absolute left-0 w-full text-sm text-center text-white bottom-4">© 2025 Wasl. All rights reserved.</Text>
      </View>
    </GuestManager>
  );
}
