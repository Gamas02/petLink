import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import { loginStyles as styles } from '../style/styles';
import { TopWave, BottomWave } from '../components/waves';

export default function LoginScreen({ navigation }) {

    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleLogin = async () => {
        if (!usuario.trim() || !senha) {
            setMensagem("Preencha todos os campos ⚠️");
            return;
        }

        setCarregando(true);
        setMensagem('');

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario: usuario.trim(), senha }),
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                setMensagem("Resposta inválida do servidor ❌");
                return;
            }

            if (response.ok) {
                // Flask retorna: { resposta: "ok", is_admin: 0 ou 1, id, usuario, email }
                const isAdmin = data.is_admin;

                if (isAdmin == 1) {
                    setMensagem("Login admin realizado com sucesso ✅");
                    setTimeout(() => navigation.navigate('Adm'), 1500);
                } else {
                    setMensagem("Login realizado com sucesso ✅");
                    setTimeout(() => navigation.navigate('App'), 1500);
                }
            } else {
                // Flask retorna "message" em 404, "resposta" em 401, "erro" em 400/500
                const msg = data.message || data.resposta || data.erro || "Erro no login ❌";
                setMensagem(msg);
            }

        } catch (error) {
            setMensagem("Erro de conexão 🌐");
        } finally {
            setCarregando(false);
        }
    };

    const sucesso = mensagem.includes("sucesso");

    return (
        <View style={styles.container}>
            <TopWave />
            <BottomWave />

            <View style={styles.card}>
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    placeholderTextColor="#9CA3AF"
                    value={usuario}
                    editable={!carregando}
                    onChangeText={(text) => { setUsuario(text.trimStart()); setMensagem(""); }}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={senha}
                    editable={!carregando}
                    onChangeText={(text) => { setSenha(text); setMensagem(""); }}
                />

                <TouchableOpacity
                    style={[styles.button, (!usuario || !senha || carregando) && styles.buttonDisabled]}
                    disabled={!usuario || !senha || carregando}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>
                        {carregando ? "Entrando..." : "Entrar"}
                    </Text>
                </TouchableOpacity>

                {mensagem ? (
                    <Text style={[styles.msg, sucesso ? styles.success : styles.error]}>
                        {mensagem}
                    </Text>
                ) : null}

                <TouchableOpacity onPress={() => navigation.navigate('Registrar-se')}>
                    <Text style={styles.signup}>Não tem conta? Registre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}