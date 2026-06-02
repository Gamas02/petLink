import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '85%',
        backgroundColor: '#fff',
        padding: 28,
        borderRadius: 16,
        elevation: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        borderBottomWidth: 1.5,
        borderColor: '#E0E0E0',
        marginBottom: 22,
        padding: 8,
    },
    button: {
        backgroundColor: '#F4A261',
        padding: 14,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: '#fff', fontWeight: '700' },
    signup: {
        textAlign: 'center',
        marginTop: 16,
        color: '#F4A261',
    },
    msg: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    success: { color: 'green' },
    error: { color: 'red' },
});

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { alignItems: 'center', zIndex: 1 },
    appName: {
        fontSize: 36,
        fontWeight: '900',
        color: '#F4A261',
        marginBottom: 40,
    },
    buttonGroup: { width: 240, gap: 14 },
    primaryButton: {
        backgroundColor: '#F4A261',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    secondaryButton: {
        borderWidth: 2,
        borderColor: '#F4A261',
        padding: 13,
        borderRadius: 30,
        alignItems: 'center',
    },
    primaryButtonText: { color: '#fff', fontWeight: '700' },
    secondaryButtonText: { color: '#F4A261', fontWeight: '700' },
});

export const registerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 28,
        color: '#1A1A2E',
        letterSpacing: -0.5,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#F8F9FC',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    colHalf: {
        flex: 1,
    },
    colEstado: {
        width: 80,
    },
    colCidade: {
        flex: 1,
    },
    passwordContainer: {
        marginBottom: 16,
    },
    inputWrap: {
        position: 'relative',
    },
    eyeBtn: {
        position: 'absolute',
        right: 12,
        top: 10,  // Ajuste esse valor conforme necessário
        padding: 4,
        zIndex: 1,
    },
    eyeText: {
        fontSize: 16,  // Ajuste o tamanho
        color: '#666',
    },
    button: {
        backgroundColor: '#F4A261',
        paddingVertical: 16,
        borderRadius: 40,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#F4A261',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.5,
        shadowOpacity: 0,
        backgroundColor: '#D1D5DB',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    link: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    linkBold: {
        color: '#F4A261',
        fontWeight: '700',
    },
    msg: {
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 13,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    success: {
        color: '#059669',
        backgroundColor: '#ECFDF5',
    },
    error: {
        color: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    info: {
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
    },
});

export const appScreenStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    /* ── HEADER ── */
    header: {
        paddingTop: 54,
        paddingBottom: 18,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    appName: {
        fontSize: 26,
        fontWeight: '900',
        color: '#F4A261',
        letterSpacing: -0.5,
    },
    appSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#BBBBBB',
        marginTop: 2,
        letterSpacing: 0.2,
    },

    /* ── FILTROS ── */
    filterScroll: { flexGrow: 0 },
    filterContent: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
    },
    filterChip: {
        borderWidth: 1.5,
        borderColor: '#ECECEC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 7,
        backgroundColor: '#FAFAFA',
    },
    filterChipActive: {
        borderColor: '#F4A261',
        backgroundColor: '#FFF5EE',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#AAAAAA',
    },
    filterTextActive: {
        color: '#F4A261',
    },

    /* ── CONTAGEM ── */
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#AAAAAA',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },

    /* ── LISTA ── */
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 24 },

    /* ── FOOTER ── */
    footer: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        paddingBottom: 32,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        alignItems: 'center',
        gap: 10,
    },
    footerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CCCCCC',
        letterSpacing: 0.3,
    },
    denunciaBtn: {
        width: '100%',
        backgroundColor: '#F4A261',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F4A261',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    denunciaBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
});

export const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 8,
    },
    colorBar: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: { fontSize: 52 },
    body: { padding: 16 },
    name: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    locationIcon: { fontSize: 12 },
    location: { fontSize: 12, color: '#888', fontWeight: '500' },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 14,
    },
    tag: {
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    goalLabel: {
        fontSize: 11,
        color: '#aaa',
        marginBottom: 8,
        fontWeight: '500',
    },
    barBg: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 99,
        overflow: 'hidden',
        marginBottom: 8,
    },
    barFill: { height: 8, borderRadius: 99 },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalCurrent: { fontSize: 13, fontWeight: '700' },
    goalTotal: { fontSize: 12, color: '#bbb' },
    donateBtn: {
        borderRadius: 14,
        paddingVertical: 13,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    donateBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});