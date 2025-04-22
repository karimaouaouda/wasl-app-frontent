import { Switch, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, router } from "expo-router";
import AuthManager from "@/components/layouts/AuthLayout";
import Order from "@/types";
import Auth from "@/services/authservice";


export default function ActiveTab() {
    // initilize states
    const [isEnabled, setIsEnabled] = useState(false);
    const [data, setData] = useState<null | Array<Order>>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const toggleSwitch = () => {
        setData(null);
        setIsEnabled(previousState => !previousState);
    }

    const auth = new Auth()

    function loadOrders(){
        setLoading(true)
        // fetch orders from the server
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'َAuthorization': `Bearer ${auth.getToken()}`,
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200 || res.status === 201) {
                console.log(res.json())
                return res.json()
            } else {
                console.log(res)
                alert('error getting data click refresh button')
                return null
            }
        })
            .then(json_data => {
                setLoading(false)
                if(json_data === null || !('data' in json_data)){
                    alert('no data for some reason')
                }
                setData(json_data.data)
            })
    }
    useEffect(() => {
        if(!data){
            loadOrders()
        }
    }, [data, isEnabled]); // add isEnabled to the dependency array to refetch data when it changes

    // get current language

    function refreshData() {
        setData(null);
    }

    return (
        <AuthManager>
            <View className="toggle-button-wrapper flex flex-row justify-between">
                <View className="flex flex-row items-center space-x-2">
                    <Switch
                        trackColor={{ false: "#767577", true: "#03fc41" }}
                        thumbColor={isEnabled ? "#03fc41" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text className={"text-sm font-semibold " + (isEnabled ? 'text-green-500' : 'text-slate-800')}>{I18nManager.isRTL ? "متاح" : "Active"}</Text>
                </View>
                {loading? <ActivityIndicator/> : <TouchableOpacity onPress={loadOrders}>
                    <IconSymbol className="text-green-500" name="cached" size={24} color="#767577" />
                </TouchableOpacity>}
            </View>

            <View className="flex flex-col gap-2 mt-4 mb-10">
                {data && data.map((item, index) => (
                    <Link key={Math.ceil(Math.random() * 1000)} href={"/order/OrderView?order_id=5"} className="w-full block">
                        <View className="bg-white p-4 rounded-lg shadow-md w-full">
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-green-500 text-sm border rounded-lg p-2">
                                    {/*I18nManager.isRTL ? 'جاري التحضير' : 'Preparing'*/}
                                    {item.status}
                                </Text>
                                <Text className="text-sm font-semibold text-gray-500">
                                    {I18nManager.isRTL ? 'منذ يومين' : '2 Days Ago'}
                                </Text>
                            </View>
                            <View className="flex flex-row justify-between items-center mt-2">
                                <Text className="text-lg font-semibold">#{item.id}</Text>
                                <View className="flex flex-col space-y-1">
                                    <Text className="text-sm font-semibold text-gray-500 text-xs text-green-500">
                                        {item.total.toFixed(2)} SAR
                                    </Text>
                                    <Text className="text-sm font-semibold text-gray-500 text-xs text-green-500">
                                        {I18nManager.isRTL ? "دفع إلكتروني" : "Online Payment"}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row justify-start items-center mt-2 space-x-2">
                                <Image
                                    style={{ objectFit: 'contain' }}
                                    source={{ uri: item.restaurant_data[0].logo_url }} // Replace with your image URL
                                    className="w-14 h-20"
                                />
                                <View className="flex flex-col justify-around items-start">
                                    <Text className="text-sm font-semibold text-gray-500 ml-2">
                                        {item.restaurant_data[0].name}
                                    </Text>
                                    <Text className="text-sm font-semibold text-gray-500 ml-2">
                                        {I18nManager.isRTL ? "الإستلام: فرع القيروان" : "Pickup: Al-Qayrawan Branch"}
                                    </Text>
                                    <Text className="text-sm font-semibold text-gray-500 ml-2">
                                        {I18nManager.isRTL ? "وقت التوصيل: 05/04/2025 - 14:05" : "Delivery Time: 05/04/2025 - 14:05"}
                                    </Text>
                                </View>
                            </View>
                            <View className="buttons flex gap-4 flex-row items-center mt-4">
                                <TouchableOpacity className="bg-green-500 rounded-lg p-2 flex-1">
                                    <Text className="text-white text-center font-semibold">{I18nManager.isRTL ? "تأكيد" : "Confirm"}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="bg-red-500 rounded-lg p-2 flex-1">
                                    <Text className="text-white text-center font-semibold">{I18nManager.isRTL ? "رفض" : "reject"}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Link>
                ))}
            </View>

            <Text>
                try
            </Text>
        </AuthManager>
    )
}