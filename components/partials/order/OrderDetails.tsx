import { ScrollView, View, Text, I18nManager, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";
import { Linking } from "react-native";
import '@/global.css'
import Order from "@/types";

export default function OrderDetails({ order }: { order: Order }) {
    const [tab, setTab] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const tabs = [
        { id: 0, name: I18nManager.isRTL ? "التفاصيل" : "Details" },
        { id: 1, name: I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details" },
    ];

    console.log('there is : ' + order.items.length)

    // retrive the query param : order_id
    const local = useLocalSearchParams();
    return (
        <View className="w-full p-4 bg-white rounded-md flex flex-col mt-4 shadow-md">
            <Text className="text-md font-semibold pb-2 border-b border-gray-200 text-gray-400">
                {I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details"}
            </Text>
            <View className="w-full border-b border-gray-200 py-2 flex flex-row justify-between items-center px-2">
                <View className="flex flex-row justify-start items-center gap-4">
                    <Text className="text-slate-700 text-sm w-10">
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

            <View className="w-full py-2 flex flex-col items-center px-2">
                {order.items && order.items.length > 0 ?
                    order.items.map(function (item) {
                        return (
                            <View key={Math.ceil(Math.random() * 1000)} className="w-full flex justify-between flex-row items-center">
                                <View className="flex flex-row justify-start items-center gap-4">
                                    <Text className="text-slate-700 text-sm w-10">
                                        x{item.quantity}
                                    </Text>
                                    <Text className="text-slate-700 text-sm ">
                                        {item.item_name}
                                    </Text>
                                </View>

                                <Text className="text-slate-700 text-sm">
                                    {item.price.toFixed(2)} SAR
                                </Text></View>)
                    }) : <Text className="text-center py-2 font-semibold text-slate-500">no item found</Text>}
            </View>

            <View className="w-full border-t border-b pb-2 border-gray-200 mt-2 flex flex-col gap-2">
                <View className="w-full flex flex-row justify-between items-center">
                    <Text>
                        {I18nManager.isRTL ? 'المجموع:' : 'Total'}
                    </Text>
                    <Text className="text-slate-700 text-sm font-semibold">
                        {order.total.toFixed(2)} SAR
                    </Text>
                </View>
                <View className="w-full flex flex-row justify-between items-center">
                    <Text>
                        {I18nManager.isRTL ? 'رسوم التوصيل:' : 'Delivery Fees:'}
                    </Text>
                    <Text className="text-slate-700 text-sm font-semibold">
                        50.35 SAR
                    </Text>
                </View>
                <View className="w-full flex flex-row justify-between items-center">
                    <Text>
                        {I18nManager.isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}
                    </Text>
                    <Text className="text-slate-700 text-sm font-semibold">
                        0.35 SAR
                    </Text>
                </View>
            </View>

            <View className="w-full flex flex-row justify-between items-center pt-2">
                <Text>
                    {I18nManager.isRTL ? 'الإجمالي:' : 'Total:'}
                </Text>
                <Text className="text-slate-700 text-sm font-semibold">
                    {Number(order.total.toFixed(2) + 50 + 20).toFixed(2)} SAR
                </Text>
            </View>
        </View>
    )
}
