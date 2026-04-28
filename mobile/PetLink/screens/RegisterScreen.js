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

export default function RegisterScreen({ navigation }) {
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estado, setEstado] = useState('');
    const [cidade, setCidade] = useState('');
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
                body: JSON.stringify({ usuario: usuario.trim(), email, cpf, telefone, estado, cidade, senha }),
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
        <View style={s.screen}>
            <TopWave />
            <BottomWave />

            <ScrollView
                contentContainerStyle={s.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={s.card}>
                    <Text style={s.title}>Registrar-se</Text>

                    <Text style={s.label}>Usuário</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Digite seu usuário"
                        placeholderTextColor="#bbb"
                        value={usuario}
                        onChangeText={(t) => { setUsuario(t.trimStart()); setMensagem(""); }}
                    />

                    <Text style={s.label}>E-mail</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="#bbb"
                        value={email}
                        onChangeText={(t) => { setEmail(t.trimStart()); setMensagem(""); }}
                    />

                    <Text style={s.label}>CPF</Text>
                    <TextInput
                        style={s.input}
                        placeholder="000.000.000-00"
                        placeholderTextColor="#bbb"
                        value={cpf}
                        onChangeText={(t) => { setCpf(t.trimStart()); setMensagem(""); }}
                    />

                    <Text style={s.label}>Telefone</Text>
                    <TextInput
                        style={s.input}
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#bbb"
                        value={telefone}
                        keyboardType="phone-pad"
                        onChangeText={(t) => { setTelefone(t.trimStart()); setMensagem(""); }}
                    />

                    <View style={s.row}>
                        <View style={s.colEstado}>
                            <Text style={s.label}>Estado</Text>
                            <TextInput
                                style={s.input}
                                placeholder="SP"
                                placeholderTextColor="#bbb"
                                value={estado}
                                maxLength={2}
                                onChangeText={(t) => { setEstado(t.toUpperCase()); setMensagem(""); }}
                            />
                        </View>
                        <View style={s.colCidade}>
                            <Text style={s.label}>Cidade</Text>
                            <TextInput
                                style={s.input}
                                placeholder="Sua cidade"
                                placeholderTextColor="#bbb"
                                value={cidade}
                                onChangeText={(t) => { setCidade(t.trimStart()); setMensagem(""); }}
                            />
                        </View>
                    </View>

                    <Text style={s.label}>Senha</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#bbb"
                        secureTextEntry
                        value={senha}
                        onChangeText={(t) => { setSenha(t); setMensagem(""); }}
                    />

                    <Text style={s.label}>Confirmar Senha</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Repita a senha"
                        placeholderTextColor="#bbb"
                        secureTextEntry
                        value={confirmarSenha}
                        onChangeText={(t) => { setConfirmarSenha(t); setMensagem(""); }}
                    />

                    {mensagem ? (
                        <Text style={[s.msg, mensagem.includes("sucesso") ? s.success : s.error]}>
                            {mensagem}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={[s.button, (!usuario || !email || !cpf || !telefone || !estado || !cidade || !senha || !confirmarSenha) && s.buttonDisabled]}
                        disabled={!usuario || !senha || !confirmarSenha}
                        onPress={handleRegister}
                    >
                        <Text style={s.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={s.link}>Já tem conta? <Text style={s.linkBold}>Login</Text></Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 100,
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        textAlign: 'center',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        marginBottom: 4,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#ECECEC',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#1a1a1a',
        backgroundColor: '#FAFAFA',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    colEstado: {
        width: 80,
    },
    colCidade: {
        flex: 1,
    },
    button: {
        backgroundColor: '#F4A261',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#F4A261',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    link: {
        textAlign: 'center',
        marginTop: 16,
        color: '#aaa',
        fontSize: 13,
    },
    linkBold: {
        color: '#F4A261',
        fontWeight: '700',
    },
    msg: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
    },
    success: { color: '#1D9E75' },
    error: { color: '#D85A30' },
});