import { View, Text, I18nManager, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useEffect, useState, useCallback } from "react";
import { Linking } from "react-native";
import Details from "@/components/partials/order/Details";
import OrderDetails from "@/components/partials/order/OrderDetails";
import AuthManager from "@/components/layouts/AuthLayout";
import * as SplashScreen from "expo-splash-screen";
import Order, { OrderData } from "@/types";
import Auth from "@/services/authservice";


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 2000,
  fade: true,
  
});

export default function OrderView() {
    //define constants
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState<Order | null>(null);
    const [appIsReady, setAppIsReady] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const tabs = [
        { id: 0, name: I18nManager.isRTL ? "التفاصيل" : "Details" },
        { id: 1, name: I18nManager.isRTL ? "تفاصيل الطلب" : "Order Details" },
    ];

    const auth = new Auth()
    const router = useRouter()

    function makePhoneCall() {
        Linking.openURL('tel:+213655766709')
    }

    function makeWhatsCall() {
        Linking.openURL('whatsapp://send?text=Hello&phone=+213655766709')
    }

    // retrive the query param : order_id
    const local = useLocalSearchParams();

    function loadOrderData() {
        let order_id = local.order_id
        // set loading to true
        setLoading(true)

        // fetch the order data from the api
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/${order_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${auth.getToken()}`,
                XRequestedWith: 'XMLHttpRequest',
            },
        }).then((response) => {
            console.log(response.status)
            if ([200, 201].includes(response.status)) {
                return response.json()
            } else if (response.status === 401) {
                auth.reset()
                router.replace('/auth/login')
                return null;
            } else if (response.status === 404) {
                alert('Order not found')
                return null;
            } else {
                alert('Something went wrong')
                return null;
            }
        }).then((data) => {
            if (data) {
                console.log(data)
                setOrderData(data.data)
            } else {
                setOrderData(null)
            }

            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })

    }


    useEffect(() => {
        if (!local.order_id) {
            router.replace('/(tabs)')
            return
        }

        // if orderData is null then load the order data


        async function prepare() {
            try {
                // Pre-load fonts, make any API calls you need to do here
                if (!orderData) {
                    loadOrderData()
                }
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Remove this if you copy and paste the code!
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();

    }, [orderData]);


    function refreshPage() {
        setOrderData(null)
    }

    const onLayoutRootView = useCallback(() => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            SplashScreen.hide();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <AuthManager refreshAction={refreshPage}>
            {loading || !orderData ?
                <ActivityIndicator color={'#000'} size={'large'} /> :
                <>
                    <View className="w-full flex flex-row justify-between items-center">

                        <Link href={"/(tabs)"}>
                            {I18nManager.isRTL ?
                                <IconSymbol className="text-green-500" name="arrow-forward" size={24} color="#767577" /> :
                                <IconSymbol className="text-green-500" name="arrow-back" size={24} color="#767577" />}
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
                                {orderData.created_at}
                            </Text>
                        </View>
                        <View className="flex flex-row justify-start items-center gap-4">
                            <Text className="text-slate-700 text-lg">
                                {I18nManager.isRTL ? 'الحالة:' : 'Status'}
                            </Text>
                            <Text className="text-slate-700 text-lg font-semibold">
                                {orderData.status}
                            </Text>
                        </View>
                    </View>

                    <View className="w-full bg-white rounded-md flex flex-row justify-between items-center mt-4 px-2 shadow-md">
                        <Image
                            style={{ objectFit: 'contain' }}
                            source={{ uri: orderData.restaurant_data[0].logo_url }} // Replace with your image URL
                            className="w-14 h-20" />

                        <View className="flex flex-col space-y-1 border border-green-500 rounded-lg p-2">
                            <Text className="text-sm font-semibold text-gray-500 text-xs text-green-500">
                                {orderData.total.toFixed(2)} SAR
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

                    {tab === 0 ? <Details order={orderData} /> : <OrderDetails order={orderData} />}
                </>}
        </AuthManager>
    )
}