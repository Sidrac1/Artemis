import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const RouteForm = ({ onSubmit }) => {
  const [routeName, setRouteName] = useState('');
  const [frequency, setFrequency] = useState('15 Minutes');
  const [startDate, setStartDate] = useState('12/03/2025 - 22:00');
  const [endDate, setEndDate] = useState('13/03/2025 - 06:00');

  const handleSubmit = () => {
    onSubmit({
      routeName,
      frequency,
      startDate,
      endDate,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            placeholderTextColor="#aaa"
            value={routeName}
            onChangeText={setRouteName}
          />

          <View style={styles.sectorsContainer}>
            <Image
              source={require('../assets/images/maqueta.jpg')}
              style={styles.houseImage}
              resizeMode="contain"
            />
            <View style={styles.sectorLabelContainer}>
              <Text style={[styles.sectorLabel, { top: '30%', left: '5%' }]}>2 {'\n'}B</Text>
              <Text style={[styles.sectorLabel, { top: '5%', left: '30%' }]}>C {'\n'}3</Text>
              <Text style={[styles.sectorLabel, { top: '5%', right: '10%' }]}>D {'\n'}4</Text>
              <Text style={[styles.sectorLabel, { bottom: '10%', right: '15%' }]}>1 {'\n'}A</Text>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              style={styles.picker}
              onValueChange={(itemValue) => setFrequency(itemValue)}
            >
              <Picker.Item label="< SELECT FREQUENCY > (15 Minutes)" value="15 Minutes" />
              <Picker.Item label="30 Minutes" value="30 Minutes" />
              <Picker.Item label="1 Hour" value="1 Hour" />
            </Picker>
          </View>

          <View style={styles.dateTimeContainer}>
            <TextInput
              style={styles.dateTimeInput}
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.dateTimeInput}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
            <Text style={styles.finishButtonText}>FINISH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: height * 0.02,
  },
  outerContainer: {
    backgroundColor: '#e6ddcc',
    borderRadius: 10,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'black',
  },
  card: {
    width: width * 0.6,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  sectorsContainer: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  houseImage: {
    width: width * 0.1,
    height: width * 0.1,
  },
  sectorLabelContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sectorLabel: {
    position: 'absolute',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#000',
    fontSize: 14,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateTimeInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginRight: 5,
  },
  finishButton: {
    backgroundColor: '#e6ddcc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'black',
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default RouteForm;