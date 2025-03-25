import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import HeaderTitleBox from '../../components/HeaderTitleBoxID';
import ActivePatrolCard from '../../components/PatrolDetailsCard';

const PatrolReportDetails = ({ route }) => {
  const navigation = useNavigation();
  const { ID, NAME, DATE } = route.params;

  const patrolData = {
    routeName: 'Warehouse Patrol',
    guardName: 'John Doe',
    startDate: '2024-03-16 08:00',
    endDate: '2024-03-16 12:00',
    sectors: 'Sector A, Sector B',
    frequency: 'Daily',
  };

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
});

export default PatrolReportDetails;