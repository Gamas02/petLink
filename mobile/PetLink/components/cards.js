import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const institutions = [
    {
        id: '1',
        name: 'Instituto Patinhas',
        location: 'São Paulo, SP',
        emoji: '🐕',
        tags: ['Cães', 'Gatos'],
        goal: { current: 36, total: 50 },
        color: '#1D9E75',
        tagBg: '#E1F5EE',
        tagText: '#085041',
    },
    {
        id: '2',
        name: 'Lar dos Bigodes',
        location: 'Campinas, SP',
        emoji: '🐈',
        tags: ['Gatos', 'Coelhos'],
        goal: { current: 18, total: 40 },
        color: '#7F77DD',
        tagBg: '#EEEDFE',
        tagText: '#3C3489',
    },
    {
        id: '3',
        name: 'Refúgio Animal SP',
        location: 'Ribeirão Preto, SP',
        emoji: '🦜',
        tags: ['Cães', 'Silvestres'],
        goal: { current: 27, total: 30 },
        color: '#D85A30',
        tagBg: '#FAECE7',
        tagText: '#712B13',
    },
    {
        id: '4',
        name: 'Casa dos Focinhos',
        location: 'São Paulo, SP',
        emoji: '🐾',
        tags: ['Cães', 'Gatos', 'Aves'],
        goal: { current: 29, total: 50 },
        color: '#378ADD',
        tagBg: '#E6F1FB',
        tagText: '#0C447C',
    },
];

export function InstitutionCard({ item }) {
    const progress = item.goal.current / item.goal.total;
    const percent = Math.round(progress * 100);

    return (
        <View style={cardStyles.card}>
            {/* Faixa colorida no topo */}
            <View style={[cardStyles.colorBar, { backgroundColor: item.color }]}>
                <Text style={cardStyles.emoji}>{item.emoji}</Text>
            </View>

            <View style={cardStyles.body}>
                {/* Nome e localização */}
                <Text style={cardStyles.name}>{item.name}</Text>
                <View style={cardStyles.locationRow}>
                    <Text style={cardStyles.locationIcon}>📍</Text>
                    <Text style={cardStyles.location}>{item.location}</Text>
                </View>

                {/* Tags */}
                <View style={cardStyles.tagsRow}>
                    {item.tags.map((tag) => (
                        <Text
                            key={tag}
                            style={[cardStyles.tag, { backgroundColor: item.tagBg, color: item.tagText }]}
                        >
                            {tag}
                        </Text>
                    ))}
                </View>

                {/* Divisor */}
                <View style={cardStyles.divider} />

                {/* Progresso */}
                <Text style={cardStyles.goalLabel}>Meta de adoções — junho</Text>
                <View style={cardStyles.barBg}>
                    <View
                        style={[
                            cardStyles.barFill,
                            { width: `${percent}%`, backgroundColor: item.color },
                        ]}
                    />
                </View>
                <View style={cardStyles.goalRow}>
                    <Text style={[cardStyles.goalCurrent, { color: item.color }]}>
                        {item.goal.current} adoções
                    </Text>
                    <Text style={cardStyles.goalTotal}>meta: {item.goal.total}</Text>
                </View>
            </View>
        </View>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        // sombra iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        // sombra Android
        elevation: 8,
    },
    colorBar: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 52,
    },
    body: {
        padding: 16,
    },
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
    locationIcon: {
        fontSize: 12,
    },
    location: {
        fontSize: 12,
        color: '#888',
        fontWeight: '500',
    },
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
    barFill: {
        height: 8,
        borderRadius: 99,
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    goalCurrent: {
        fontSize: 13,
        fontWeight: '700',
    },
    goalTotal: {
        fontSize: 12,
        color: '#bbb',
    },
});