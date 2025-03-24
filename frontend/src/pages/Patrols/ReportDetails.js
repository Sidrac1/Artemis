import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderTitleBox from '../../components/HeaderTitleBox'; // Importa HeaderTitleBox

const PatrolReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ID, NAME, DATE } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <HeaderTitleBox iconName="file-alt" text="Detalles del Reporte" /> {/* Usa HeaderTitleBox */}

      <View style={styles.detailContainer}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{ID}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{NAME}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{DATE}</Text>
      </View>

      {/* Aquí puedes agregar más detalles del reporte */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
    width: 80,
  },
  value: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'black',
  },
});

export default PatrolReportDetails;