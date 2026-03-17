// App.js
import 'react-native-gesture-handler'; // IMPORTANTE: sempre no topo
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// HomeScreen: botões de navegação
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <View style={{ height: 20 }} /> {/* espaço entre os botões */}
      <Button title="Registrar-se" onPress={() => navigation.navigate('Registrar-se')} />
    </View>
  );
}

// Tela de Login
function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Login</Text>
    </View>
  );
}

// Tela de Registro
function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Registro</Text>
    </View>
  );
}

// App principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registrar-se" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});