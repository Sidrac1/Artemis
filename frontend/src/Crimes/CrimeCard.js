import React from 'react';
import { View, Text } from 'react-native';

const CrimeCard = ({ item }) => (
  <View style={styles.crimeCard}>
    <Text style={styles.cardTitle}>{item["Tipo de delito"]} - {item["Subtipo de delito"]}</Text>
    <Text style={styles.cardDetail}>Modalidad: {item.Modalidad}</Text>
    <Text style={styles.cardDetail}>Bien jurídico: {item["Bien jurídico afectado"]}</Text>
    <Text style={styles.cardDetail}>Entidad: {item.Entidad}</Text>
    <Text style={styles.cardDetail}>Municipio: {item.Municipio}</Text>
    <View style={styles.statsRow}>
      <Text style={styles.statItem}>Enero: {item.Enero}</Text>
      <Text style={styles.statItem}>Febrero: {item.Febrero}</Text>
      <Text style={styles.statItem}>
        Total: {parseInt(item.Enero || "0") + parseInt(item.Febrero || "0")}
      </Text>
    </View>
  </View>
);

const styles = {
  crimeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    height: "20%",
    width: "25%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  cardDetail: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  statItem: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  }
};

export default CrimeCard;