import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";

export default function ProfileTab() {
    // retrieve the query param : order_id
    return (
        <ScrollView className="w-screen h-screen bg-slate-100 p-4 flex flex-col gap-2">
            {/* the top view (back/page name) */}
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
            {/* profile banner */}
            <View className="w-full flex flex-row items-center justify-between mt-10 p-4 bg-white rounded-lg shadow-md">
                <View className="w-fit flex flex-row gap-4 items-center">
                    <View className="w-24 h-24 bg-slate-300 rounded-full items-center justify-center overflow-hidden border-2 border-sky-700 shadow">
                        <Image
                            source={require('@/assets/images/custom/profile.jpeg')}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="flex flex-col items-start">
                        <Text className="text-lg font-bold text-center" style={{ fontSize: 20 }}>
                            كريم عواودة
                        </Text>
                        <Text className="text-xs text-gray-400 font-bold text-center">
                            @karim_aouaouda
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <IconSymbol name="edit" size={20} color="#767577" />
                </TouchableOpacity>
            </View>

            {/* horizental slide with cards items */}
            <View className="slider ">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full h-32 mt-4">
                    <View className="w-40 h-32 bg-white rounded-lg shadow-md mr-2">
                        <Image
                            source={require('@/assets/images/custom/profile.jpeg')}
                            className="w-full h-full rounded-lg"
                        />
                    </View>
                    <View className="w-40 h-32 bg-white rounded-lg shadow-md mr-2">
                        <Image
                            source={require('@/assets/images/custom/profile.jpeg')}
                            className="w-full h-full rounded-lg"
                        />
                    </View>
                    <View className="w-40 h-32 bg-white rounded-lg shadow-md mr-2">
                        <Image
                            source={require('@/assets/images/custom/profile.jpeg')}
                            className="w-full h-full rounded-lg"
                        />
                    </View>
                </ScrollView>
            </View>

        


        </ScrollView>
    )
}