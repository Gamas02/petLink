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
            const response = await fetch("http://SEU_BACKEND/register", {
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
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="#bbb"
                        value={email}
                        onChangeText={(t) => { setEmail(t.trimStart()); setMensagem(""); }}
                    />

                    <View style={s.row}>
                        <View style={s.colHalf}>
                            <Text style={s.label}>CPF</Text>
                            <TextInput
                                style={s.input}
                                placeholder="000.000.000-00"
                                placeholderTextColor="#bbb"
                                onChangeText={(t) => { setCpf(mascaraCPF(t)); setMensagem(""); }}
                                value={cpf}
                            />
                        </View>
                        <View style={s.colHalf}>
                            <Text style={s.label}>Telefone</Text>
                            <TextInput
                                style={s.input}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#bbb"
                                keyboardType="phone-pad"
                                onChangeText={(t) => { setTelefone(mascaraTelefone(t)); setMensagem(""); }}
                                value={telefone}
                            />
                        </View>
                    </View>

                    <View style={s.row}>

                        <View style={s.colEstado}>
                            <Text style={s.label}>Estado</Text>
                            <TextInput
                                style={s.input}
                                placeholder="SP"
                                placeholderTextColor="#bbb"
                                value={estado}
                                maxLength={2}
                                onChangeText={(t) => {
                                    setEstado(t.toUpperCase().replace(/[^A-Z]/g, ''));
                                    setMensagem("");
                                }}
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
                    <View style={s.inputWrap}>

                        <TextInput
                            style={s.input}
                            placeholder="Mínimo 6 caracteres"
                            placeholderTextColor="#bbb"
                            secureTextEntry={!mostrarSenha}
                            value={senha}
                            onChangeText={(t) => { setSenha(t); setMensagem(""); }}
                        />

                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarSenha(v => !v)}>
                            <Text>{mostrarSenha ? '✕' : '◉'}</Text>
                        </TouchableOpacity>

                    </View>

                    <Text style={s.label}>Confirmar Senha</Text>
                    <View style={s.inputWrap}>

                        <TextInput
                            style={s.input}
                            placeholder="Repita a senha"
                            placeholderTextColor="#bbb"
                            secureTextEntry={!mostrarConfirmar}
                            value={confirmarSenha}
                            onChangeText={(t) => { setConfirmarSenha(t); setMensagem(""); }}
                        />

                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarConfirmar(v => !v)}>
                            <Text>{mostrarConfirmar ? '✕' : '◉'}</Text>
                        </TouchableOpacity>

                    </View>

                    {mensagem ? (
                        <Text style={[s.msg, mensagem.includes("sucesso") ? s.success : s.error]}>
                            {mensagem}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={[s.button, (!usuario || !email || !cpf || !telefone || !estado || !cidade || !senha || !confirmarSenha) && s.buttonDisabled]}
                        disabled={!usuario || !email || !cpf || !telefone || !estado || !cidade || !senha || !confirmarSenha}
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
        paddingVertical: 80,
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#888',
        marginTop: 8,
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#ECECEC',
        borderRadius: 12,
        padding: 8,           // era 12
        fontSize: 13,         // era 14
        color: '#1a1a1a',
        backgroundColor: '#FAFAFA',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    colHalf: {
        flex: 1,              // novo — CPF e Telefone lado a lado
    },
    colEstado: {
        width: 72,            // era 80
    },
    colCidade: {
        flex: 1,
    },
    inputWrap: {
        position: 'relative', // novo — para o botão de olho
    },
    eyeBtn: {
        position: 'absolute',
        right: 10,
        top: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
        marginBottom: 0,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F4F4F4',
    },
    dividerText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#F4A261',
        textTransform: 'uppercase',
        letterSpacing: 0.9,
    },
    button: {
        backgroundColor: '#F4A261',
        padding: 13,          // era 16
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 14,        // era 24
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
        fontSize: 14,
    },
    link: {
        textAlign: 'center',
        marginTop: 10,        // era 16
        color: '#aaa',
        fontSize: 12,
    },
    linkBold: {
        color: '#F4A261',
        fontWeight: '700',
    },
    msg: {
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
    },
    success: { color: '#1D9E75' },
    error: { color: '#D85A30' },
});