import { ScrollView, View, Text, I18nManager, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { Linking } from "react-native";
import '@/global.css'

export default function Details() {
    const [tab, setTab] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const tabs = [
        { id: 0, name: I18nManager.isRTL ? "التفاصيل" : "Details" },
        { id: 1, name: I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details" },
    ];

    function makePhoneCall() {
        Linking.openURL('tel:+213655766709')
    }

    function makeWhatsCall() {
        Linking.openURL('whatsapp://send?text=Hello&phone=+213655766709')
    }

    // retrive the query param : order_id
    const local = useLocalSearchParams();
    return (
        <>
            <View className="w-full p-4 bg-white rounded-md flex flex-col justify-between items-center mt-4 shadow-md">
                <View className="w-full">
                    <Text className="text-lg font-semibold text-gray-800">
                        {I18nManager.isRTL ? "مكان الإستلام" : "Pickup Location"}
                    </Text>
                </View>
                <View className="w-full flex flex-row justify-between items-center mt-2">
                    <View className="flex flex-row justify-start items-center mt-2">
                        <Image
                            style={{ objectFit: 'contain' }}
                            source={require('@/assets/images/custom/logo.png')} // Replace with your image URL
                            className="w-14 h-20"
                        />
                        <View className="flex flex-col justify-around items-start">
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                Mandimajeed
                            </Text>
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                {I18nManager.isRTL ? "الإستلام: فرع القيروان" : "Pickup: Al-Qayrawan Branch"}
                            </Text>
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                {I18nManager.isRTL ? "وقت التوصيل: 05/04/2025 - 14:05" : "Delivery Time: 05/04/2025 - 14:05"}
                            </Text>
                        </View>
                    </View>
                    <View className="flex flex-col gap-2">
                        <TouchableOpacity onPress={makePhoneCall} className="bg-green-600 rounded-lg p-2">
                            <IconSymbol name="phone" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-600 rounded-lg p-2">
                            <IconSymbol name="room" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="w-full mt-2">
                    <TouchableOpacity className="bg-sky-500 text-white rounded-md py-2">
                        <Text className="text-white text-center font-semibold">
                            {I18nManager.isRTL ? "إستلام" : "Pickup"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="w-full p-4 bg-white rounded-md flex flex-col justify-between items-center mt-4 shadow-md">
                <View className="w-full">
                    <Text className="text-lg font-semibold text-gray-800">
                        {I18nManager.isRTL ? "مكان التوصيل - العميل" : "Delivery Location - Client"}
                    </Text>
                </View>
                <View className="w-full flex flex-row justify-between items-center mt-2">
                    <View className="flex flex-row justify-start items-center mt-2">
                        <View className="flex flex-col justify-around items-start">
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                مهند
                            </Text>
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                {I18nManager.isRTL ? "العننوان: الوصف المعنا " : "Address: Description"}
                            </Text>
                            <Text className="text-sm font-semibold text-gray-500 ml-2">
                                {I18nManager.isRTL ? "وقت التوصيل: 05/04/2025 - 14:05" : "Delivery Time: 05/04/2025 - 14:05"}
                            </Text>
                        </View>
                    </View>
                    <View className="flex flex-col gap-2">
                        <TouchableOpacity onPress={makePhoneCall} className="bg-green-600 rounded-lg p-2">
                            <IconSymbol name="phone" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={makeWhatsCall} className="bg-sky-500 rounded-lg p-2">
                            <FontAwesome name="whatsapp" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-red-600 rounded-lg p-2">
                            <IconSymbol name="room" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}
