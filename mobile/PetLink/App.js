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

import AppScreen from './screens/AppScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

/* ───────────── WAVES ───────────── */
function TopWave() {
  return (
    <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveTop}>
      <Path
        d={`M0,0 L${width},0 L${width},140 C${width * 0.75},220 ${width * 0.25},220 0,140 Z`}
        fill="#F4A261"
      />
    </Svg>
  );
}

function BottomWave() {
  return (
    <Svg width={width} height={220} viewBox={`0 0 ${width} 220`} style={styles.waveBottom}>
      <Path
        d={`M0,220 L${width},220 L${width},80 C${width * 0.75},0 ${width * 0.25},0 0,80 Z`}
        fill="#E9C46A"
      />
    </Svg>
  );
}

/* ───────────── INSTITUTIONS DATA ───────────── */
const institutions = [
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

/* ───────────── INSTITUTION CARD ───────────── */
function InstitutionCard({ item }) {
  const progress = item.goal.current / item.goal.total;
  const percent = Math.round(progress * 100);

  return (
    <View style={cardStyles.card}>
      <View style={[cardStyles.imageArea, { backgroundColor: item.tagBg }]}>
        <Text style={cardStyles.emoji}>{item.emoji}</Text>
      </View>
      <View style={cardStyles.body}>
        <Text style={cardStyles.name}>{item.name}</Text>
        <View style={cardStyles.locationRow}>
          <View style={[cardStyles.dot, { backgroundColor: item.color }]} />
          <Text style={cardStyles.location}>{item.location}</Text>
        </View>
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
          <Text style={cardStyles.goalCurrent}>{item.goal.current} adoções</Text>
          <Text style={cardStyles.goalTotal}>meta: {item.goal.total}</Text>
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
      </View>
    </View>
  );
}

/* ───────────── MAIN APP ───────────── */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registrar-se" component={RegisterScreen} />
        <Stack.Screen name="App" component={AppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ───────────── STYLES ───────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveTop: { position: 'absolute', top: 0, left: 0 },
  waveBottom: { position: 'absolute', bottom: 0, left: 0 },
  content: { alignItems: 'center', zIndex: 1 },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#F4A261',
    marginBottom: 40,
  },
  buttonGroup: { width: 240, gap: 14 },
  primaryButton: {
    backgroundColor: '#F4A261',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#F4A261',
    padding: 13,
    borderRadius: 30,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButtonText: { color: '#F4A261', fontWeight: '700' },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 22,
    padding: 8,
  },
  button: {
    backgroundColor: '#F4A261',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700' },
  signup: {
    textAlign: 'center',
    marginTop: 16,
    color: '#F4A261',
  },
  msg: {
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  success: { color: 'green' },
  error: { color: 'red' },

  appBack: {
    backgroundColor: '#fa810fd7',
    width: '100%',
    padding: 20,
    paddingTop: 30,
    borderBottomRightRadius: 36,
    borderBottomWidth: 3,
    borderBottomColor: '#00000015'
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  imageArea: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  body: { padding: 14 },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dot: { width: 7, height: 7, borderRadius: 99 },
  location: { fontSize: 12, color: '#888' },
  goalLabel: { fontSize: 11, color: '#999', marginBottom: 6 },
  barBg: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: { height: 6, borderRadius: 99 },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  goalCurrent: { fontSize: 12, fontWeight: '600', color: '#333' },
  goalTotal: { fontSize: 12, color: '#aaa' },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    fontSize: 11,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

const appStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
