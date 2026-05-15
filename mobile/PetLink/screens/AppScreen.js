import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';

import { appScreenStyles as styles } from '../style/styles';
import { InstitutionCard, institutions } from '../components/cards';

export default function AppScreen({ navigation }) {

    const [filtro, setFiltro] = useState('Todos');

    const filtros = [
        'Todos',
        'Cães',
        'Gatos',
        'Silvestres',
        'Próximos'
    ];

    const instituicoesFiltradas =
        filtro === 'Todos'
            ? institutions
            : institutions.filter(i => i.tags.includes(filtro));

    return (
        <View style={styles.container}>

            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFF"
            />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.appName}>PetLink 🐾</Text>
                <Text style={styles.appSubtitle}>Encontre quem precisa de você</Text>
            </View>

            {/* FILTROS */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                {filtros.map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterChip,
                            {
                                instituicoesFiltradas.map(item => (
                                    <InstitutionCard
                                        key={item.id}
                                        item={item}
                                        onDonate={() => navigation.navigate('Doacao', { institution: item })}
                                    />
                                ))
                            }
                        ]}
                        onPress={() => setFiltro(f)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filtro === f && styles.filterTextActive
                            ]}
                        >
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* CONTAGEM */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {instituicoesFiltradas.length} instituições encontradas
                </Text>
            </View>

            {/* LISTA */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {instituicoesFiltradas.map(item => (
                    <InstitutionCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.footerLabel}>Viu algo errado?</Text>
                <TouchableOpacity
                    style={styles.denunciaBtn}
                    onPress={() => navigation.navigate('Denuncia')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.denunciaBtnText}>🚨 Fazer Denúncia</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}