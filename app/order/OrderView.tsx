import {
  View,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState, useCallback } from 'react';
import { Linking } from 'react-native';
import Details from '@/components/partials/order/Details';
import OrderDetails from '@/components/partials/order/OrderDetails';
import AuthManager from '@/components/layouts/AuthLayout';
import * as SplashScreen from 'expo-splash-screen';
import Order, { OrderData } from '@/types';
import Auth from '@/services/authservice';

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
    { id: 0, name: I18nManager.isRTL ? 'التفاصيل' : 'Details' },
    { id: 1, name: I18nManager.isRTL ? 'تفاصيل الطلب' : 'Order Details' },
  ];

  const auth = new Auth();
  const router = useRouter();

  function makePhoneCall() {
    Linking.openURL(`tel: ${orderData?.restaurant_data[0].phone}`);
  }

  function makeWhatsCall() {
    Linking.openURL(
      `whatsapp://send?phone=${orderData?.restaurant_data[0].phone}`
    );
  }

  // retrive the query param : order_id
  const local = useLocalSearchParams();

  function loadOrderData() {
    let order_id = local.order_id;
    // set loading to true
    setLoading(true);
    console.log(
      'geting : ' + `${process.env.EXPO_PUBLIC_API_URL}/orders/${order_id}`
    );

    // fetch the order data from the api
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${auth.getToken()}`,
        XRequestedWith: 'XMLHttpRequest',
      },
    })
      .then((response) => {
        console.log(response.status);
        if ([200, 201].includes(response.status)) {
          return response.json();
        } else if (response.status === 401) {
          auth.reset();
          router.replace('/auth/login');
          return null;
        } else if (response.status === 404) {
          alert('Order not found');
          return null;
        } else {
          alert('Something went wrong');
          return null;
        }
      })
      .then((data) => {
        if (data) {
          console.log(data);
          setOrderData(data.data);
        } else {
          setOrderData(null);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!local.order_id) {
      router.replace('/(tabs)');
      return;
    }

    // if orderData is null then load the order data

    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        if (!orderData) {
          loadOrderData();
        }
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
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
    setOrderData(null);
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
      {loading || !orderData ? (
        <ActivityIndicator color={'#000'} size={'large'} />
      ) : (
        <>
          <View className='flex flex-row items-center justify-between w-full'>
            <Link href={'/(tabs)'}>
              {I18nManager.isRTL ? (
                <IconSymbol
                  className='text-green-500'
                  name='arrow-forward'
                  size={24}
                  color='#767577'
                />
              ) : (
                <IconSymbol
                  className='text-green-500'
                  name='arrow-back'
                  size={24}
                  color='#767577'
                />
              )}
            </Link>
            <Text className='text-lg font-bold text-center'>
              {local.order_id ? `Order ID: ${local.order_id}` : 'Order ID'}
            </Text>
            <Text className='text-sm text-green-500'>v1.0.0</Text>
          </View>
          <View className='flex flex-col mt-10 space-y-2'>
            <View className='flex flex-row items-center justify-start gap-4'>
              <Text className='text-lg text-slate-700'>
                {I18nManager.isRTL ? 'رقم الطلب:' : 'Order ID'}
              </Text>
              <Text className='text-lg font-semibold text-slate-700'>
                {local.order_id ? `#${local.order_id}` : '#0000'}
              </Text>
            </View>
            <View className='flex flex-row items-center justify-start gap-4'>
              <Text className='text-lg text-slate-700'>
                {I18nManager.isRTL ? 'وقت الإنشاء:' : 'Creation Time'}
              </Text>
              <Text className='text-lg font-semibold text-slate-700'>
                {new Date(orderData.created_at).toLocaleString('en-US')}
              </Text>
            </View>
            <View className='flex flex-row items-center justify-start gap-4'>
              <Text className='text-lg text-slate-700'>
                {I18nManager.isRTL ? 'الحالة:' : 'Status'}
              </Text>
              <Text className='text-lg font-semibold text-slate-700'>
                {orderData.status}
              </Text>
            </View>
          </View>

          <View className='flex flex-row items-center justify-between w-full px-2 mt-4 bg-white rounded-md shadow-md'>
            <Image
              style={{ objectFit: 'contain' }}
              source={{ uri: orderData.restaurant_data[0].logo_url }} // Replace with your image URL
              className='h-20 w-14'
            />

            <View className='flex flex-col p-2 space-y-1 border border-green-500 rounded-lg'>
              <Text className='text-xs text-sm font-semibold text-gray-500 text-green-500'>
                {orderData.total.toFixed(2)} SAR
              </Text>
              <Text className='text-xs text-sm font-semibold text-gray-500 text-green-500'>
                {I18nManager.isRTL ? 'دفع إلكتروني' : 'E-Payment'}
              </Text>
            </View>
          </View>

          <View className='flex flex-row items-center justify-between w-full px-2 mt-4 bg-white rounded-md shadow-md tabs'>
            <TouchableOpacity
              className={
                'flex-1 p-2 ' + (tab === 0 ? 'border-b-2 border-green-500' : '')
              }
              onPress={() => setTab(0)}>
              <Text className='font-semibold text-center text-green-500'>
                {I18nManager.isRTL ? 'التفاصيل' : 'Details'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={
                'flex-1 p-2 ' + (tab === 1 ? 'border-b-2 border-green-500' : '')
              }
              onPress={() => setTab(1)}>
              <Text className='font-semibold text-center text-gray-500'>
                {I18nManager.isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </Text>
            </TouchableOpacity>
          </View>

          {tab === 0 ? (
            <Details order={orderData} setOrder={setOrderData} />
          ) : (
            <OrderDetails order={orderData} />
          )}
        </>
      )}
    </AuthManager>
  );
}
