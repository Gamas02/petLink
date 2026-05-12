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
    msg: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: '600',
    },
    success: { color: 'green' },
    error: { color: 'red' },
});

export const appScreenStyles = StyleSheet.create({
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    scroll: {
        flex: 1,
    },
    
    denuncia: {
        color: '#F4A261'
    },

    scrollContent: {
        paddingBottom: 40,
    },
    appName: {
        fontSize: 24,
        fontWeight: '900', color: '#F4A261'
    },
    notifBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
    searchBar: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 10, paddingHorizontal: 14 },
    searchText: { fontSize: 13, color: '#ccc', fontWeight: '600' },
    filterScroll: { flexGrow: 0 },
    filterContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    filterChip: { borderWidth: 1.5, borderColor: '#ECECEC', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#fff' },
    filterChipActive: { borderColor: '#F4A261', backgroundColor: '#FFF5EE' },
    filterText: { fontSize: 12, fontWeight: '700', color: '#aaa' },
    filterTextActive: { color: '#F4A261' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 6 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: '#1a1a1a' },
    sectionLink: { fontSize: 12, fontWeight: '700', color: '#F4A261' },
    fab: { position: 'absolute', bottom: 24, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#F4A261', alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#F4A261', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 },
    fabText: { color: '#fff', fontSize: 26, fontWeight: '300', lineHeight: 30 },
});