import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
 
import AppScreen from '../screens/AppScreen';
import DenunciaChat from '../screens/DenunciaChat';
 
const Tab = createBottomTabNavigator();
 
export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="AppScreen"
        component={AppScreen}
        options={{
          title: 'Início',
          tabBarIcon: () => <Text>🐾</Text>,
        }}
      />
      <Tab.Screen
        name="DenunciaChat"
        component={DenunciaChat}
        options={{
          title: 'Denúncia',
          tabBarIcon: () => <Text>🚨</Text>,
        }}
      />
    </Tab.Navigator>
  );
}