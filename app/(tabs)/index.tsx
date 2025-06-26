import {
  Switch,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput,} from 'react-native';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link, router } from 'expo-router';
import AuthManager from '@/components/layouts/AuthLayout';
import Order from '@/types';
import Auth from '@/services/authservice';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ActiveTab() {
  // initilize states
  const [isEnabled, setIsEnabled] = useState(false);
  const [data, setData] = useState<Array<Order>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmingQueue, setConfirmingQueue] = useState<
    Array<string | number>
  >([]);
  const [rejectingQueue, setRejectingQueue] = useState<Array<string | number>>(
    []
  );
  const [isConnected, setIsConnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [orderIdToReject, setOrderIdToReject] = useState<number | string>(-1);

  I18nManager.forceRTL(false);

  const pusher = (window.Pusher = Pusher);

  const echo = (window.Echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.EXPO_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.EXPO_PUBLIC_WS_HOST,
    wsPort: process.env.EXPO_PUBLIC_WS_PORT,
    wssPort: 443,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
  }));

  const toggleSwitch = () => {
    setData([]);
    setIsEnabled((previousState) => !previousState);
  };

  const auth = new Auth();
  const shouldBeRTL = true;

  function loadOrders() {
    console.log('loading orders');
    setLoading(true);
    // fetch orders from the server
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/active`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${auth.getToken()}`,
      },
      method: 'GET',
    })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return res.json();
        } else if (res.status === 404) {
          console.log(res);
          return { data: [] };
        } else {
          console.log(res);
          return null;
        }
      })
      .then((json_data) => {
        setLoading(false);
        if (json_data === null || !('data' in json_data)) {
          setData([]);
        } else if (json_data.data.length === 0) {
          setData([]);
        } else {
          setData(json_data.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }
  
  useEffect(() => {
    if (data.length === 0) {
      loadOrders();
    }

    if (!isConnected) {
      echo
        .channel('order.created')
        .listen('OrderCreated', (e: any) => {
          refreshData();
          console.log('order created');
        })
        .error((error: any) => {
          console.error('Error:', error);
        });

      echo
        .channel('order.accepted')
        .listen('OrderAccepted', (e: any) => {
          refreshData();
          console.log('order accepted');
        })
        .error((error: any) => {
          console.error('Error:', error);
        });

      setIsConnected(true);
    }
  }, [isEnabled]); // add isEnabled to the dependency array to refetch data when it changes

  // get current language

  function refreshData() {
    console.log('refershing...');
    setConfirmingQueue([]);
    setRejectingQueue([]);
    loadOrders();
  }

  function acceptOrder(order_id: number | string) {
    // push the order id to confirming queue
    setConfirmingQueue([...confirmingQueue, order_id]);

    let id: FormData = new FormData();
    id.append('order_id', `${order_id}`);
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
          loadOrders();
        }

        //remove order_id from confirming queue
        if (confirmingQueue !== null) {
          setConfirmingQueue(
            confirmingQueue.filter((item) => item !== order_id)
          );
        }
        refreshData();
      })
      .catch((err) => {
        setLoading(false);
        console.error(err, confirmingQueue, rejectingQueue);
        //remove order_id from confirming queue
        if (confirmingQueue !== null) {
          setConfirmingQueue(
            confirmingQueue.filter((item) => item !== order_id)
          );
        }
      });
  }

  function rejectOrder() {
    // push the order id to confirming queue
    setRejectingQueue([...rejectingQueue, orderIdToReject]);
    console.log('rejecting order : ' + orderIdToReject);
    let payload: FormData = new FormData();
    payload.append('order_id', `${orderIdToReject}`);
    payload.append('reason', rejectReason);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/orders/reject`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: `Bearer ${auth.getToken()}`,
        contentType: 'application/json',
      },
      method: 'POST',
      body: payload,
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
        console.log(json_data);
        refreshData();
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setRejectingQueue(
          rejectingQueue.filter((item) => item !== orderIdToReject)
        );
        setOrderIdToReject(-1);
        setModalVisible(false);
      });
  }

  return (
    <AuthManager refreshAction={refreshData}>
      <View className='flex flex-row justify-between toggle-button-wrapper'>
        <View className='flex flex-row items-center space-x-2'>
          <Switch
            trackColor={{ false: '#767577', true: '#03fc41' }}
            thumbColor={isEnabled ? '#03fc41' : '#f4f3f4'}
            ios_backgroundColor='#3e3e3e'
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text
            className={
              'text-sm font-semibold ' +
              (isEnabled ? 'text-green-500' : 'text-slate-800')
            }>
            {I18nManager.isRTL ? 'متاح' : 'Active'}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity onPress={refreshData}>
            <IconSymbol
              className='text-green-500'
              name='cached'
              size={24}
              color='#767577'
            />
          </TouchableOpacity>
        )}
      </View>

      <View className='flex flex-col gap-2 mt-4 mb-10'>
        {data.length > 0 &&
          data.map((item, index) => (
            <Link
              key={Math.ceil(Math.random() * 1000)}
              href={'/order/OrderView?order_id=' + item.id}
              className='block w-full'>
              <View className='w-full p-4 bg-white rounded-lg shadow-md'>
                <View className='flex flex-row items-center justify-between'>
                  <Text className='p-2 text-sm text-green-500 border rounded-lg'>
                    {/*I18nManager.isRTL ? 'جاري التحضير' : 'Preparing'*/}
                    {item.status}
                  </Text>
                  <Text className='text-sm font-semibold text-gray-500'>
                    {I18nManager.isRTL
                      ? 'منذ يومين'
                      : dayjs(item.created_at).fromNow()}
                  </Text>
                </View>
                <View className='flex flex-row items-center justify-between mt-2'>
                  <Text className='text-lg font-semibold'>#{item.id}</Text>
                  <View className='flex flex-col space-y-1'>
                    <Text className='text-xs text-sm font-semibold text-gray-500 text-green-500'>
                      {item.total.toFixed(2)} SAR
                    </Text>
                    <Text className='text-xs text-sm font-semibold text-gray-500 text-green-500'>
                      {I18nManager.isRTL ? 'دفع إلكتروني' : 'Online Payment'}
                    </Text>
                  </View>
                </View>
                <View className='flex flex-row items-center justify-start mt-2 space-x-2'>
                  <Image
                    style={{ objectFit: 'contain' }}
                    source={{ uri: item.restaurant_data[0].logo_url }} // Replace with your image URL
                    className='h-20 w-14'
                  />
                  <View className='flex flex-col items-start justify-around'>
                    <Text className='ml-2 text-sm font-semibold text-gray-500'>
                      {item.restaurant_data[0].name}
                    </Text>
                    <Text className='ml-2 text-sm font-semibold text-gray-500'>
                      {I18nManager.isRTL
                        ? 'الإستلام: فرع القيروان'
                        : `Pickup: ${item.restaurant_data[0].name}`}
                    </Text>
                    <Text className='ml-2 text-sm font-semibold text-gray-500'>
                      {I18nManager.isRTL
                        ? 'وقت التوصيل: 05/04/2025 - 14:05'
                        : `Delivery Time: ${new Date(
                            item.created_at
                          ).toLocaleTimeString(['en-us'], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}
                    </Text>
                  </View>
                </View>
                <View className='flex flex-row items-center gap-4 mt-4 buttons'>
                  <TouchableOpacity
                    disabled={confirmingQueue?.includes(item.id)}
                    onPress={() => acceptOrder(item.id)}
                    className='flex-1 p-2 bg-green-500 rounded-lg'>
                    {confirmingQueue?.includes(item.id) ? (
                      <ActivityIndicator color='white' size={20} />
                    ) : (
                      <Text className='font-semibold text-center text-white'>
                        {I18nManager.isRTL ? 'تأكيد' : 'Confirm'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={rejectingQueue?.includes(item.id)}
                    onPress={() => {
                      setOrderIdToReject(item.id);
                      setModalVisible(true);
                    }}
                    className='flex-1 p-2 bg-red-500 rounded-lg'>
                    {rejectingQueue?.includes(item.id) ? (
                      <ActivityIndicator color='white' size={20} />
                    ) : (
                      <Text className='font-semibold text-center text-white'>
                        {I18nManager.isRTL ? 'رفض' : 'reject'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Link>
          ))}

        {data.length == 0 &&
          (loading ? (
            <ActivityIndicator color='green' size={'large'} />
          ) : (
            <Text className='py-4 font-semibold text-center text-red-500'>
              {I18nManager.isRTL ? 'لا توجد طلبات الان' : 'No Orders Yet'}
            </Text>
          ))}
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View className='items-center justify-center flex-1 bg-gray-900/75'>
          <View className='w-4/5 p-4 bg-white rounded-lg shadow-lg'>
            <Text className='mb-4 text-lg font-bold text-center'>
              {I18nManager.isRTL
                ? 'يرجى إخبارنا عن سبب الرفض'
                : 'Please tell us why you reject'}
            </Text>
            <Text className='w-full p-2 mb-2 text-sm italic font-semibold text-white bg-red-500/50'>
              {I18nManager.isRTL
                ? 'لا يمكنك رفض أكثر من 10 توصيلات في الأسبوع وإن فعلت ذلك ستتعرض لعقوبة من التطبيق'
                : "You can't reject more than 10 deliveries in a week and if you do, you will be penalized by the app"}
            </Text>
            <TextInput
              className='p-2 mb-4 border border-gray-300 rounded-lg'
              placeholder={
                I18nManager.isRTL ? 'سبب الرفض' : 'Reason for rejection'
              }
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline={true}
              numberOfLines={4}
              textAlignVertical='top'
              style={{ maxHeight: 100 }} // Limit the height of the TextInput
            />
            <View className='flex flex-row items-center gap-2'>
              <Pressable
                disabled={rejectingQueue.includes(orderIdToReject)}
                className='flex-1 p-2 bg-blue-500 rounded-lg'
                onPress={() => rejectOrder()}>
                {rejectingQueue.includes(orderIdToReject) ? (
                  <ActivityIndicator size={'large'} color={'white'} />
                ) : (
                  <Text className='font-semibold text-center text-white'>
                    submit & reject
                  </Text>
                )}
              </Pressable>
              <Pressable
                className='flex-1 p-2 bg-red-500 rounded-lg'
                onPress={() => {
                  orderIdToReject != -1 || setModalVisible(!modalVisible);
                }}>
                <Text className='font-semibold text-center text-white'>
                  cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AuthManager>
  );
}
