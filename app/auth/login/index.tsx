import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, I18nManager, Image, Linking, Text, TextInput, TouchableOpacity, View } from "react-native";
import '@/global.css';

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
        return {email: 'Error connecting to the server'}
      }
    })
    .then(json_data => {
      setLoading(false) 

      if( 'token' in json_data ){
        // if the token is present in the response we will save it in the secure storage
        // and redirect the user to the home page
        
        auth.setToken(json_data.token).then(() => {
          router.navigate('/(tabs)')
        })
      }else if( 'errors' in json_data ){
        // if the errors are present in the response we will
        // set the errors state to the errors object
        setErrors(json_data.errors)
      }else{
        alert('Error connecting to the server')
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
        <View className="flex justify-start flex-row space-x-2 items-center w-full px-10 mt-20">
          <Image
            source={require('@/assets/icons/delivery-white.png')}
            alt="Logo"
            className="!w-24 !h-24"
            resizeMode="contain"
          />
          <View className="flex flex-1 flex-col items-start justify-center space-y-2">
            <Text className="text-start w-fit text-2xl font-bold p-0 text-white">
              {I18nManager.isRTL ? 'وصل - تسجيل الدخول' : 'Login'}
            </Text>
            <Text className="text-start text-white text-md word-wrap overflow-wrap">
              {I18nManager.isRTL ? 'وصل المطاعم بمندوبي التوصيل المتعاقدين معنا' : 'Connection restaurents with delivery partners'}
            </Text>
          </View>
        </View>

        {/* now we will define the form */}
        <View className="w-full flex flex-col items-center justify-center mt-10 px-14 gap-4">

          <TextInput
            id="email"
            onChangeText={setEmail}
            placeholder="Email"
            className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
          {errors?.email && <Text className="text-white text-sm">{errors.email}</Text>}

          <TextInput
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholder="Password"
            className="w-full bg-white rounded-lg p-4 text-sm text-gray-700" />
          {errors?.password && <Text className="text-white text-sm">{errors.password}</Text>}

          {/** log in button */}
          <TouchableOpacity
            disabled={loading}
            className="w-1/2 bg-slate-100 rounded-lg py-3 flex flex-row space-x-2 items-end justify-center"
            onPress={login}>
            {loading ? <ActivityIndicator size="small" color="red" /> : <Text> Log In</Text>}
          </TouchableOpacity>


          <Link href="/home" className="text-white text-sm">Forgot Password? click here</Link>

          <Text className="text-white text-sm">Or</Text>

          <TouchableOpacity
            className="w-full bg-white rounded-lg py-3 flex flex-row space-x-2 items-center justify-center" onPress={() => { }}>
            
            <Image
              source={require('@/assets/icons/google.png')}
              alt="Google" className="!w-8 !h-8"
              resizeMode="contain" />
            <Text className="text-black text-center text-lg">Login with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="w-full bg-white rounded-lg py-3 flex flex-row space-x-2 items-center justify-center" onPress={() => { }}>
            <Image
              source={require('@/assets/icons/facebook-f.png')}
              alt="Facebook" className="!w-6 !h-6"
              resizeMode="contain" />
            <Text className="text-black text-center text-lg">Login with Facebook</Text>
          </TouchableOpacity>
          <Text className="text-white text-sm">Don't have an account? <Link href="/auth/register" className="text-white font-bold">Register</Link></Text>
          <Text className="text-white text-sm text-center">By signing in you agree to our <Link href="/home" className="text-white font-bold">Terms of Service</Link> and <Link href="/home" className="text-white font-bold">Privacy Policy</Link></Text>

        </View>

        <Text className="w-full text-white text-sm text-center absolute bottom-4 left-0">© 2025 Wasl. All rights reserved.</Text>
      </View>
    </GuestManager>
  );
}
