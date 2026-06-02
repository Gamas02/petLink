import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ScrollView, Alert,
    Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TopWave, BottomWave } from '../components/waves';
import { addInstitution } from '../components/cards'; // <-- caminho corrigido

export default function AdmScreen({ navigation }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [tipo, setTipo] = useState('');
    const [codigo_registro, setCodigoRegistro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    // NOVOS CAMPOS
    const [endereco, setEndereco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tags, setTags] = useState(''); // string para digitar tags separadas por vírgula
    const [mensagem, setMensagem] = useState('');

    const [modalTipo, setModalTipo] = useState(false);

    // Máscaras (mantidas iguais)
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

    const handleRegister = async () => {
        // Validações
        if (!nome.trim()) { setMensagem("Nome obrigatório"); return; }
        if (!emailValido(email)) { setMensagem("E-mail inválido"); return; }
        if (cnpj.replace(/\D/g, '').length !== 14) { setMensagem("CNPJ inválido"); return; }
        if (!tipo) { setMensagem("Selecione o tipo"); return; }
        if (senha.length < 6) { setMensagem("Senha deve ter no mínimo 6 caracteres"); return; }
        if (senha !== confirmarSenha) { setMensagem("As senhas não coincidem"); return; }
        if (estado.length !== 2) { setMensagem("Estado inválido"); return; }
        if (!endereco.trim()) { setMensagem("Endereço é obrigatório"); return; }

        // Processa tags (separadas por vírgula)
        const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        if (tagsArray.length === 0) {
            // Se não informou tags, coloca uma padrão baseada no tipo
            if (tipo === 'canil') tagsArray.push('Cães');
            else if (tipo === 'ong') tagsArray.push('Cães', 'Gatos');
        }

        // Monta objeto para enviar ao backend (API)
        try {
            setMensagem("Enviando...");
            const response = await fetch("http://localhost:5000/register-ong", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.trim(),
                    email: email.trim(),
                    senha,
                    telefone: telefone.replace(/\D/g, ''),
                    cnpj: cnpj.replace(/\D/g, ''),
                    tipo,
                    codigo_registro: codigo_registro.trim() || null,
                    cidade: cidade.trim(),
                    estado,
                    endereco: endereco.trim(),
                    descricao: descricao.trim(),
                    tags: tagsArray,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dados completos para o card
                const fullAddress = `${endereco.trim()}, ${cidade.trim()} - ${estado}`;
                await addInstitution({
                    name: nome.trim(),
                    location: `${cidade.trim()}, ${estado}`,
                    address: fullAddress,
                    emoji: tipo === 'canil' ? '🐕' : '🐾',
                    tags: tagsArray,
                    goal: { current: 0, total: 50 },
                    color: '#F4A261',      // padrão, depois pode editar
                    tagBg: '#FEF0E6',
                    tagText: '#7C4A1A',
                    description: descricao.trim() || "Nova instituição cadastrada.",
                });
                setMensagem("Cadastro realizado com sucesso ✅");
                // Redireciona para a tela principal (AppScreen) após 1.5s
                setTimeout(() => navigation.replace('App'), 1500); // use replace para não voltar ao formulário
            } else {
                setMensagem(data.message || "Erro ao cadastrar ❌");
            }
        } catch (error) {
            console.error(error);
            setMensagem("Erro de conexão com servidor 🌐");
        }
    };

    const camposObrigatorios = !nome || !email || !cnpj || !tipo || !senha || !confirmarSenha || !estado || !endereco;

    return (
        <View style={s.screen}>
            <TopWave />
            <BottomWave />
            <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
                <View style={s.card}>
                    <Text style={s.title}>Registrar ONG / Canil</Text>

                    {/* Nome */}
                    <Text style={s.label}>Nome da ONG / Canil *</Text>
                    <TextInput style={s.input} placeholder="Ex: Lar dos filhotes" placeholderTextColor={"gray"} value={nome} onChangeText={setNome} />

                    {/* Email */}
                    <Text style={s.label}>E-mail *</Text>
                    <TextInput style={s.input} placeholder="exemplo@ex.com" placeholderTextColor={"gray"} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                    {/* CNPJ + Telefone */}
                    <View style={s.row}>
                        <View style={s.colHalf}>
                            <Text style={s.label}>CNPJ *</Text>
                            <TextInput style={s.input} placeholder="00.000.000/0000-00" placeholderTextColor={"gray"} keyboardType="numeric" value={cnpj} onChangeText={t => setCnpj(mascaraCNPJ(t))} />
                        </View>
                        <View style={s.colHalf}>
                            <Text style={s.label}>Telefone</Text>
                            <TextInput style={s.input} placeholder="(00) 00000-0000" placeholderTextColor={"gray"} keyboardType="phone-pad" value={telefone} onChangeText={t => setTelefone(mascaraTelefone(t))} />
                        </View>
                    </View>

                    {/* Tipo */}
                    <Text style={s.label}>Tipo *</Text>
                    <TouchableOpacity
                        style={[s.input, s.pickerWrap]}
                        onPress={() => setModalTipo(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={tipo ? s.pickerText : s.pickerPlaceholder}>
                            {tipo === 'ong' ? 'ONG' : tipo === 'canil' ? 'Canil' : 'Selecione...'}
                        </Text>
                        <Text style={s.pickerArrow}>›</Text>
                    </TouchableOpacity>

                    <Modal visible={modalTipo} transparent animationType="fade">
                        <TouchableOpacity style={s.modalOverlay} onPress={() => setModalTipo(false)}>
                            <View style={s.modalBox}>
                                <Text style={s.modalTitle}>Tipo</Text>
                                {[{ label: 'ONG', value: 'ong' }, { label: 'Canil', value: 'canil' }].map(op => (
                                    <TouchableOpacity
                                        key={op.value}
                                        style={[s.modalOption, tipo === op.value && s.modalOptionActive]}
                                        onPress={() => { setTipo(op.value); setModalTipo(false); }}
                                    >
                                        <Text style={[s.modalOptionText, tipo === op.value && s.modalOptionTextActive]}>
                                            {op.label}
                                        </Text>
                                        {tipo === op.value && <Text style={s.modalCheck}>✓</Text>}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableOpacity>
                    </Modal>

                    {/* Código de registro (opcional) */}
                    <Text style={s.label}>Código de registro <Text style={s.opcional}>(opcional)</Text></Text>
                    <TextInput style={s.input} placeholder="Ex: CRMV-SP 12345" placeholderTextColor={"gray"} value={codigo_registro} onChangeText={setCodigoRegistro} />

                    {/* Endereço (novo campo obrigatório) */}
                    <Text style={s.label}>Endereço (Rua, número, bairro) *</Text>
                    <TextInput style={s.input} placeholder="Rua Exemplo, 123, Centro" placeholderTextColor={"gray"} value={endereco} onChangeText={setEndereco} />

                    {/* Cidade + Estado */}
                    <View style={s.row}>
                        <View style={s.colEstado}>
                            <Text style={s.label}>Estado *</Text>
                            <TextInput style={s.input} placeholder="SP" placeholderTextColor={"gray"} maxLength={2} value={estado} onChangeText={t => setEstado(t.toUpperCase().replace(/[^A-Z]/g, ''))} />
                        </View>
                        <View style={s.colCidade}>
                            <Text style={s.label}>Cidade *</Text>
                            <TextInput style={s.input} placeholder="Cidade" placeholderTextColor={"gray"} value={cidade} onChangeText={setCidade} />
                        </View>
                    </View>

                    {/* Tags (opcional, separadas por vírgula) */}
                    <Text style={s.label}>Tags (separadas por vírgula)</Text>
                    <TextInput style={s.input} placeholder="Ex: Cães, Gatos, Aves" placeholderTextColor={"gray"} value={tags} onChangeText={setTags} />

                    {/* Descrição */}
                    <Text style={s.label}>Descrição da instituição</Text>
                    <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Fale sobre o trabalho..." placeholderTextColor={"gray"} multiline value={descricao} onChangeText={setDescricao} />

                    {/* Senha */}
                    <Text style={s.label}>Senha *</Text>
                    <View style={s.inputWrap}>
                        <TextInput style={s.input} secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} />
                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarSenha(v => !v)} />
                    </View>

                    {/* Confirmar senha */}
                    <Text style={s.label}>Confirmar Senha *</Text>
                    <View style={s.inputWrap}>
                        <TextInput style={s.input} secureTextEntry={!mostrarConfirmar} value={confirmarSenha} onChangeText={setConfirmarSenha} />
                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarConfirmar(v => !v)} />
                    </View>

                    {mensagem ? (
                        <Text style={[s.msg, mensagem.includes("sucesso") ? s.success : s.error]}>
                            {mensagem}
                        </Text>
                    ) : null}

                    <TouchableOpacity style={[s.button, camposObrigatorios && s.buttonDisabled]} disabled={camposObrigatorios} onPress={handleRegister}>
                        <Text style={s.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F4F0',
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 18,
        paddingTop: 32,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#1A1A2E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#EEECEB',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 20,
        color: '#1A1A2E',
        letterSpacing: -0.5,
    },
    label: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
        marginTop: 12,
        marginBottom: 6,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    opcional: {
        fontWeight: '400',
        color: '#C4C9D4',
        textTransform: 'none',
        fontSize: 11,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E9EAF0',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: '#FAFAFA',
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    colHalf: {
        flex: 1,
    },
    colEstado: {
        width: 72,
    },
    colCidade: {
        flex: 1,
    },
    inputWrap: {
        position: 'relative',
    },
    eyeBtn: {
        position: 'absolute',
        right: 12,
        top: 10,
        padding: 4,
        zIndex: 1,
    },
    pickerWrap: {
        borderWidth: 1,
        borderColor: '#E9EAF0',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
        overflow: 'hidden',
        marginBottom: 2,
    },
    button: {
        backgroundColor: '#F4A261',
        paddingVertical: 14,
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        opacity: 0.45,
        backgroundColor: '#D1D5DB',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.4,
    },
    link: {
        textAlign: 'center',
        marginTop: 16,
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    linkBold: {
        color: '#F4A261',
        fontWeight: '700',
    },
    msg: {
        marginTop: 14,
        marginBottom: 6,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    success: {
        color: '#059669',
        backgroundColor: '#ECFDF5',
    },
    error: {
        color: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    pickerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerText: {
        fontSize: 14,
        color: '#1F2937',
    },
    pickerPlaceholder: {
        fontSize: 14,
        color: '#C4C9D4',
    },
    pickerArrow: {
        fontSize: 20,
        color: '#9CA3AF',
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    modalBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
    },
    modalTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalOptionActive: {
        backgroundColor: '#FFF5EE',
    },
    modalOptionText: {
        fontSize: 15,
        color: '#1F2937',
        fontWeight: '500',
    },
    modalOptionTextActive: {
        color: '#F4A261',
        fontWeight: '700',
    },
    modalCheck: {
        color: '#F4A261',
        fontSize: 16,
        fontWeight: '700',
    },
});