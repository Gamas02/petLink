import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppScreen from './screens/AppScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DenunciaChat from './screens/DenunciaChat';
import DoacaoScreen from './screens/DoacaoScreen';
import AdmScreen from './screens/AdmScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Doacao" component={DoacaoScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registrar-se" component={RegisterScreen} />
        <Stack.Screen name="App" component={AppScreen} />
        <Stack.Screen name="Denuncia" component={DenunciaChat} />
        <Stack.Screen name="Adm" component={AdmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}