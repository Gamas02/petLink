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

export default function AppScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F4A261" />
            <View style={styles.appBack}>
                <Text style={appStyles.sectionLabel}>PetLink</Text>
            </View>

            <ScrollView
                style={appStyles.scroll}
                contentContainerStyle={appStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {institutions.map((item) => (
                    <InstitutionCard key={item.id} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}