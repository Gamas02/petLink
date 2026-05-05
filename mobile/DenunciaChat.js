/**
 * DenunciaChat.js  –  Tela de chatbot de denúncias (Rasa REST channel)
 *
 * Integração no App.js:
 *   import DenunciaChat from './screens/DenunciaChat';
 *   <Stack.Screen name="DenunciaChat" component={DenunciaChat} />
 *
 * Navegar passando o id do usuário logado (ou null para anônimo):
 *   navigation.navigate('DenunciaChat', { id_usuario: 5 })
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StatusBar,
    SafeAreaView,
} from 'react-native';

// ⚠️  Ajuste para o IP/host do seu servidor Rasa
const RASA_URL = 'http://10.0.2.2:5005/webhooks/rest/webhook';

// IDs únicos para as mensagens da lista
let _msgId = 0;
const nextId = () => ++_msgId;

// Cria objetos de mensagem
const botMsg  = (text) => ({ id: nextId(), from: 'bot',  text });
const userMsg = (text) => ({ id: nextId(), from: 'user', text });

// Sender único por sessão (Rasa usa para manter contexto de conversa)
const makeSenderId = (id_usuario) =>
    id_usuario ? `user_${id_usuario}` : `anon_${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
export default function DenunciaChat({ route, navigation }) {
    const id_usuario = route?.params?.id_usuario ?? null;

    // Sender fixo por sessão
    const senderIdRef = useRef(makeSenderId(id_usuario));

    const [messages, setMessages]     = useState([]);
    const [input, setInput]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [encerrado, setEncerrado]   = useState(false);
    const flatRef = useRef(null);

    // ── Envia mensagem para o Rasa e recebe as respostas ─────────────────
    const enviarParaRasa = useCallback(async (texto) => {
        setLoading(true);
        try {
            const body = {
                sender:  senderIdRef.current,
                message: texto,
                // Metadado com id_usuario para o action server
                metadata: { id_usuario: id_usuario ? String(id_usuario) : null },
            };

            const res = await fetch(RASA_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(body),
            });

            const respostas = await res.json(); // array de { text, ... }

            const novas = respostas
                .filter((r) => r.text)
                .map((r) => botMsg(r.text));

            if (novas.length === 0) {
                novas.push(botMsg('🐾 ...'));
            }

            setMessages((prev) => [...prev, ...novas]);

            // Detecta encerramento pelo conteúdo da última mensagem
            const ultima = novas[novas.length - 1]?.text ?? '';
            if (
                ultima.includes('protocolo') ||
                ultima.includes('Cancelada') ||
                ultima.includes('cancelada') ||
                ultima.includes('Até logo')
            ) {
                setEncerrado(true);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                botMsg('⚠️ Erro de conexão. Verifique sua internet e tente novamente.'),
            ]);
        } finally {
            setLoading(false);
        }
    }, [id_usuario]);

    // ── Primeiro contato — acorda o bot ───────────────────────────────────
    useEffect(() => {
        enviarParaRasa('oi');
    }, [enviarParaRasa]);

    // ── Scroll automático ─────────────────────────────────────────────────
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 120);
        }
    }, [messages]);

    // ── Envio de mensagem do usuário ──────────────────────────────────────
    const handleEnviar = useCallback(() => {
        const texto = input.trim();
        if (!texto || loading || encerrado) return;
        setInput('');
        setMessages((prev) => [...prev, userMsg(texto)]);
        enviarParaRasa(texto);
    }, [input, loading, encerrado, enviarParaRasa]);

    // ── Nova denúncia ─────────────────────────────────────────────────────
    const novaDenuncia = useCallback(() => {
        senderIdRef.current = makeSenderId(id_usuario);
        setMessages([]);
        setEncerrado(false);
        enviarParaRasa('denunciar');
    }, [id_usuario, enviarParaRasa]);

    // ── Renderização de cada bolha ────────────────────────────────────────
    const renderMsg = useCallback(({ item }) => {
        const isBot = item.from === 'bot';
        return (
            <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                {isBot && <Text style={styles.avatar}>🐾</Text>}
                <View style={[styles.msgBox, isBot ? styles.msgBoxBot : styles.msgBoxUser]}>
                    <Text style={[styles.msgText, isBot ? styles.msgTextBot : styles.msgTextUser]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    }, []);

    // ── UI ────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>🐾 PetLink</Text>
                    <Text style={styles.headerSub}>Assistente de Denúncias</Text>
                </View>
                <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>online</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Mensagens */}
                <FlatList
                    ref={flatRef}
                    data={messages}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderMsg}
                    contentContainerStyle={styles.listContent}
                    style={styles.list}
                    removeClippedSubviews
                />

                {/* Indicador de digitação */}
                {loading && (
                    <View style={styles.typingRow}>
                        <Text style={styles.avatar}>🐾</Text>
                        <View style={styles.typingBox}>
                            <ActivityIndicator size="small" color="#F4A261" />
                            <Text style={styles.typingText}>digitando...</Text>
                        </View>
                    </View>
                )}

                {/* Botão nova denúncia (após encerrar) */}
                {encerrado && (
                    <TouchableOpacity style={styles.restartBtn} onPress={novaDenuncia}>
                        <Text style={styles.restartText}>+ Nova denúncia</Text>
                    </TouchableOpacity>
                )}

                {/* Campo de entrada */}
                {!encerrado && (
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Digite sua resposta..."
                            placeholderTextColor="#BDBDBD"
                            multiline
                            onSubmitEditing={handleEnviar}
                            blurOnSubmit
                            editable={!loading}
                            returnKeyType="send"
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendBtn,
                                (loading || !input.trim()) && styles.sendBtnDisabled,
                            ]}
                            onPress={handleEnviar}
                            disabled={loading || !input.trim()}
                        >
                            <Text style={styles.sendIcon}>➤</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ──────────────────────────────────────────────────────────────────────────
const ORANGE  = '#F4A261';
const ORANGE_D= '#E07B39';
const WHITE   = '#FFFFFF';
const BG      = '#F9F4EF';

const styles = StyleSheet.create({
    safe:  { flex: 1, backgroundColor: ORANGE_D },
    flex:  { flex: 1, backgroundColor: BG },

    // Header
    header: {
        backgroundColor: ORANGE,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        elevation: 4,
    },
    backBtn:    { padding: 4 },
    backText:   { fontSize: 22, color: WHITE, fontWeight: '700' },
    headerTitle:{ fontSize: 18, fontWeight: '800', color: WHITE, flex: 1 },
    headerSub:  { fontSize: 12, color: '#FFE8D6' },
    onlineBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
    onlineDot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
    onlineText: { color: '#FFE8D6', fontSize: 11 },

    // Lista
    list:        { flex: 1 },
    listContent: { padding: 16, paddingBottom: 8 },

    // Bolhas
    bubble: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-end',
    },
    bubbleBot:  { justifyContent: 'flex-start' },
    bubbleUser: { justifyContent: 'flex-end' },

    avatar: { fontSize: 20, marginRight: 6, marginBottom: 2 },

    msgBox: {
        maxWidth: '78%',
        borderRadius: 18,
        padding: 12,
        elevation: 1,
    },
    msgBoxBot:  { backgroundColor: WHITE, borderBottomLeftRadius: 4 },
    msgBoxUser: { backgroundColor: ORANGE, borderBottomRightRadius: 4 },

    msgText:     { fontSize: 15, lineHeight: 22 },
    msgTextBot:  { color: '#333' },
    msgTextUser: { color: WHITE },

    // Typing
    typingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    typingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: WHITE,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 8,
        elevation: 1,
    },
    typingText: { color: '#999', fontSize: 13 },

    // Botão reiniciar
    restartBtn: {
        margin: 16,
        backgroundColor: ORANGE,
        borderRadius: 25,
        paddingVertical: 13,
        alignItems: 'center',
        elevation: 2,
    },
    restartText: { color: WHITE, fontWeight: '700', fontSize: 15 },

    // Input
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: WHITE,
        borderTopWidth: 1,
        borderTopColor: '#EDEDED',
        gap: 8,
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        backgroundColor: '#F5F5F5',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: ORANGE,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    sendBtnDisabled: { opacity: 0.35 },
    sendIcon: { color: WHITE, fontSize: 18, fontWeight: '700' },
});
