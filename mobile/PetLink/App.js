// App.js
import 'react-native-gesture-handler'; // sempre no topo
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TextInput 
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// HomeScreen
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <View style={{ height: 20 }} />
      <Button title="Registrar-se" onPress={() => navigation.navigate('Registrar-se')} />
    </View>
  );
}

function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      
      {/* Fundo decorativo */}
      <View style={styles.topShape} />
      <View style={styles.bottomShape} />

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>

        <Text style={styles.signup}>Sign Up</Text>
      </View>
    </View>
  );
}

// Registro
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Formas de fundo
  topShape: {
    position: 'absolute',
    top: 0,
    width: '120%',
    height: 200,
    backgroundColor: '#F4A261',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },

  bottomShape: {
    position: 'absolute',
    bottom: 0,
    width: '120%',
    height: 200,
    backgroundColor: '#E9C46A',
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },

  // Card
  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    elevation: 5, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  button: {
    backgroundColor: '#F4A261',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },

  signup: {
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
    color: '#333',
  },
});