import { Text, View } from "react-native";

export default function AppLogo() {
    return (
        <View className="flex flex-row items-center py-8">
            <Text className="font-bold text-red-500 text-3xl tracking-wide">My</Text>
            <Text className="font-bold text-gray-800 text-3xl tracking-wide">App</Text>
        </View>
    );
}