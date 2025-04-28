import {
  ScrollView,
  View,
  Text,
  I18nManager,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Linking } from 'react-native';
import '@/global.css';
import Order from '@/types';

export default function OrderDetails({ order }: { order: Order }) {
  const [tab, setTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const tabs = [
    { id: 0, name: I18nManager.isRTL ? 'التفاصيل' : 'Details' },
    { id: 1, name: I18nManager.isRTL ? 'تفاصيل الطلب' : 'Order Details' },
  ];

  console.log('there is : ' + order.items.length);

  // retrive the query param : order_id
  const local = useLocalSearchParams();
  return (
    <View className='flex flex-col w-full p-4 mt-4 bg-white rounded-md shadow-md'>
      <Text className='pb-2 font-semibold text-gray-400 border-b border-gray-200 text-md'>
        {I18nManager.isRTL ? 'تفاصيل الطلب' : 'Order Details'}
      </Text>
      <View className='flex flex-row items-center justify-between w-full px-2 py-2 border-b border-gray-200'>
        <View className='flex flex-row items-center justify-start gap-4'>
          <Text className='w-10 text-sm text-slate-700'>
            {I18nManager.isRTL ? 'العدد' : 'Quantity'}
          </Text>
          <Text className='ml-10 text-sm text-slate-700'>
            {I18nManager.isRTL ? 'الصنف' : 'Item'}
          </Text>
        </View>

        <Text className='text-sm text-slate-700'>
          {I18nManager.isRTL ? 'السعر' : 'Price'}
        </Text>
      </View>

      <View className='flex flex-col items-center w-full px-2 py-2'>
        {order.items && order.items.length > 0 ? (
          order.items.map(function (item) {
            return (
              <View
                key={Math.ceil(Math.random() * 1000)}
                className='flex flex-row items-center justify-between w-full'>
                <View className='flex flex-row items-center justify-start gap-4'>
                  <Text className='w-10 text-sm text-slate-700'>
                    x{item.quantity}
                  </Text>
                  <Text className='text-sm text-slate-700 '>
                    {item.item_name}
                  </Text>
                </View>

                <Text className='text-sm text-slate-700'>
                  {item.price.toFixed(2)} SAR
                </Text>
              </View>
            );
          })
        ) : (
          <Text className='py-2 font-semibold text-center text-slate-500'>
            no item found
          </Text>
        )}
      </View>

      <View className='flex flex-col w-full gap-2 pb-2 mt-2 border-t border-b border-gray-200'>
        <View className='flex flex-row items-center justify-between w-full'>
          <Text>{I18nManager.isRTL ? 'المجموع:' : 'Total'}</Text>
          <Text className='text-sm font-semibold text-slate-700'>
            {order.total.toFixed(2)} SAR
          </Text>
        </View>
        <View className='flex flex-row items-center justify-between w-full'>
          <Text>{I18nManager.isRTL ? 'رسوم التوصيل:' : 'Delivery Fees:'}</Text>
          <Text className='text-sm font-semibold text-slate-700'>
            50.00 SAR
          </Text>
        </View>
        <View className='flex flex-row items-center justify-between w-full'>
          <Text>{I18nManager.isRTL ? 'ضريبة القيمة المضافة:' : 'VAT:'}</Text>
          <Text className='text-sm font-semibold text-slate-700'>
            {(order.total + 50) * 0.15} SAR
          </Text>
        </View>
      </View>

      <View className='flex flex-row items-center justify-between w-full pt-2'>
        <Text>{I18nManager.isRTL ? 'الإجمالي:' : 'Total:'}</Text>
        <Text className='text-sm font-semibold text-slate-700'>
          {Number(order.total + 50 + (order.total + 50) * 0.15).toFixed(2)} SAR
        </Text>
      </View>
    </View>
  );
}
