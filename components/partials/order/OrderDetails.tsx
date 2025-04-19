import { ScrollView, View, Text, I18nManager, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { Linking } from "react-native";
import '@/global.css'

export default function OrderDetails() {
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
        <View className="w-full p-4 bg-white rounded-md flex flex-col mt-4 shadow-md">
            <Text className="text-md font-semibold pb-2 border-b border-gray-200 text-gray-400">
                {I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details"}
            </Text>
            <View className="w-full border-b border-gray-200 py-2 flex flex-row justify-between items-center px-2">
                <View className="flex flex-row justify-start items-center">
                    <Text className="text-slate-700 text-sm">
                        {I18nManager.isRTL ? 'العدد' : 'Quantity'}
                    </Text>
                    <Text className="text-slate-700 text-sm ml-10">
                        {I18nManager.isRTL ? 'الصنف' : 'Item'}
                    </Text>
                </View>

                <Text className="text-slate-700 text-sm">
                    {I18nManager.isRTL ? 'السعر' : 'Price'}
                </Text>
            </View>
        </View>
    )
}
