import { ScrollView, View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link } from "expo-router";
import AuthManager from "@/components/layouts/AuthLayout";

export default function ProfileTab() {
    // retrieve the query param : order_id
    return (
        <AuthManager refreshAction={() => null}>
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
            <View className="w-full p-4 relative flex flex-row items-center justify-between mt-10 bg-white rounded-lg shadow-md">

                <View
                    className="w-fit flex flex-row gap-4 items-center">

                    <View className="w-24 shadow-md  h-24 bg-slate-300 rounded-full items-center justify-center overflow-hidden border-2 border-sky-700 shadow">
                        <Image
                            source={require('@/assets/images/custom/profile.jpeg')}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="flex flex-col items-start">
                        <Text className="text-lg font-bold text-center" style={{ fontSize: 20 }}>
                            كريم عواودة
                        </Text>
                        <Text className="text-xs  text-gray-400 font-bold text-center">
                            @karim_aouaouda
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <IconSymbol
                        name="edit"
                        size={20}
                        color="#767577" />
                </TouchableOpacity>
            </View>

            {/* horizental slide with cards items */}
            <View className="flex flex-col gap-1 settings-list p-4 bg-white rounded-md mt-4">
                <Text className="font-semibold text-lg text-slate-800 mb-2">Settings</Text>
                <TouchableOpacity
                    touchSoundDisabled={false}
                    className="w-full flex flex-row justify-between p-2 rounded-md items-center">
                    <View className="w-fit flex flex-row gap-2">
                        <IconSymbol
                            name="manage-accounts"
                            size={26}
                            color="#767577" />
                        <Text className="font-semibold text-lg text-slate-800">
                            Account Settings
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    touchSoundDisabled={false}
                    className="w-full  flex flex-row justify-between p-2 rounded-md items-center">
                    <View className="w-fit flex flex-row gap-2">
                        <IconSymbol
                            name="security"
                            size={26}
                            color="#767577" />
                        <Text className="font-semibold text-lg text-slate-800">
                            Security Settings
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    touchSoundDisabled={false}
                    className="w-full  flex flex-row justify-between p-2 rounded-md items-center">
                    <View className="w-fit flex flex-row gap-2">
                        <IconSymbol
                            name="lock"
                            size={26}
                            color="#767577" />
                        <Text className="font-semibold text-lg text-slate-800">
                            Privacy Settings
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    touchSoundDisabled={false}
                    className="w-full flex flex-row justify-between p-2 rounded-md items-center">
                    <View className="w-fit flex flex-row gap-2">
                        <IconSymbol
                            name="language"
                            size={26}
                            color="#767577" />
                        <Text className="font-semibold text-lg text-slate-800">
                            Language Settings
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    touchSoundDisabled={false}
                    className="w-full  flex flex-row justify-between p-2 rounded-md items-center">
                    <View className="w-fit flex flex-row gap-2">
                        <IconSymbol
                            name="history"
                            size={26}
                            color="#767577" />
                        <Text className="font-semibold text-lg text-slate-800">
                            Order History
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>
        </AuthManager>
    )
}