import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";

export default function ProfileTab() {
    // retrieve the query param : order_id
    return (
        <ScrollView className="w-screen h-screen bg-slate-100 p-4 flex flex-col gap-2">
            <View className="w-full flex flex-row justify-between items-center">

                <Link href={"/(tabs)"}>
                    <IconSymbol className="text-green-500" name="arrow-forward" size={24} color="#767577" />
                </Link>
                <Text className="text-lg font-bold text-center">
                    karim aouaouda
                </Text>
                <Text className="text-green-500 text-sm">
                    v1.0.0
                </Text>
            </View>
            <View className="w-full flex flex-row items-center justify-between mt-10 p-4">
                <View className="w-fit flex flex-row gap-4 items-center">
                    <View className="w-24 h-24 bg-slate-300 rounded-full items-center justify-center">
                        <IconSymbol name="person" size={50} color="#767577" />
                    </View>
                    <View className="flex flex-col items-start">
                        <Text className="text-lg font-bold text-center" style={{ fontSize: 20 }}>
                            كريم عواودة
                        </Text>
                        <Text className="text-lg text-gray-400 font-bold text-center">
                            كريم عواودة
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <IconSymbol name="edit" size={20} color="#767577" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}