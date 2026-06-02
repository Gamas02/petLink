import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    TouchableOpacity, ScrollView, Alert,
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
                    <TextInput style={s.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />

                    {/* Email */}
                    <Text style={s.label}>E-mail *</Text>
                    <TextInput style={s.input} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                    {/* CNPJ + Telefone */}
                    <View style={s.row}>
                        <View style={s.colHalf}>
                            <Text style={s.label}>CNPJ *</Text>
                            <TextInput style={s.input} keyboardType="numeric" value={cnpj} onChangeText={t => setCnpj(mascaraCNPJ(t))} />
                        </View>
                        <View style={s.colHalf}>
                            <Text style={s.label}>Telefone</Text>
                            <TextInput style={s.input} keyboardType="phone-pad" value={telefone} onChangeText={t => setTelefone(mascaraTelefone(t))} />
                        </View>
                    </View>

                    {/* Tipo */}
                    <Text style={s.label}>Tipo *</Text>
                    <View style={s.pickerWrap}>
                        <Picker selectedValue={tipo} onValueChange={setTipo}>
                            <Picker.Item label="Selecione..." value="" />
                            <Picker.Item label="ONG" value="ong" />
                            <Picker.Item label="Canil" value="canil" />
                        </Picker>
                    </View>

                    {/* Código de registro (opcional) */}
                    <Text style={s.label}>Código de registro <Text style={s.opcional}>(opcional)</Text></Text>
                    <TextInput style={s.input} placeholder="Ex: CRMV-SP 12345" value={codigo_registro} onChangeText={setCodigoRegistro} />

                    {/* Endereço (novo campo obrigatório) */}
                    <Text style={s.label}>Endereço (Rua, número, bairro) *</Text>
                    <TextInput style={s.input} placeholder="Rua Exemplo, 123, Centro" value={endereco} onChangeText={setEndereco} />

                    {/* Cidade + Estado */}
                    <View style={s.row}>
                        <View style={s.colEstado}>
                            <Text style={s.label}>Estado *</Text>
                            <TextInput style={s.input} placeholder="SP" maxLength={2} value={estado} onChangeText={t => setEstado(t.toUpperCase().replace(/[^A-Z]/g, ''))} />
                        </View>
                        <View style={s.colCidade}>
                            <Text style={s.label}>Cidade *</Text>
                            <TextInput style={s.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
                        </View>
                    </View>

                    {/* Tags (opcional, separadas por vírgula) */}
                    <Text style={s.label}>Tags (separadas por vírgula)</Text>
                    <TextInput style={s.input} placeholder="Ex: Cães, Gatos, Aves" value={tags} onChangeText={setTags} />

                    {/* Descrição */}
                    <Text style={s.label}>Descrição da instituição</Text>
                    <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Fale sobre o trabalho..." multiline value={descricao} onChangeText={setDescricao} />

                    {/* Senha */}
                    <Text style={s.label}>Senha *</Text>
                    <View style={s.inputWrap}>
                        <TextInput style={s.input} secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} />
                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarSenha(v => !v)}>
                            <Text>{mostrarSenha ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Confirmar senha */}
                    <Text style={s.label}>Confirmar Senha *</Text>
                    <View style={s.inputWrap}>
                        <TextInput style={s.input} secureTextEntry={!mostrarConfirmar} value={confirmarSenha} onChangeText={setConfirmarSenha} />
                        <TouchableOpacity style={s.eyeBtn} onPress={() => setMostrarConfirmar(v => !v)}>
                            <Text>{mostrarConfirmar ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
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

// Estilos melhorados e mais bonitos
const s = StyleSheet.create({
    screen: { 
        flex: 1, 
        backgroundColor: '#F8F9FF'  // Fundo mais suave
    },
    scroll: { 
        flexGrow: 1, 
        paddingHorizontal: 20, 
        paddingTop: 40, 
        paddingBottom: 40 
    },
    card: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 32,  // Mais arredondado
        padding: 24, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 24, 
        elevation: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    title: { 
        fontSize: 28,  // Maior
        fontWeight: '800', 
        textAlign: 'center', 
        marginBottom: 24, 
        color: '#1A1A2E',
        letterSpacing: -0.5
    },
    label: { 
        fontSize: 12, 
        fontWeight: '600', 
        color: '#6B7280', 
        marginTop: 16, 
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    opcional: { 
        fontWeight: '400',
        color: '#9CA3AF',
        textTransform: 'none'
    },
    input: { 
        borderWidth: 1.5, 
        borderColor: '#E5E7EB', 
        borderRadius: 14, 
        paddingHorizontal: 16,
        paddingVertical: 12, 
        fontSize: 15, 
        backgroundColor: '#F8F9FC',
        color: '#1F2937'
    },
    row: { 
        flexDirection: 'row', 
        gap: 12 
    },
    colHalf: { 
        flex: 1 
    },
    colEstado: { 
        width: 80 
    },
    colCidade: { 
        flex: 1 
    },
    inputWrap: { 
        position: 'relative' 
    },
    eyeBtn: { 
        position: 'absolute', 
        right: 14, 
        top: 12,
        padding: 4,
        zIndex: 1
    },
    pickerWrap: { 
        borderWidth: 1.5, 
        borderColor: '#E5E7EB', 
        borderRadius: 14, 
        backgroundColor: '#F8F9FC', 
        overflow: 'hidden',
        marginBottom: 4
    },
    button: { 
        backgroundColor: '#F4A261', 
        paddingVertical: 16, 
        borderRadius: 40, 
        alignItems: 'center', 
        marginTop: 24,
        shadowColor: '#F4A261',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6
    },
    buttonDisabled: { 
        opacity: 0.5,
        shadowOpacity: 0,
        backgroundColor: '#D1D5DB'
    },
    buttonText: { 
        color: '#FFFFFF', 
        fontWeight: '700', 
        fontSize: 16,
        letterSpacing: 0.5
    },
    link: { 
        textAlign: 'center', 
        marginTop: 20, 
        color: '#6B7280', 
        fontSize: 14,
        fontWeight: '500'
    },
    linkBold: { 
        color: '#F4A261', 
        fontWeight: '700' 
    },
    msg: { 
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center', 
        fontWeight: '600', 
        fontSize: 13,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12
    },
    success: { 
        color: '#059669',
        backgroundColor: '#ECFDF5'
    },
    error: { 
        color: '#DC2626',
        backgroundColor: '#FEF2F2'
    },
});