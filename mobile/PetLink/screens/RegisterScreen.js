import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { TopWave, BottomWave } from '../components/waves';
import { registerStyles as styles } from '../style/styles';

export default function RegisterScreen({ navigation }) {

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
    const [mensagem, setMensagem] = useState('');

    const mascaraCPF = (t) => {
        return t
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const mascaraTelefone = (t) => {
        return t
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    };

    const emailValido = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegister = async () => {


        if (!emailValido(email)) {
            setMensagem("E-mail inválido");
            return;
        }

        if (cpf.replace(/\D/g, '').length !== 11) {
            setMensagem("CPF inválido");
            return;
        }

        if (senha.length < 6) {
            setMensagem("Senha deve ter no mínimo 6 caracteres");
            return;
        }
        if (senha !== confirmarSenha) {
            setMensagem("As senhas não coincidem");
            return;
        }
        if (estado.length !== 2) {
            setMensagem('Esse não é um estado válido!')
            return;
        }

        try {
            setMensagem("Enviando...");
            const response = await fetch("http://localhost:5000/register-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: usuario.trim(),
                    email,
                    cpf: cpf.replace(/\D/g, ''),
                    telefone: telefone.replace(/\D/g, ''),
                    estado,
                    cidade: cidade.trim(),
                    senha,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMensagem("Cadastro realizado com sucesso ✅");
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 1500);
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

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Registrar-se</Text>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Usuário</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu usuário"
                            placeholderTextColor="#9CA3AF"
                            value={usuario}
                            onChangeText={(t) => { setUsuario(t.trimStart()); setMensagem(""); }}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={(t) => { setEmail(t.trimStart()); setMensagem(""); }}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.colHalf}>
                            <Text style={styles.label}>CPF</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="000.000.000-00"
                                placeholderTextColor="#9CA3AF"
                                onChangeText={(t) => { setCpf(mascaraCPF(t)); setMensagem(""); }}
                                value={cpf}
                            />
                        </View>
                        <View style={styles.colHalf}>
                            <Text style={styles.label}>Telefone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                onChangeText={(t) => { setTelefone(mascaraTelefone(t)); setMensagem(""); }}
                                value={telefone}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.colEstado}>
                            <Text style={styles.label}>Estado</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="SP"
                                placeholderTextColor="#9CA3AF"
                                value={estado}
                                maxLength={2}
                                onChangeText={(t) => {
                                    setEstado(t.toUpperCase().replace(/[^A-Z]/g, ''));
                                    setMensagem("");
                                }}
                            />
                        </View>

                        <View style={styles.colCidade}>
                            <Text style={styles.label}>Cidade</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Sua cidade"
                                placeholderTextColor="#9CA3AF"
                                value={cidade}
                                onChangeText={(t) => { setCidade(t.trimStart()); setMensagem(""); }}
                            />
                        </View>
                    </View>

                    <View style={styles.passwordContainer}>
                        <Text style={styles.label}>Senha</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                placeholder="Mínimo 6 caracteres"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!mostrarSenha}
                                value={senha}
                                onChangeText={(t) => { setSenha(t); setMensagem(""); }}
                            />
                            <TouchableOpacity style={styles.eyeBtn} onPress={() => setMostrarSenha(v => !v)}>
                                <Text style={styles.eyeText}>{mostrarSenha ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.passwordContainer}>
                        <Text style={styles.label}>Confirmar Senha</Text>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                placeholder="Repita a senha"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!mostrarConfirmar}
                                value={confirmarSenha}
                                onChangeText={(t) => { setConfirmarSenha(t); setMensagem(""); }}
                            />
                            <TouchableOpacity style={styles.eyeBtn} onPress={() => setMostrarConfirmar(v => !v)}>
                                <Text style={styles.eyeText}>{mostrarConfirmar ? '👁️' : '👁️‍🗨️'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {mensagem ? (
                        <Text style={[styles.msg, mensagem.includes("sucesso") ? styles.success : mensagem.includes("inválido") || mensagem.includes("coincidem") || mensagem.includes("conexão") ? styles.error : styles.info]}>
                            {mensagem}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.button, (!usuario || !email || !cpf || !telefone || !estado || !cidade || !senha || !confirmarSenha) && styles.buttonDisabled]}
                        disabled={!usuario || !email || !cpf || !telefone || !estado || !cidade || !senha || !confirmarSenha}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <View style={styles.linkContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Já tem conta? <Text style={styles.linkBold}>Login</Text></Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}