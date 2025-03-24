import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, CheckBox } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const RouteForm = ({ onSubmit }) => {
  const [routeName, setRouteName] = useState('');
  const [frequency, setFrequency] = useState('15 Minutes');
  const [startDate, setStartDate] = useState('12/03/2025 - 22:00');
  const [endDate, setEndDate] = useState('13/03/2025 - 06:00');
  const [selectedSectors, setSelectedSectors] = useState({});
  const [sectorOrder, setSectorOrder] = useState([]);
  const [sectorInput, setSectorInput] = useState('');

  const sectors = ['Sector A', 'Sector B', 'Sector C', 'Sector D'];

  const toggleSector = (sector) => {
    const isSelected = selectedSectors[sector];
    if (isSelected) {
      setSelectedSectors({ ...selectedSectors, [sector]: false });
      setSectorOrder(sectorOrder.filter((s) => s !== sector));
    } else {
      setSelectedSectors({ ...selectedSectors, [sector]: true });
      setSectorOrder([...sectorOrder, sector]);
    }
    updateSectorInput();
  };

  const updateSectorInput = () => {
    const newInput = sectorOrder.join(' -> ');
    setSectorInput(newInput);
  };

  const handleSubmit = () => {
    onSubmit({
      routeName,
      frequency,
      startDate,
      endDate,
      selectedSectors: sectorOrder,
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

            {/* Sector Labels */}
            <TouchableOpacity style={[styles.sectorLabel, styles.topLeft]} onPress={() => toggleSector('Sector A')}>
              <Text style={styles.sectorName}>Sector A</Text>
              <CheckBox value={selectedSectors['Sector A'] || false} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sectorLabel, styles.topRight]} onPress={() => toggleSector('Sector B')}>
              <Text style={styles.sectorName}>Sector B</Text>
              <CheckBox value={selectedSectors['Sector B'] || false} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sectorLabel, styles.bottomLeft]} onPress={() => toggleSector('Sector C')}>
              <Text style={styles.sectorName}>Sector C</Text>
              <CheckBox value={selectedSectors['Sector C'] || false} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sectorLabel, styles.bottomRight]} onPress={() => toggleSector('Sector D')}>
              <Text style={styles.sectorName}>Sector D</Text>
              <CheckBox value={selectedSectors['Sector D'] || false} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Selected Sectors"
            placeholderTextColor="#aaa"
            value={sectorInput}
            editable={false}
          />

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
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'black',
  },
  card: {
    width: width * 0.25,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
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
    width: width * 0.14,
    height: width * 0.14,
  },
  sectorLabel: {
    position: 'absolute',
    alignItems: 'center',
    padding: 5,
    borderRadius: 5,
  },
  topLeft: {
    bottom: '1%',
    left: '52%',
  },
  topRight: {
    top: '24%',
    left: "12%",
  },
  bottomLeft: {
    top: '3%',
    right: '40%',
  },
  bottomRight: {
    right: '14%',
    top: '28%',
  },
  sectorName: {
    fontSize: 12,
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
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  guardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guardIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  guardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});


export default RouteForm;