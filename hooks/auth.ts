import { useState, useEffect } from 'react';
import { getItemAsync } from 'expo-secure-store'; // لجلب البيانات المخزنة

export function useAuth() {
  const [user, setUser] = useState<any>(null); // لتخزين بيانات المستخدم

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // جلب بيانات المستخدم من SecureStore
        const userData = await getItemAsync('user');
        if (userData) {
          setUser(JSON.parse(userData));  // إذا كانت البيانات موجودة، حولها إلى كائن واستخدمها
        }
      } catch (error) {
        console.error('Error loading user', error);  // في حالة الخطأ عند التحميل
      }
    };

    fetchUser(); // دالة التحميل تعمل عند تحميل الـ component
  }, []); // [] تعني أن الكود يعمل فقط عند بداية الـ component

  return { user }; // إرجاع بيانات المستخدم بحيث يمكن استخدامها في أي مكان
}
