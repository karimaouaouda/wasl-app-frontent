import {
  ScrollView,
  View,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Linking } from 'react-native';
import '@/global.css';
import Order from '@/types';
import Auth from '@/services/authservice';
import OrderDetails from './OrderDetails';

export default function Details({ order }: { order: Order }) {
  const [tab, setTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [picking, setPicking] = useState<boolean>(false);
  const tabs = [
    { id: 0, name: I18nManager.isRTL ? 'التفاصيل' : 'Details' },
    { id: 1, name: I18nManager.isRTL ? 'تفاصيل الطلب' : 'Order Details' },
  ];

  const auth = new Auth();
  const router = useRouter();

  function makePhoneCall(phone: string | number) {
    Linking.openURL(`tel:${phone}`);
  }

  function makeWhatsCall(phone: string | number) {
    Linking.openURL(`whatsapp://send?&phone=${phone}`);
  }

  function pickup() {
    var order_id = order.id;
    setPicking(true);

    let payload = new FormData();
    payload.append('order_id', `${order_id}`);

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/pickup`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        contentType: 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${auth.getToken()}`,
      },
      method: 'POST',
      body: payload,
    })
      .then(function (response) {
        if ([200, 201, 400, 404].includes(response.status)) {
          return response.json();
        }

        if (response.status === 401) {
          auth.reset();
          router.replace('/auth/login');
          return null;
        }

        alert(
          "some thing happen i don't know what with status : " + response.status
        );
        return null;
      })
      .then((json_data) => {
        if (json_data && 'success' in json_data) {
          alert(json_data['success']);
        }

        if (json_data && 'message' in json_data) {
          Alert.alert(
            'Bad Action',
            json_data.message,
            [
              {
                text: 'OK',
              },
            ],
            {
              userInterfaceStyle: 'dark',
            }
          );
        }
      })
      .catch(function (err) {
        console.error(err);
      })
      .finally(() => {
        setPicking(false);
      });
  }

  // retrive the query param : order_id
  const local = useLocalSearchParams();
  return (
    <>
      <View className='flex flex-col items-center justify-between w-full p-4 mt-4 bg-white rounded-md shadow-md'>
        <View className='w-full'>
          <Text className='text-lg font-semibold text-gray-800'>
            {I18nManager.isRTL ? 'مكان الإستلام' : 'Pickup Location'}
          </Text>
        </View>
        <View className='flex flex-row items-center justify-between w-full mt-2'>
          <View className='flex flex-row items-center justify-start mt-2'>
            <Image
              style={{ objectFit: 'contain' }}
              source={{ uri: order.restaurant_data[0].logo_url }} // Replace with your image URL
              className='h-20 w-14'
            />
            <View className='flex flex-col items-start justify-around'>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {order.restaurant_data[0].name}
              </Text>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {I18nManager.isRTL
                  ? 'الإستلام: فرع القيروان'
                  : `Pickup: ${order.restaurant_data[0].name}`}
              </Text>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {I18nManager.isRTL
                  ? `وقت التوصيل: ${new Date(order.updated_at).toLocaleTimeString(['ar-sa'], { hour: '2-digit', minute: '2-digit' })}`
                  : `Delivery Time: ${new Date(order.updated_at).toLocaleTimeString(['en-us'], { hour: '2-digit', minute: '2-digit' })}`}
              </Text>
            </View>
          </View>
          <View className='flex flex-col gap-2'>
            <TouchableOpacity
              onPress={() => makePhoneCall(order.restaurant_data[0].phone)}
              className='p-2 bg-green-600 rounded-lg'>
              <IconSymbol name='phone' size={24} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity className='p-2 bg-red-600 rounded-lg'>
              <IconSymbol name='room' size={24} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
        <View className='w-full mt-2'>
          <TouchableOpacity
            onPress={pickup}
            disabled={picking}
            className='py-2 text-white rounded-md bg-sky-500'>
            {!picking ? (
              <Text className='font-semibold text-center text-white'>
                {I18nManager.isRTL ? 'إستلام' : 'Pickup'}
              </Text>
            ) : (
              <ActivityIndicator size={'small'} color={'white'} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className='flex flex-col items-center justify-between w-full p-4 mt-4 bg-white rounded-md shadow-md'>
        <View className='w-full'>
          <Text className='text-lg font-semibold text-gray-800'>
            {I18nManager.isRTL
              ? 'مكان التوصيل - العميل'
              : 'Delivery Location - Client'}
          </Text>
        </View>
        <View className='flex flex-row items-center justify-between w-full mt-2'>
          <View className='flex flex-row items-center justify-start mt-2'>
            <View className='flex flex-col items-start justify-around'>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {order.client_data[0].name}
              </Text>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {I18nManager.isRTL
                  ? 'العنوان: الوصف المعنا '
                  : `Address: ${order.restaurant_data[0].description}`}
              </Text>
              <Text className='ml-2 text-sm font-semibold text-gray-500'>
                {I18nManager.isRTL
                   ? `وقت التوصيل: ${new Date(order.updated_at).toLocaleTimeString(['ar-sa'], { hour: '2-digit', minute: '2-digit' })}`
                   : `Delivery Time: ${new Date(order.updated_at).toLocaleTimeString(['en-us'], { hour: '2-digit', minute: '2-digit' })}`}
              </Text>
            </View>
          </View>
          <View className='flex flex-col gap-2'>
            <TouchableOpacity
              onPress={() => makePhoneCall(order.client_data[0].phone)}
              className='p-2 bg-green-600 rounded-lg'>
              <IconSymbol name='phone' size={24} color='#fff' />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => makeWhatsCall(order.restaurant_data[0].phone)}
              className='p-2 rounded-lg bg-sky-500'>
              <FontAwesome name='whatsapp' size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity className='p-2 bg-red-600 rounded-lg'>
              <IconSymbol name='room' size={24} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
