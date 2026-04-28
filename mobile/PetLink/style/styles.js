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
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    appBack: {
        backgroundColor: '#f4A261',
        width: '100%',
        padding: 20,
        paddingTop: 30,
        borderBottomRightRadius: 36,
        borderBottomWidth: 3,
        borderBottomColor: '#00000015',
    },
    sectionLabel: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '700',
        letterSpacing: 0.8,
    },
    scroll: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
});