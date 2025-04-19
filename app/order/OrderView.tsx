import { ScrollView, View, Text, I18nManager, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { Linking } from "react-native";
import '@/global.css'
import Details from "@/components/partials/order/Details";
import OrderDetails from "@/components/partials/order/OrderDetails";

export default function OrderView() {
    //define constants
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
        <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={makePhoneCall}/>
        } 
            className="w-full h-screen bg-slate-100 p-4 flex flex-col gap-2">
            
            <View className="w-full flex flex-row justify-between items-center">
                
                <Link href={"/(tabs)"}>
                    <IconSymbol className="text-green-500" name="arrow-forward" size={24} color="#767577" />
                </Link>
                <Text className="text-lg font-bold text-center">
                    {local.order_id ? `Order ID: ${local.order_id}` : "Order ID"}
                </Text>
                <Text className="text-green-500 text-sm">
                    v1.0.0
                </Text>
            </View>
            <View className="flex flex-col space-y-2 mt-10">
                <View className="flex flex-row justify-start items-center gap-4">
                    <Text className="text-slate-700 text-lg">
                        {I18nManager.isRTL ? 'رقم الطلب:' : 'Order ID'}
                    </Text>
                    <Text className="text-slate-700 text-lg font-semibold">
                        {local.order_id ? `#${local.order_id}` : "#0000"}
                    </Text>
                </View>
                <View className="flex flex-row justify-start items-center gap-4">
                    <Text className="text-slate-700 text-lg">
                        {I18nManager.isRTL ? 'وقت الإنشاء:' : 'Creation Time'}
                    </Text>
                    <Text className="text-slate-700 text-lg font-semibold">
                        {I18nManager.isRTL ? 'منذ يومين' : '2 Days Ago'}
                    </Text>
                </View>
                <View className="flex flex-row justify-start items-center gap-4">
                    <Text className="text-slate-700 text-lg">
                        {I18nManager.isRTL ? 'الحالة:' : 'Status'}
                    </Text>
                    <Text className="text-slate-700 text-lg font-semibold">
                        {I18nManager.isRTL ? 'جاري التحضير' : 'Preparing'}
                    </Text>
                </View>
            </View>

            <View className="w-full bg-white rounded-md flex flex-row justify-between items-center mt-4 px-2 shadow-md">
                <Image
                    style={{ objectFit: 'contain' }}
                    source={require('@/assets/images/custom/logo.png')} // Replace with your image URL
                    className="w-14 h-20" />

                <View className="flex flex-col space-y-1 border border-green-500 rounded-lg p-2">
                    <Text className="text-sm font-semibold text-gray-500 text-xs text-green-500">
                        120.35 SAR
                    </Text>
                    <Text className="text-sm font-semibold text-gray-500 text-xs text-green-500">
                        {I18nManager.isRTL ? "دفع إلكتروني" : "E-Payment"}
                    </Text>
                </View>
            </View>

            <View className="tabs w-full bg-white rounded-md flex flex-row justify-between items-center mt-4 px-2 shadow-md">
                <TouchableOpacity className={"flex-1 p-2 " + (tab === 0 ? "border-b-2 border-green-500" : "")} onPress={() => setTab(0)}>
                    <Text className="text-center text-green-500 font-semibold">
                        {I18nManager.isRTL ? "التفاصيل" : "Details"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className={"flex-1 p-2 " + (tab === 1 ? "border-b-2 border-green-500" : "")} onPress={() => setTab(1)}>
                    <Text className="text-center text-gray-500 font-semibold">
                        {I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details"}
                    </Text>
                </TouchableOpacity>
            </View>

            {tab !== 0 ? <Details/> : <OrderDetails/>}
        </ScrollView>
    )
}