import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';

import { appScreenStyles as styles } from '../style/styles';
import { InstitutionCard, institutions } from '../components/cards';

export default function AppScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F4A261" />
            <View style={styles.appBack}>
                <Text style={styles.sectionLabel}>PetLink</Text>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {institutions.map((item) => (
                    <InstitutionCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}