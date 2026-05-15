import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

export default function DoacaoScreen({ route, navigation }) {
    const { institution } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={institution.color} />

            {/* HERO */}
            <View style={[styles.hero, { backgroundColor: institution.color }]}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.backBtnText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.heroEmoji}>{institution.emoji}</Text>
                <Text style={styles.heroName}>{institution.name}</Text>

                {/* Tags */}
                <View style={styles.tagsRow}>
                    {institution.tags.map((tag) => (
                        <Text key={tag} style={styles.heroTag}>{tag}</Text>
                    ))}
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* LOCALIZAÇÃO */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>📍 Localização</Text>
                    <Text style={styles.sectionTitle}>{institution.location}</Text>
                    <Text style={styles.sectionBody}>{institution.address}</Text>
                </View>

                <View style={styles.divider} />

                {/* DESCRIÇÃO / O QUE ACEITA */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>💛 Como ajudar</Text>
                    <Text style={styles.descriptionText}>{institution.description}</Text>
                </View>

                <View style={styles.divider} />

                {/* PROGRESSO */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>🎯 Meta de adoções — junho</Text>
                    <View style={styles.barBg}>
                        <View
                            style={[
                                styles.barFill,
                                {
                                    width: `${Math.round((institution.goal.current / institution.goal.total) * 100)}%`,
                                    backgroundColor: institution.color,
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.goalRow}>
                        <Text style={[styles.goalCurrent, { color: institution.color }]}>
                            {institution.goal.current} adoções realizadas
                        </Text>
                        <Text style={styles.goalTotal}>meta: {institution.goal.total}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },

    /* ── HERO ── */
    hero: {
        paddingTop: 54,
        paddingBottom: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    backBtn: {
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    backBtnText: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '700',
    },
    heroEmoji: { fontSize: 56, marginBottom: 10 },
    heroName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    heroTag: {
        backgroundColor: 'rgba(255,255,255,0.22)',
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: 'hidden',
    },

    /* ── SCROLL ── */
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40 },

    /* ── SEÇÕES ── */
    section: { paddingHorizontal: 20, paddingVertical: 20 },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#AAAAAA',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    sectionBody: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500',
    },
    descriptionText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
        fontWeight: '400',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
    },

    /* ── PROGRESSO ── */
    barBg: {
        height: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 99,
        overflow: 'hidden',
        marginBottom: 10,
        marginTop: 8,
    },
    barFill: { height: 10, borderRadius: 99 },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    goalCurrent: { fontSize: 13, fontWeight: '700' },
    goalTotal: { fontSize: 12, color: '#BBB' },
});