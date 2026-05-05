import 'react-native-gesture-handler';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { appScreenStyles as styles } from '../style/styles';
import { InstitutionCard, institutions } from '../components/cards';

export default function AppScreen({ navigation }) {
    const [filtro, setFiltro] = useState('Todos');
    const filtros = ['Todos', 'Cães', 'Gatos', 'Silvestres', 'Próximos'];

    const instituicoesFiltradas = filtro === 'Todos'
        ? institutions
        : institutions.filter(i => i.tags.includes(filtro));

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F4A261" />

            {/* Header com busca */}
            <View style={styles.appBack}>
                <View style={styles.headerTop}>
                    <Text style={styles.appName}>PetLink 🐾</Text>
                </View>
            </View>

            {/* Filtros */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
                {filtros.map(f => (
                    <TouchableOpacity key={f}
                        style={[styles.filterChip, filtro === f && styles.filterChipActive]}
                        onPress={() => setFiltro(f)}>
                        <Text style={[styles.filterText, filtro === f && styles.filterTextActive]}>
                            {f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Contagem */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {instituicoesFiltradas.length} instituições encontradas
                </Text>
            </View>

            {/* Lista */}
            <ScrollView style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                {instituicoesFiltradas.map(item => (
                    <InstitutionCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}