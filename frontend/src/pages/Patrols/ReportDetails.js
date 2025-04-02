import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderTitleBox from '../../components/HeaderTitleBoxID';
import ActivePatrolCard from '../../components/PatrolDetailsCard';
import { getRondas } from '../../api/Ronda'; // Asegúrate de la ruta correcta

const PatrolReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ID } = route.params;

  const [patrolData, setPatrolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatrolData = async () => {
      try {
        setLoading(true);
        setError(null); // Limpiar cualquier error previo
        console.log('Fetching data for ID:', ID);
        const data = await getRondas(ID);
        console.log('Data from getRondas:', data);
        setPatrolData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patrol details:', err);
        setError('Error al obtener los detalles de la ronda.');
        setLoading(false);
        setPatrolData(null); // Asegurar que patrolData sea null en caso de error
      }
    };

    if (ID) {
      fetchPatrolData();
    } else {
      console.warn('No ID provided in route params.');
      setError('No se proporcionó un ID válido.');
      setLoading(false);
      setPatrolData(null);
    }
  }, [ID]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#bfa182" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <HeaderTitleBox iconName="file-alt" text={`Detalles del Reporte ${ID}`} id={ID} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!patrolData) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <HeaderTitleBox iconName="file-alt" text={`Detalles del Reporte ${ID}`} id={ID} />
        <Text>No se encontraron detalles para esta ronda.</Text>
      </View>
    );
  }

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
    paddingTop: 55,
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
    zIndex: 1,
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
  errorText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});

export default PatrolReportDetails;