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