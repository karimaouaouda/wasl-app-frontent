"use document"
import { Image, StyleSheet, Text, View } from "react-native";
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import { ArrowLeft } from "react-bootstrap-icons";
import '../../global.css'
import { Link } from "expo-router";

export default function ScreenTitle({ title }: { title: string }) {

  return (
    <View className="w-full py-4 flex flex-row px-8 justify-start items-center space-x-4">
      <Link href={'/home'} asChild>
        <Image
          key={"screen-icon"}
          source={require("@/assets/icons/arrow-left-circle.svg")}
          style={{ width: 24, height: 24 }}
        />
      </Link>
      <Text className="text-slate-800 font-semibold text-lg">{title}</Text>
    </View>
  );
} 
