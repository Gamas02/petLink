import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { cardStyles } from '../style/styles';

// Dados iniciais (caso não haja nada salvo)
const DEFAULT_INSTITUTIONS = [
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
        description: 'O Instituto Patinhas cuida de cães e gatos resgatados das ruas de São Paulo...',
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
        description: 'O Lar dos Bigodes é um abrigo especializado em gatos e coelhos abandonados...',
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
        description: 'O Refúgio Animal SP reabilita animais silvestres e cuida de cães...',
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
        description: 'A Casa dos Focinhos abriga cães, gatos e aves domésticas resgatadas...',
    },
];

// Estado mutável interno
let _institutions = [...DEFAULT_INSTITUTIONS];
let _listeners = [];

// Chave para AsyncStorage
const STORAGE_KEY = '@PetLink:institutions';

// Função para carregar dados salvos
async function loadFromStorage() {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
            _institutions = JSON.parse(json);
            _listeners.forEach(fn => fn(_institutions));
        } else {
            // Salva os dados padrão pela primeira vez
            await saveToStorage(_institutions);
        }
    } catch (error) {
        console.error('Erro ao carregar instituições:', error);
    }
}

// Salvar no AsyncStorage
async function saveToStorage(data) {
    try {
        const json = JSON.stringify(data);
        await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
        console.error('Erro ao salvar instituições:', error);
    }
}

// Carrega automaticamente ao iniciar o módulo
loadFromStorage();

// Função para adicionar nova instituição
export async function addInstitution(novaOng) {
    const nova = {
        id: String(Date.now()),
        name: novaOng.name,
        location: novaOng.location,
        address: novaOng.address || 'Endereço não informado',
        emoji: novaOng.emoji || '🐾',
        tags: novaOng.tags || [],
        goal: novaOng.goal || { current: 0, total: 50 },
        color: novaOng.color || '#F4A261',
        tagBg: novaOng.tagBg || '#FEF0E6',
        tagText: novaOng.tagText || '#7C4A1A',
        description: novaOng.description || 'Descrição em breve...',
    };
    _institutions = [..._institutions, nova];
    await saveToStorage(_institutions);
    _listeners.forEach(fn => fn(_institutions));
}

// Hook para componentes React
export function useInstitutions() {
    const [list, setList] = useState(_institutions);

    useEffect(() => {
        // Registra o listener
        _listeners.push(setList);
        // Força uma atualização caso os dados já tenham mudado
        setList(_institutions);

        return () => {
            _listeners = _listeners.filter(fn => fn !== setList);
        };
    }, []);

    return list;
}

// Componente do card (corrigido para segurança)
export function InstitutionCard({ item, onDonate }) {
    const current = item.goal?.current ?? 0;
    const total = item.goal?.total ?? 1;
    const progress = current / total;
    const percent = Math.min(100, Math.round(progress * 100));

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
                        {current} adoções
                    </Text>
                    <Text style={cardStyles.goalTotal}>meta: {total}</Text>
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