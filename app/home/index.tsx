import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import '@/global.css';
import { Google } from "react-bootstrap-icons";

export default function Index() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Index screen mounted");
    return () => {
      console.log("Index screen unmounted");
    };
  }, []);
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
      <View className="w-full flex flex-col items-center justify-center mt-4 px-14 space-y-4">
        <Link className="w-full bg-[#ee530e] py-3 rounded-md text-center" href="/auth/login">
          <Text className="text-white text-lg">Login</Text>
        </Link>
        <Link className="w-full bg-[#ee530e] py-3 rounded-md text-center" href="/auth/register">
          <Text className="text-white text-lg">Register</Text>
        </Link>
        <Link href={'/home'} className="w-full py-3 bg-[#f8f8f5] rounded-md flex flex-row items-center justify-center">
          <Text className="text-slate-800 font-semibold text-lg">Continue with Google</Text>
        </Link>
      </View>
    </View>
  );
}
