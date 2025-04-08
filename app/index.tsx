import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import Swal from 'sweetalert2';
import '@/global.css';

export default function Index() {

  const [count, setCount] = useState(0);

    
  return (
    <View
      className="flex flex-col min-h-screen bg-[#fb6f16] w-screen"
    >
      <Image
        source={require('@/assets/icons/delivery-color.png')}
        alt="Logo"
        className="!w-3/5 !h-[calc(3/5*100vw)] mx-auto mt-20"
        resizeMode="contain"
      />
<Text className="text-center text-white font-bold p-0" style={{ fontSize: 95 }}>Wasl</Text>
      <Text className="text-center text-white p-0" style={{ fontSize: 30 }}>
        Connection restaurents with delivery partners
      </Text>
      <View className="w-full flex flex-col !h-auto items-center justify-center mt-4 px-14">
        <Link className="w-full bg-[#ee530e] py-3 rounded-md text-center mt-4" href="/auth/login">
          <Text className="text-white text-lg">Login</Text>
        </Link>
        <Link className="w-full bg-[#ee530e] py-3 rounded-md text-center mt-4" href="/auth/register">
          <Text className="text-white text-lg">Register</Text>
        </Link>
        <Link
          href={'/home'} 
          style={{ alignContent: 'stretch'}}
          className="w-full content-stretch py-3 bg-[#f8f8f5] rounded-md mt-4 flex flex-row items-center justify-center">
          <Image
            source={require('@/assets/icons/google.png')}
            alt="Google" className="!w-8 !h-8"
            resizeMode="contain" />
          <Text className="text-slate-800 font-semibold text-lg">Continue with Google</Text>
        </Link>
      </View>
    </View>
  );
}
