import { Tabs } from 'expo-router';
import React from 'react';
import { I18nManager, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/components/constants/Colors';
import { useColorScheme } from '@/components/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: '#687076',
          title: I18nManager.isRTL ? 'نشط' : 'Active',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"home"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: '#687076',
          title: I18nManager.isRTL ? 'اليوم': 'Today',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="delivery-dining" color={color} />,
        }}
      />
      <Tabs.Screen
        name="finished"
        options={{
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: '#687076',
          title: I18nManager.isRTL ? 'منتهية' : 'Finished',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarActiveTintColor: 'dodgerblue',
          tabBarInactiveTintColor: '#687076',
          title: I18nManager.isRTL ? 'حسابي' : 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="account-circle" color={color} />,
        }}
      />
    </Tabs>
    
  );
}
