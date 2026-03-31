import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

/* ───────────── WAVES ───────────── */
function TopWave() {
  return (
    <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveTop}>
      <Path
        d={`M0,0 L${width},0 L${width},140 C${width * 0.75},220 ${width * 0.25},220 0,140 Z`}
        fill="#F4A261"
      />
    </Svg>
  );
}

function BottomWave() {
  return (
    <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveBottom}>
      <Path
        d={`M0,220 L${width},220 L${width},80 C${width * 0.75},0 ${width * 0.25},0 0,80 Z`}
        fill="#E9C46A"
      />
    </Svg>
  );
}

/* ───────────── HOME ───────────── */
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F4A261" />
      <TopWave />
      <BottomWave />

      <View style={styles.content}>
        <Text style={{ fontSize: 52 }}>🐾</Text>
        <Text style={styles.appName}>PET LINK</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Registrar-se')}>
            <Text style={styles.secondaryButtonText}>Registrar-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ───────────── LOGIN ───────────── */
function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async () => {
    if (!usuario.trim() || !senha) {
      setMensagem("Preencha todos os campos ⚠️");
      return;
    }

    try {
      setMensagem("Entrando...");

      const response = await fetch("http://SEU_BACKEND/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Login realizado com sucesso ✅");
      } else {
        setMensagem(data.message || "Erro no login ❌");
      }

    } catch (error) {
      setMensagem("Erro de conexão 🌐");
    }
  };

  return (
    <View style={styles.container}>
      <TopWave />
      <BottomWave />

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={(text) => {
            setUsuario(text.trimStart());
            setMensagem("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setMensagem("");
          }}
        />

        <TouchableOpacity
          style={[styles.button, (!usuario || !senha) && styles.buttonDisabled]}
          disabled={!usuario || !senha}
          onPress={() =>{
            handleLogin();
            navigation.navigate('App')
          }}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={[styles.msg, mensagem.includes("sucesso") ? styles.success : styles.error]}>
          {mensagem}
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Registrar-se')}>
          <Text style={styles.signup}>Não tem conta? Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ───────────── REGISTER ───────────── */
function RegisterScreen({navigation}) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleRegister = async () => {
    if (!usuario.trim() || !senha || !confirmarSenha) {
      setMensagem("Preencha todos os campos ⚠️");
      return;
    }

    if (senha.length < 6) {
      setMensagem("Senha deve ter no mínimo 6 caracteres 🔒");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem ❌");
      return;
    }

    try {
      setMensagem("Enviando...");

      const response = await fetch("http://SEU_BACKEND/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          senha: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Cadastro realizado com sucesso ✅");
      } else {
        setMensagem(data.message || "Erro ao cadastrar ❌");
      }

    } catch (error) {
      setMensagem("Erro de conexão com servidor 🌐");
    }
  };

  return (
    <View style={styles.container}>
      <TopWave />
      <BottomWave />

      <View style={styles.card}>
        <Text style={styles.title}>Registrar-se</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={(text) => {
            setUsuario(text.trimStart());
            setMensagem("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setMensagem("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={(text) => {
            setConfirmarSenha(text);
            setMensagem("");
          }}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!usuario || !senha || !confirmarSenha) && styles.buttonDisabled
          ]}
          disabled={!usuario || !senha || !confirmarSenha}
          onPress={() =>{
            handleRegister();
            navigation.navigate('Login');
          }} 
          
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <Text style={[
          styles.msg,
          mensagem.includes("sucesso") || mensagem.includes("confirmada")
            ? styles.success
            : styles.error
        ]}>
          {mensagem}
        </Text>
      </View>
    </View>
  );
}

function AppScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F4A261" />

      <TopWave />
      <BottomWave />

      <View style={styles.content}>
        <View style={styles.buttonGroup}>
          <Text>PetZoo</Text>
        </View>
      </View>
    </View>
  );
}

/* ───────────── APP ───────────── */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registrar-se" component={RegisterScreen} />
        <Stack.Screen name="App" component={AppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ───────────── STYLES ───────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  waveTop: { position: 'absolute', top: 0, left: 0 },
  waveBottom: { position: 'absolute', bottom: 0, left: 0 },

  content: { alignItems: 'center', zIndex: 1 },

  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F4A261',
    marginBottom: 40,
  },

  buttonGroup: { width: 240, gap: 14 },

  primaryButton: {
    backgroundColor: '#F4A261',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },

  secondaryButton: {
    borderWidth: 2,
    borderColor: '#F4A261',
    padding: 13,
    borderRadius: 30,
    alignItems: 'center',
  },

  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButtonText: { color: '#F4A261', fontWeight: '700' },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 16,
    elevation: 6,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    borderBottomWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 22,
    padding: 8,
  },

  button: {
    backgroundColor: '#F4A261',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  signup: {
    textAlign: 'center',
    marginTop: 16,
    color: '#F4A261',
  },

  msg: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },

  success: { color: 'green' },
  error: { color: 'red' },
});