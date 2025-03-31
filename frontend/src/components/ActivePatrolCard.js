import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ActivePatrolCard = ({ patrolData }) => {
  // Transformar el campo 'sectors' a un formato "A -> B -> C"
  const formattedSectors = patrolData.sectors
    .split(' ') // Dividir los sectores por espacios
    .join(' -> '); // Unirlos con " -> "

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <View style={styles.fieldContainer}>
            <Ionicons name="map" size={24} color="black" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>ROUTE NAME</Text>
            <TextInput
              style={styles.input}
              value={patrolData.nombre}
              editable={false}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Ionicons name="person" size={24} color="black" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>GUARD</Text>
            <TextInput
              style={styles.input}
              value={patrolData.guard}
              editable={false}
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeSubContainer}>
              <Ionicons name="time" size={24} color="black" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>START</Text>
              <TextInput
                style={[styles.input, styles.dateInput]}
                value={patrolData.start}
                editable={false}
              />
            </View>
            <View style={styles.dateTimeSubContainer}>
              <Text style={[styles.fieldText, styles.endText]}>END</Text> 
              <TextInput
                style={[styles.input, styles.dateInput]}
                value={patrolData.end}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Ionicons name="flag" size={24} color="black" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>SECTORS</Text>
            <TextInput
              style={styles.input}
              value={formattedSectors}  // Mostrar los sectores formateados
              editable={false}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Ionicons name="refresh" size={24} color="black" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>FREQUENCY</Text>
            <TextInput
              style={styles.input}
              value={patrolData.frequency}
              editable={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#faf9f9',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  outerContainer: {
    backgroundColor: '#e6ddcc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  card: {
    width: width * 0.5,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldIcon: {
    marginRight: 8,
    width: 24,
    alignItems: 'center',
  },
  fieldText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6, // Default marginRight
    width: 90, // Default width
  },
  endText: { // Styles for 'END' text only
    marginRight: 5,
    width: 30,
  },
  input: {
    flex: 1,
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 6,
    borderRadius: 6,
    fontSize: 12,
    backgroundColor: '#f9f9f9',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  dateTimeSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  dateInput: {
    fontSize: 12,
    paddingHorizontal: 4,
    height: 30,
  },
});

export default ActivePatrolCard;
