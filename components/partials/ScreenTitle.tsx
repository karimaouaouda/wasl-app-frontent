"use document"
import { Image, StyleSheet, Text, View } from "react-native";
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '../../global.css'
import { Link } from "expo-router";

export default function ScreenTitle({ title, classes }: { title: string, classes: string }) {

  return (
    <View className="w-full py-4 flex flex-row px-8 justify-start items-center space-x-4">
      <Link href={'/'} asChild>
        <Text className={"text-slate-800 font-semibold text-lg " + classes}>{title}</Text>
      </Link>
    </View>
  );
}
 