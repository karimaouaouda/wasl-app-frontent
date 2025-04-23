import { Switch, Text, View, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { I18nManager } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, router } from "expo-router";
import AuthManager from "@/components/layouts/AuthLayout";
import Order from "@/types";
import Auth from "@/services/authservice";
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';


export default function ActiveTab() {
    // initilize states
    const [isEnabled, setIsEnabled] = useState(false);
    const [data, setData] = useState<Array<Order>>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [confirmingQueue, setConfirmingQueue] = useState<Array<string | number>>([]);
    const [rejectingQueue, setRejectingQueue] = useState<Array<string | number>>([]);
    const [isConnected, setIsConnected] = useState(false);

    const pusher = window.Pusher = Pusher;

    const echo = window.Echo = new Echo({
        broadcaster: 'reverb',
        key: 'kzapg79rumofutkwh48h',
        wsHost: process.env.EXPO_PUBLIC_WS_HOST,
        wsPort: process.env.EXPO_PUBLIC_WS_PORT,
        wssPort: 443,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
    });



    const toggleSwitch = () => {
        setData([]);
        setIsEnabled(previousState => !previousState);
    }

    const auth = new Auth()

    function loadOrders() {
        console.log('loading orders')
        setLoading(true)
        // fetch orders from the server
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/active`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`,
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200 || res.status === 201) {
                return res.json()
            } else if (res.status === 404) {
                console.log(res)
                return { data: [] }
            } else {
                console.log(res)
                return null 
            }
        })
            .then(json_data => {
                setLoading(false)
                if (json_data === null || !('data' in json_data)) {
                    setData([])

                } else if (json_data.data.length === 0) {
                    setData([])
                } else {
                    setData(json_data.data)
                }
            }).catch(err => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (data.length === 0) {
            loadOrders()
        }

        if (!isConnected) {
            echo.channel('order.created')
                .listen('OrderCreated', (e: any) => {
                    refreshData()
                    console.log('order created')
                }).error((error: any) => {
                    console.error('Error:', error);
                })

            echo.channel('order.accepted')
                .listen('OrderAccepted', (e: any) => {
                    refreshData()
                    console.log('order accepted')
                }).error((error: any) => {
                    console.error('Error:', error);
                })

            setIsConnected(true)
        }
    }, [isEnabled]); // add isEnabled to the dependency array to refetch data when it changes

    // get current language

    function refreshData() {
        console.log('refershing...')
        setConfirmingQueue([]);
        setRejectingQueue([])
        loadOrders()
    }

    function acceptOrder(order_id: number | string) {
        // push the order id to confirming queue
        setConfirmingQueue([...confirmingQueue, order_id])



        let id: FormData = new FormData
        id.append('order_id', `${order_id}`)
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/confirm`, {
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
                console.log(res)
                return null
            }
        })
            .then(json_data => {
                setLoading(false)
                if (json_data === null) {
                }

                if ('success' in json_data) {
                    loadOrders()
                }

                //remove order_id from confirming queue
                if (confirmingQueue !== null) {
                    setConfirmingQueue(confirmingQueue.filter((item) => item !== order_id))
                }
                refreshData()
            }).catch(err => {
                setLoading(false)
                console.error(err, confirmingQueue, rejectingQueue)
                //remove order_id from confirming queue
                if (confirmingQueue !== null) {
                    setConfirmingQueue(confirmingQueue.filter((item) => item !== order_id))
                }
            }
            )
    }

    function rejectOrder(order_id: number | string) {
        // push the order id to confirming queue
        setRejectingQueue([...rejectingQueue, order_id])



        let id: FormData = new FormData
        id.append('order_id', `${order_id}`)
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/confirm`, {
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
                console.log(res)
                return null
            }
        })
            .then(json_data => {
                setLoading(false)
                if (json_data === null) {
                }

                if ('success' in json_data) {
                }

                //remove order_id from confirming queue
                if (confirmingQueue !== null) {
                    setRejectingQueue(rejectingQueue.filter((item) => item !== order_id))
                }

                refreshData()
            }).catch(err => {
                setLoading(false)
                //remove order_id from confirming queue
                if (confirmingQueue !== null) {
                    setRejectingQueue(rejectingQueue.filter((item) => item !== order_id))
                }
            }
            )
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
                {data.length > 0 && data.map((item, index) => (
                    <Link key={Math.ceil(Math.random() * 1000)} href={"/order/OrderView?order_id=" + item.id} className="w-full block">
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
                                <TouchableOpacity disabled={confirmingQueue?.includes(item.id)}
                                    onPress={() => acceptOrder(item.id)}
                                    className="bg-green-500 rounded-lg p-2 flex-1">
                                    {confirmingQueue?.includes(item.id) ?
                                        <ActivityIndicator color="white" size={20} /> :
                                        <Text className="text-white text-center font-semibold">{I18nManager.isRTL ? "تأكيد" : "Confirm"}</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={rejectingQueue?.includes(item.id)}
                                    onPress={() => rejectOrder(item.id)}
                                    className="bg-red-500 rounded-lg p-2 flex-1">
                                    {rejectingQueue?.includes(item.id) ?
                                        <ActivityIndicator color="white" size={20} /> :
                                        <Text className="text-white text-center font-semibold">{I18nManager.isRTL ? "رفض" : "reject"}</Text>}
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