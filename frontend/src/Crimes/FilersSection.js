import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FiltersSection = ({
  selectedJuridical,
  setSelectedJuridical,
  selectedCrimeType,
  setSelectedCrimeType,
  selectedState,
  setSelectedState,
  selectedPeriod,
  setSelectedPeriod,
  uniqueJuridicalGoods,
  uniqueCrimeTypes,
  uniqueStates,
  selectedModality,
  setSelectedModality,
  uniqueModalities,
  aplicarFiltros
}) => (
  <View style={styles.filtersContainer}>
    <Text style={styles.sectionTitle}>Filtros</Text>
    
    <FilterRow 
      label="Bien jurídico:"
      selectedValue={selectedJuridical}
      onValueChange={setSelectedJuridical}
      items={uniqueJuridicalGoods}
    />
    
    <FilterRow 
      label="Tipo de delito:"
      selectedValue={selectedCrimeType}
      onValueChange={setSelectedCrimeType}
      items={uniqueCrimeTypes}
    />
    
    <FilterRow 
      label="Entidad:"
      selectedValue={selectedState}
      onValueChange={setSelectedState}
      items={uniqueStates}
    />
    <FilterRow
      label="Modalidad:"
      selectedValue={selectedModality}
      onValueChange={setSelectedModality}
      items={uniqueModalities}
    />
    
    <View style={styles.filterRow}>
      <Text style={styles.filterLabel}>Periodo:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedPeriod}
          style={styles.picker}
          onValueChange={setSelectedPeriod}
        >
          <Picker.Item label="Todos" value="all" />
          <Picker.Item label="Enero" value="Enero" />
          <Picker.Item label="Febrero" value="Febrero" />
        </Picker>
      </View>
    </View>
    
    <TouchableOpacity style={styles.applyButton} onPress={aplicarFiltros}>
      <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
    </TouchableOpacity>
  </View>
);

const FilterRow = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.filterRow}>
    <Text style={styles.filterLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={onValueChange}
      >
        <Picker.Item label={label.startsWith('Entidad') ? 'Todas' : 'Todos'} value="" />
        {items && items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </View>
  </View>
);

const styles = {
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#495057',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    width: '30%',
    fontSize: 16,
    color: '#495057',
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  applyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
};

export default FiltersSection;