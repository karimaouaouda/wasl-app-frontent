import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link } from 'expo-router';
import AuthManager from '@/components/layouts/AuthLayout';
import { useAuth } from '@/hooks/auth';
import Auth from '@/services/authservice'; 

 
export default function ProfileTab() {

  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const auth = new Auth(); // إنشاء نسخة من الكلاس Auth

      // you forget to ask the server to unvaliadte the token

      fetch(`${process.env.EXPO_PUBLIC_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${auth.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Logout response:', data);
        })
        .catch((error) => {
          console.error('Error during logout request:', error);
        });
      await auth.reset();      // مسح التوكن واليوزر آيدي
      console.log('User data fully removed 🌟');

      router.push('/auth/login'); // روح بعدها على صفحة تسجيل الدخول
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // retrieve the query param : order_id
  return (
    <AuthManager refreshAction={() => null}>
      {/* the top view (back/page name) */}
      <View className='flex flex-row items-center justify-between w-full'>
        <Link href={'/(tabs)'}>
          <IconSymbol
            className='text-green-500'
            name='arrow-forward'
            size={24}
            color='#767577'
          />
        </Link>
        <Text className='text-lg font-bold text-center'>{user?.username??user?.name}</Text>
        <Text className='text-sm text-green-500'>v1.0.0</Text>
      </View>
      {/* profile banner */}
      <View className='relative flex flex-row items-center justify-between w-full p-4 mt-10 bg-white rounded-lg shadow-md'>
        <View className='flex flex-row items-center gap-4 w-fit'>
          <View className='items-center justify-center w-24 h-24 overflow-hidden border-2 rounded-full shadow shadow-md bg-slate-300 border-sky-700'>
            <Image
              source={require('@/assets/images/custom/profile.jpeg')}
              className='w-full h-full'
            />
          </View>
          <View className='flex flex-col items-start'>
            <Text
              className='text-lg font-bold text-center'
              style={{ fontSize: 20 }}>
              {user?.name ?? 'Guest'}
            </Text>
            <Text className='text-xs font-bold text-center text-gray-400'>
              {user?.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <IconSymbol name='edit' size={20} color='#767577' />
        </TouchableOpacity>
      </View>

      {/* horizental slide with cards items */}
      <View className='flex flex-col gap-1 p-4 mt-4 bg-white rounded-md settings-list'>
        <Text className='mb-2 text-lg font-semibold text-slate-800'>
          Settings
        </Text>
        <TouchableOpacity
          touchSoundDisabled={false}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='manage-accounts' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
              Account Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          touchSoundDisabled={false}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='security' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
              Security Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          touchSoundDisabled={false}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='lock' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
              Privacy Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          touchSoundDisabled={false}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='language' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
              Language Settings
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          touchSoundDisabled={false}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='history' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
              Order History
            </Text>
          </View>
        </TouchableOpacity>
        {/* زر تسجيل الخروج */}
        <TouchableOpacity
          touchSoundDisabled={false}
          onPress={handleLogout}
          className='flex flex-row items-center justify-between w-full p-2 rounded-md'>
          <View className='flex flex-row gap-2 w-fit'>
            <IconSymbol name='logout' size={26} color='#767577' />
            <Text className='text-lg font-semibold text-slate-800'>
            Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>

       
      
    </AuthManager>
  );
}
