import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { I18nManager, Image, Platform, Text, View } from 'react-native';
import '@/global.css';
import GuestManager from '@/components/layouts/GuestLayout';
import * as Updates from 'expo-updates';

export default function Index() {
  const [count, setCount] = useState(0);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState('');

  const shouldBeRtl = true;

  useEffect(() => {}, []);

  return (
    <GuestManager>
      <View className='flex flex-col min-h-screen bg-[#fb6f16] w-screen'>
        <Image
          source={require('@/assets/icons/delivery-white.png')}
          alt='Logo'
          className='!w-3/5 !h-[calc(3/5*100vw)] mx-auto mt-20'
          resizeMode='contain'
        />
        <Text
          className='p-0 font-bold text-center text-white'
          style={{ fontSize: 95 }}>
          {I18nManager.isRTL ? 'وصل' : 'Wasl'}
        </Text>
        <Text className='p-2 text-center text-white' style={{ fontSize: 30 }}>
          {I18nManager.isRTL
            ? 'وصل المطاعم بالموصلين عبر تطبيقنا'
            : 'Connection restaurents with delivery partners'}
        </Text>
        <View className='w-full flex flex-col !h-auto items-center justify-center mt-4 px-14'>
          <Link
            className='w-full bg-[#ee530e] py-3 rounded-md text-center mt-4'
            href='/auth/login'>
            <Text className='text-lg text-white'>
              {I18nManager.isRTL ? 'سجل دخولك' : 'Login'}
            </Text>
          </Link>
          <Link
            className='w-full bg-[#ee530e] py-3 rounded-md text-center mt-4'
            href='/auth/register'>
            <Text className='text-lg text-white'>
              {I18nManager.isRTL ? 'أنشئ حسابا' : 'Register'}
            </Text>
          </Link>
          {/* <Link className="w-full bg-[#ee530e] py-3 rounded-md text-center mt-4" href="/(tabs)">
            <Text className="text-lg text-white">
              Tabs
            </Text>
          </Link> */}
        </View>
      </View>
    </GuestManager>
  );
}
