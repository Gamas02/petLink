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

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#F4A261" />
            <TopWave />
            <BottomWave />

            <View style={styles.content}>
                <Text style={{ fontSize: 52 }}>🐾</Text>
                <Text style={styles.appName}>PET LINK</Text>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Registrar-se')}>
                        <Text style={styles.secondaryButtonText}>Registrar-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}