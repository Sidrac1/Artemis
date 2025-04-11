import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const HighestCrimesSection = ({ highestCrimes, handlePressEstado }) => (
  <View style={styles.highestCrimesContainer}>
    <Text style={styles.sectionTitle}>Delitos con Mayor Incidencia por Estado</Text>
    <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled={true}>
      {Object.keys(highestCrimes).map((state, index) => (
        <TouchableOpacity key={index} onPress={() => handlePressEstado(state)}>
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>{state}</Text>
            <Text style={styles.stateDetail}>
              Delito principal: {highestCrimes[state].crime} ({highestCrimes[state].count} incidentes)
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = {
  highestCrimesContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '48%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  stateCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f4f4f4'
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  stateDetail: {
    fontSize: 16,
    color: '#666'
  }
};

export default HighestCrimesSection;