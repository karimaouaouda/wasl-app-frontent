import ScreenTitle from "@/components/partials/ScreenTitle";
import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeft } from "react-bootstrap-icons";
import AppLogo from "@/components/utils/AppLogo";
import Input from "@/components/utils/Input";
import Btn from "@/components/utils/Btn";

interface ErrorsProps {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  // generate a login page containing login form email password and login button
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  const [token, setToken] = useState(null);
  const [errors, setErrors] = useState<ErrorsProps | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/sanctum/csrf-cookie')
  }, [])

  function testAuth() {
    axios.get('http://localhost:8000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}` // add the token to the headers
      }
    })
      .then((response) => {
        console.log(response.data);
      })
  }
  function login() {
    var body: FormData = new FormData
    body.append('email', 'karimaouaouda.officiel@gmail.com')
    body.append('password', 'cpplang24')
    axios.post('http://localhost:8000/api/login', body)
      .then((response) => {
        setToken(response.data.token);
        console.log(response.data);
      })
  } 
  return (
    <View className="h-screen w-screen bg-white">
      <ScreenTitle title="Login Page" />

      <View className="flex flex-col items-center justify-center space-y-4 mt-20">
        <AppLogo />

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

        <Btn text="Login" classes="bg-green-500 lg:bg-red-100 !w-fit"/>
      </View>
      <View className="flex flex-col">
        <View className="flex flex-row justify-center items-center mt-4 space-x-2">
          <Text className="text-gray-500">Don't have an account?</Text>
          <Link href="/auth/register" asChild>
            <Text className="text-red-500 font-bold">Register</Text>
          </Link>
        </View>
        <View className="flex flex-row justify-center items-center mt-2 space-x-2">
          <Text className="text-gray-500">forget your password?</Text>
          <Link href="/(tabs)" asChild>
            <Text className="text-red-500 font-bold">reset it</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
