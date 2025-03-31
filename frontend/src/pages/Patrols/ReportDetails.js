import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderTitleBox from '../../components/HeaderTitleBoxID';
import ActivePatrolCard from '../../components/PatrolDetailsCard';
import { getRondas } from '../../api/Ronda';  // Importa correctamente la función desde Ronda.js

const PatrolReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ID } = route.params;

  const [patrolData, setPatrolData] = useState(null);  // Estado para los detalles de la ronda
  const [loading, setLoading] = useState(true);  // Estado de carga

  useEffect(() => {
    // Función para obtener los detalles del reporte
    const fetchPatrolData = async () => {
      try {
        setLoading(true);
        const data = await getRondas(ID);  // Llamada a la función getRondas usando el ID
        console.log('Datos de la ronda:', data);
        setPatrolData(data);  // Aquí actualizamos patrolData

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los detalles de la ronda:', error);
        setLoading(false);
      }
    };

    fetchPatrolData();
  }, [ID]);  // Solo se ejecuta cuando el ID cambia

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bfa182" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  if (!patrolData) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron detalles para esta ronda.</Text>
      </View>
    );
  }

  // Si los datos se cargaron correctamente, mostrar los detalles
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <HeaderTitleBox iconName="file-alt" text={`Detalles del Reporte ${ID}`} id={ID} />

      <ActivePatrolCard patrolData={patrolData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default PatrolReportDetails;
