import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { cardStyles } from '../style/styles';


export const institutions = [
    {
        id: '1',
        name: 'Instituto Patinhas',
        location: 'São Paulo, SP',
        address: 'Rua das Flores, 123 — Vila Madalena',
        emoji: '🐕',
        tags: ['Cães', 'Gatos'],
        goal: { current: 36, total: 50 },
        color: '#1D9E75',
        tagBg: '#E1F5EE',
        tagText: '#085041',
        description:
            'O Instituto Patinhas cuida de cães e gatos resgatados das ruas de São Paulo. Aceitamos doações de ração seca para cães e gatos, medicamentos veterinários, coleiras, guias e cobertores. Você também pode ajudar contribuindo com o transporte dos animais para consultas.',
    },
    {
        id: '2',
        name: 'Lar dos Bigodes',
        location: 'Campinas, SP',
        address: 'Av. Brasil, 540 — Centro',
        emoji: '🐈',
        tags: ['Gatos', 'Coelhos'],
        goal: { current: 18, total: 40 },
        color: '#7F77DD',
        tagBg: '#EEEDFE',
        tagText: '#3C3489',
        description:
            'O Lar dos Bigodes é um abrigo especializado em gatos e coelhos abandonados. Precisamos de ração para gatos, feno para coelhos, caixas de transporte, areia higiênica e brinquedos. Voluntários para socialização dos animais também são muito bem-vindos.',
    },
    {
        id: '3',
        name: 'Refúgio Animal SP',
        location: 'Ribeirão Preto, SP',
        address: 'Estrada Rural KM 12 — Zona Norte',
        emoji: '🦜',
        tags: ['Cães', 'Silvestres'],
        goal: { current: 27, total: 30 },
        color: '#D85A30',
        tagBg: '#FAECE7',
        tagText: '#712B13',
        description:
            'O Refúgio Animal SP reabilita animais silvestres e cuida de cães em situação de risco. Aceitamos frutas frescas, sementes, ração premium para cães, luvas cirúrgicas, seringas e itens de primeiros socorros veterinários.',
    },
    {
        id: '4',
        name: 'Casa dos Focinhos',
        location: 'São Paulo, SP',
        address: 'Rua Harmonia, 88 — Pinheiros',
        emoji: '🐾',
        tags: ['Cães', 'Gatos', 'Aves'],
        goal: { current: 29, total: 50 },
        color: '#378ADD',
        tagBg: '#E6F1FB',
        tagText: '#0C447C',
        description:
            'A Casa dos Focinhos abriga cães, gatos e aves domésticas resgatadas. Doações aceitas incluem ração para cães e gatos, gaiolas e poleiros, vermífugos, antibióticos veterinários e toalhas usadas para forração. Visitas de voluntários aos finais de semana são incentivadas.',
    },
];

export function InstitutionCard({ item, onDonate }) {
    const progress = item.goal.current / item.goal.total;
    const percent = Math.round(progress * 100);

    return (
        <View style={cardStyles.card}>
            <View style={[cardStyles.colorBar, { backgroundColor: item.color }]}>
                <Text style={cardStyles.emoji}>{item.emoji}</Text>
            </View>

            <View style={cardStyles.body}>
                <Text style={cardStyles.name}>{item.name}</Text>
                <View style={cardStyles.locationRow}>
                    <Text style={cardStyles.locationIcon}>📍</Text>
                    <Text style={cardStyles.location}>{item.location}</Text>
                </View>

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

                <View style={cardStyles.divider} />

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

                <View style={[cardStyles.divider, { marginTop: 14 }]} />

                <TouchableOpacity
                    style={[cardStyles.donateBtn, { backgroundColor: item.color }]}
                    onPress={onDonate}
                    activeOpacity={0.85}
                >
                    <Text style={cardStyles.donateBtnText}>🤍 Doar para esta instituição</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
// Substitui o array estático por uma referência mutável + listener

let _institutions = [
    {
        id: '1',
        name: 'Instituto Patinhas',
        // ... dados originais iguais
    },
    // ... demais itens originais
];

let _listeners = [];

export function getInstitutions() {
    return _institutions;
}

export function addInstitution(novaOng) {
    const nova = {
        ...novaOng,
        id: String(Date.now()),           // id único
        goal: novaOng.goal ?? { current: 0, total: 50 },
        tags: novaOng.tags ?? [],
        emoji: novaOng.emoji ?? '🐾',
        color: novaOng.color ?? '#F4A261',
        tagBg: novaOng.tagBg ?? '#FEF0E6',
        tagText: novaOng.tagText ?? '#7C4A1A',
    };
    _institutions = [..._institutions, nova];
    _listeners.forEach(fn => fn(_institutions));
}

export function useInstitutions() {
    const [list, setList] = React.useState(_institutions);
    React.useEffect(() => {
        _listeners.push(setList);
        return () => { _listeners = _listeners.filter(fn => fn !== setList); };
    }, []);
    return list;
}

const institutions = useInstitutions();