import {
  View,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Linking } from 'react-native';
import Order from '@/types';
import Auth from '@/services/authservice';

export default function Details({ order, setOrder }: { order: Order, setOrder: any }) {
  const [picking, setPicking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false)
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
    setLoading(true);

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
          setOrder(json_data['order'])
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
        setLoading(false);
      });
  }
  function acceptOrder() {
    // push the order id to confirming queue
    setLoading(true)
    let id: FormData = new FormData();
    id.append('order_id', `${order.id}`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/confirm`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${auth.getToken()}`,
        contentType: 'application/json',
      },
      method: 'POST',
      body: id,
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201 || 400) {
          return res.json();
        } else {
          console.log(res);
          return null;
        }
      })
      .then((json_data) => {
        setLoading(false);
        if (json_data === null) {
        }

        if ('success' in json_data) {
          setOrder(json_data['order'])
        }
      })
      .catch((err) => {
        //remove order_id from confirming queue
        console.log(err)
      }).finally(() => setLoading(false))
  }

  function finishOrder() {
      // add the order to the queue
      setLoading(true)
      let id: FormData = new FormData();
      id.append('order_id', `${order.id}`);
  
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/complete`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${auth.getToken()}`,
          contentType: 'application/json',
        },
        method: 'POST',
        body: id,
      })
        .then((res) => {
          if (res.status === 200 || res.status === 201 || 400) {
            return res.json();
          } else {
            if (res.status === 401) {
              auth.reset();
              router.replace('/auth/login');
            }
            console.log(res);
  
            return null;
          }
        })
        .then((json_data) => {
          setLoading(false);
          if (json_data === null) {
          }
  
          if (typeof json_data == 'object' && 'success' in json_data) {
            setOrder(json_data['order'])
          }
          })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          // remove the order from the queue
          setLoading(false)
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
          {(order.users?.length === 0) && (<TouchableOpacity
            onPress={acceptOrder}
            disabled={loading}
            className='py-2 text-white rounded-md bg-sky-500'>
            {!loading ? (
              <Text className='font-semibold text-center text-white'>
                {I18nManager.isRTL ? 'قبول' : 'Accept'}
              </Text>
            ) : (
              <ActivityIndicator size={'small'} color={'white'} />
            )}
          </TouchableOpacity>)}

          {( order.users && order.users?.length > 0) && (order.users[0].pivot?.status == 'accepted') && (<TouchableOpacity
            onPress={pickup}
            disabled={loading}
            className='py-2 text-white rounded-md bg-sky-500'>
            {!loading ? (
              <Text className='font-semibold text-center text-white'>
                {I18nManager.isRTL ? 'إستلام' : 'Pick up'}
              </Text>
            ) : (
              <ActivityIndicator size={'small'} color={'white'} />
            )}
          </TouchableOpacity>)}

          {( order.users && order.users?.length > 0) && (order.users[0].pivot?.status == 'picked') && (<TouchableOpacity
            onPress={finishOrder}
            disabled={loading}
            className='py-2 text-white rounded-md bg-sky-500'>
            {!loading ? (
              <Text className='font-semibold text-center text-white'>
                {I18nManager.isRTL ? 'إنهاء' : 'complete'}
              </Text>
            ) : (
              <ActivityIndicator size={'small'} color={'white'} />
            )}
          </TouchableOpacity>)}

          {( order.users && order.users?.length > 0) && (order.users[0].pivot?.status == 'completed') && (
            <Text className='font-semibold text-green-600 text-center'>
            {I18nManager.isRTL ? 'تم الانتهاء': 'completed'}
          </Text>)}

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
