import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const EstadoModal = ({ visible, estado, onClose, highestCrimes, crimeDataByState, crimeData }) => {
  // Si no hay estado seleccionado, no mostrar el modal
  if (!estado) {
    return null;
  }

  const totalIncidents = crimeDataByState[estado] || 0;
  const highestCrime = highestCrimes[estado];

  // Función para calcular la modalidad más frecuente
  const calculateMostFrequentModality = () => {
    if (!crimeData || !estado) return null;
    
    const modalitiesCount = {};
    
    // Filtrar los crímenes del estado seleccionado
    const stateCrimes = crimeData.filter(item => item.Entidad === estado);
    
    // Contar las modalidades
    stateCrimes.forEach(crime => {
      const modality = crime.Modalidad;
      const incidents = parseInt(crime.Enero || 0) + parseInt(crime.Febrero || 0);
      
      if (!modalitiesCount[modality]) {
        modalitiesCount[modality] = 0;
      }
      modalitiesCount[modality] += incidents;
    });
    
    // Encontrar la modalidad con más incidentes
    let mostFrequentModality = null;
    let maxCount = 0;
    
    Object.keys(modalitiesCount).forEach(modality => {
      if (modalitiesCount[modality] > maxCount) {
        maxCount = modalitiesCount[modality];
        mostFrequentModality = modality;
      }
    });
    
    return mostFrequentModality ? { modality: mostFrequentModality, count: maxCount } : null;
  };

  const mostFrequentModality = calculateMostFrequentModality();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{estado}</Text>
          <Text style={styles.modalText}>Total de incidentes: {totalIncidents}</Text>
          
          {highestCrime ? (
            <Text style={styles.modalText}>
              Delito más frecuente: {highestCrime.crime} ({highestCrime.count} incidentes)
            </Text>
          ) : (
            <Text style={styles.modalText}>No se encontraron datos de delitos frecuentes para este estado.</Text>
          )}
          
          {mostFrequentModality ? (
            <Text style={styles.modalText}>
              Modalidad más frecuente: {mostFrequentModality.modality} ({mostFrequentModality.count} incidentes)
            </Text>
          ) : (
            <Text style={styles.modalText}>No se encontraron datos de modalidades para este estado.</Text>
          )}
          
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default EstadoModal;