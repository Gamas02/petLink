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
                barStyle="light-content"
                backgroundColor="#F4A261"
            />

            {/* HEADER */}
            <View style={styles.appBack}>
                <View style={styles.headerTop}>
                    <Text style={styles.appName}>
                        PetLink 🐾
                    </Text>
                </View>
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
                            filtro === f && styles.filterChipActive
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

            {/* HEADER */}
            <View style={styles.appBack}>
                <View style={styles.headerTop}>
                    {/* BOTÃO */}
                    <TouchableOpacity
                        style={styles.denuncia}
                        onPress={() => navigation.navigate('Denuncia')}
                    >
                        <Text style={styles.primaryButtonText}>
                            Denunciar
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}