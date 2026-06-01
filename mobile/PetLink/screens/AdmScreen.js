import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker
import { TopWave, BottomWave } from '../components/waves';
import { addInstitution } from '../data/institutions';

export default function AdmScreen({ navigation }) {

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [tipo, setTipo] = useState('');        // 'ong' | 'canil'
    const [codigo_registro, setCodigoRegistro] = useState('');       // opcional
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [mensagem, setMensagem] = useState('');

    // ── máscaras ────────────────────────────────────────────────
    const mascaraCNPJ = (t) =>
        t.replace(/\D/g, '').slice(0, 14)
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

    const mascaraTelefone = (t) =>
        t.replace(/\D/g, '').slice(0, 11)
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');

    const emailValido = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    // ── validação + envio ────────────────────────────────────────
    const handleRegister = async () => {
        if (!nome.trim()) { setMensagem("Nome obrigatório"); return; }
        if (!emailValido(email)) { setMensagem("E-mail inválido"); return; }
        if (cnpj.replace(/\D/g, '').length !== 14) { setMensagem("CNPJ inválido"); return; }
        if (!tipo) { setMensagem("Selecione o tipo"); return; }
        if (senha.length < 6) { setMensagem("Senha deve ter no mínimo 6 caracteres"); return; }
        if (senha !== confirmarSenha) { setMensagem("As senhas não coincidem"); return; }
        if (estado.length !== 2) { setMensagem("Estado inválido"); return; }

        try {
            setMensagem("Enviando...");
            const response = await fetch("http://10.0.2.2:5000/register-ong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.trim(),
                    email: email.trim(),
                    senha,
                    telefone: telefone.replace(/\D/g, ''),
                    cnpj: cnpj.replace(/\D/g, ''),
                    tipo,                                // 'ong' ou 'canil'
                    codigo_registro: codigo_registro.trim() || null,
                    cidade: cidade.trim(),
                    estado,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                addInstitution({
                    name: nome.trim(),
                    location: `${cidade.trim()}, ${estado}`,
                    emoji: tipo === 'canil' ? '🐕' : '🐾',
                    tags: tipo === 'canil' ? ['Cães'] : [],
                    goal: { current: 0, total: 50 },
                    color: '#F4A261',
                    tagBg: '#FEF0E6',
                    tagText: '#7C4A1A',
                    description: '',
                });
                setMensagem("Cadastro realizado com sucesso ✅");
                setTimeout(() => navigation.navigate('Login'), 1500);
            } else {
                setMensagem(data.message || "Erro ao cadastrar ❌");
            }
        } catch {
            setMensagem("Erro de conexão com servidor 🌐");
        }
    };

    const camposObrigatorios =
        !nome || !email || !cnpj || !tipo || !senha || !confirmarSenha || !estado;

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

                    {/* Nome */}
                    <Text style={s.label}>Nome da ONG / Canil</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Nome completo"
                        placeholderTextColor="#bbb"
                        value={nome}
                        onChangeText={(t) => { setNome(t.trimStart()); setMensagem(""); }}
                    />

                    {/* E-mail */}
                    <Text style={s.label}>E-mail</Text>
                    <TextInput
                        style={s.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="contato@ong.org"
                        placeholderTextColor="#bbb"
                        value={email}
                        onChangeText={(t) => { setEmail(t.trimStart()); setMensagem(""); }}
                    />

                    {/* CNPJ + Telefone */}
                    <View style={s.row}>
                        <View style={s.colHalf}>
                            <Text style={s.label}>CNPJ</Text>
                            <TextInput
                                style={s.input}
                                placeholder="00.000.000/0000-00"
                                placeholderTextColor="#bbb"
                                keyboardType="numeric"
                                value={cnpj}
                                onChangeText={(t) => { setCnpj(mascaraCNPJ(t)); setMensagem(""); }}
                            />
                        </View>
                        <View style={s.colHalf}>
                            <Text style={s.label}>Telefone</Text>
                            <TextInput
                                style={s.input}
                                placeholder="(00) 00000-0000"
                                placeholderTextColor="#bbb"
                                keyboardType="phone-pad"
                                value={telefone}
                                onChangeText={(t) => { setTelefone(mascaraTelefone(t)); setMensagem(""); }}
                            />
                        </View>
                    </View>

                    {/* Tipo */}
                    <Text style={s.label}>Tipo</Text>
                    <View style={s.pickerWrap}>
                        <Picker
                            selectedValue={tipo}
                            onValueChange={(v) => { setTipo(v); setMensagem(""); }}
                            style={s.picker}
                        >
                            <Picker.Item label="Selecione..." value="" color="#bbb" />
                            <Picker.Item label="ONG" value="ong" />
                            <Picker.Item label="Canil" value="canil" />
                        </Picker>
                    </View>

                    {/* Código de registro (opcional) */}
                    <Text style={s.label}>Código de registro <Text style={s.opcional}>(opcional)</Text></Text>
                    <TextInput
                        style={s.input}
                        placeholder="Ex: CRMV-SP 12345"
                        placeholderTextColor="#bbb"
                        value={codigo_registro}
                        onChangeText={(t) => { setCodigoRegistro(t.trimStart()); setMensagem(""); }}
                    />

                    {/* Estado + Cidade */}
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

                    {/* Senha */}
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

                    {/* Confirmar senha */}
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
                        style={[s.button, camposObrigatorios && s.buttonDisabled]}
                        disabled={camposObrigatorios}
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
    screen: { flex: 1, backgroundColor: '#fff' },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 20 },
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 },
    title: { fontSize: 20, fontWeight: '900', textAlign: 'center', color: '#1a1a1a', marginBottom: 10 },
    label: { fontSize: 10, fontWeight: '700', color: '#888', marginTop: 8, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
    opcional: { fontWeight: '400', textTransform: 'none' },
    input: { borderWidth: 1.5, borderColor: '#ECECEC', borderRadius: 12, padding: 8, fontSize: 13, color: '#1a1a1a', backgroundColor: '#FAFAFA' },
    row: { flexDirection: 'row', gap: 10 },
    colHalf: { flex: 1 },
    colEstado: { width: 72 },
    colCidade: { flex: 1 },
    inputWrap: { position: 'relative' },
    eyeBtn: { position: 'absolute', right: 10, top: 8 },
    pickerWrap: { borderWidth: 1.5, borderColor: '#ECECEC', borderRadius: 12, backgroundColor: '#FAFAFA', overflow: 'hidden' },
    picker: { height: 44, color: '#1a1a1a' },
    button: { backgroundColor: '#F4A261', padding: 13, borderRadius: 30, alignItems: 'center', marginTop: 14, shadowColor: '#F4A261', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
    buttonDisabled: { opacity: 0.4 },
    buttonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
    link: { textAlign: 'center', marginTop: 10, color: '#aaa', fontSize: 12 },
    linkBold: { color: '#F4A261', fontWeight: '700' },
    msg: { marginTop: 8, textAlign: 'center', fontWeight: '600', fontSize: 12 },
    success: { color: '#1D9E75' },
    error: { color: '#D85A30' },
});