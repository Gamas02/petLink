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
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';


import { loginStyles as styles } from '../style/styles';
import { TopWave, BottomWave } from '../components/waves';

export default function LoginScreen({ navigation }) {
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: usuario.trim(), senha }),
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
                    onChangeText={(text) => { setUsuario(text.trimStart()); setMensagem(""); }}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={(text) => { setSenha(text); setMensagem(""); }}
                />

                <TouchableOpacity
                    style={[styles.button, (!usuario || !senha) && styles.buttonDisabled]}
                    disabled={!usuario || !senha}
                    onPress={() => { handleLogin(); navigation.navigate('App'); }}
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