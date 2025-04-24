import { Switch, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, router } from "expo-router";
import AuthManager from "@/components/layouts/AuthLayout";
import Order from "@/types";
import Auth from "@/services/authservice";


export default function TodayTab() {
    // initilize states
    const [isEnabled, setIsEnabled] = useState(false);
    const [data, setData] = useState<Array<Order>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [finishQueue, setFinishQueue] = useState<Array<number | string>>([])

    const toggleSwitch = () => {
        setData([]);
        setIsEnabled(previousState => !previousState);
    }

    const auth = new Auth()


    function loadOrders() {
        setLoading(true)
        // fetch orders from the server
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/1/today`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            method: 'GET',
        }).then(async res => {
            console.log('staus : ' + res.status)
            if (res.status === 200 || res.status === 201) {
                return res.json()
            } else if (res.status === 404) {
                console.log(res)
                return { data: [] }
            } else if (res.status === 401) {
                await auth.reset()
                router.replace('/auth/login')
            } else {
                console.log(res)
                return null
            }
        })
            .then(json_data => {
                if (json_data === null || !((typeof(json_data) == 'object') && ('data' in json_data))) {

                } else if (json_data.data.length === 0) {
                    setData([])
                } else {
                    setData(json_data.data)
                }

                setLoading(false)

            }).catch(err => {
                setLoading(false)
                console.error(err)
            })
    }
    useEffect(() => {
        if (data.length === 0) {
            console.log('gettting data ...')
            loadOrders()
        }
    }, [isEnabled]); // add isEnabled to the dependency array to refetch data when it changes

    // get current language

    function refreshData() {
        loadOrders()
    }

    function finishOrder(order_id: number | string) {
        // add the order to the queue
        setFinishQueue([...finishQueue, order_id])


        setLoading(true)
        let id: FormData = new FormData
        id.append('order_id', `${order_id}`)

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/complete`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${auth.getToken()}`,
                contentType: 'application/json'
            },
            method: 'POST',
            body: id
        }).then(res => {
            if (res.status === 200 || res.status === 201 || 400) {
                return res.json()
            } else {
                if (res.status === 401) {
                    auth.reset()
                    router.replace('/auth/login')
                }
                console.log(res)
                
                return null
            }
        })
            .then(json_data => {
                setLoading(false)
                if (json_data === null) {
                    
                }

                if (typeof(json_data) == 'object' && 'success' in json_data) {
                    
                }

                refreshData()
            }).catch(err => {
                setLoading(false)
            })
            .finally(() => {
                // remove the order from the queue
                setFinishQueue(finishQueue.filter((item) => item !== order_id))
            })
    }

    return (
        <AuthManager refreshAction={refreshData}>
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
                {loading ? <ActivityIndicator /> : <TouchableOpacity onPress={refreshData}>
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
                                <TouchableOpacity
                                    disabled={finishQueue.includes(item.id)}
                                    onPress={() => finishOrder(item.id)}
                                    className="bg-green-500 w-2/3 mx-auto p-2 rounded-lg flex flex-row items-center justify-center">
                                    <Text className="text-white text-md font-semibold">
                                        {finishQueue.includes(item.id) ? <ActivityIndicator color="white" size={20} /> : I18nManager.isRTL ? "إنهاء الطلب" : "Finish Order"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Link>
                ))}

                {data.length == 0 && (loading ? <ActivityIndicator color="green" size={'large'} /> : <Text className="text-center py-4 font-semibold text-red-500">{I18nManager.isRTL ? "لا توجد طلبات" : "No Orders Yet"}</Text>)}
            </View>
        </AuthManager>
    )
}