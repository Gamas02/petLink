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

export default function RegisterScreen({ navigation }) {
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: usuario.trim(), senha }),
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
                    onChangeText={(text) => { setUsuario(text.trimStart()); setMensagem(""); }}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={(text) => { setSenha(text); setMensagem(""); }}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    secureTextEntry
                    value={confirmarSenha}
                    onChangeText={(text) => { setConfirmarSenha(text); setMensagem(""); }}
                />

                <TouchableOpacity
                    style={[styles.button, (!usuario || !senha || !confirmarSenha) && styles.buttonDisabled]}
                    disabled={!usuario || !senha || !confirmarSenha}
                    onPress={() => { handleRegister(); navigation.navigate('Login'); }}
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
