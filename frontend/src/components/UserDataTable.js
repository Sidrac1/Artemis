// UserDataTable.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput, ScrollView } from 'react-native';

const UsersDataTable = ({ data, navigation, navigateTo, idKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const flatListRef = useRef(null);

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const screenWidth = Dimensions.get('window').width;
  const moreButtonWidth = 250;

  const translateFilterRole = (role) => {
    switch (role) {
      case 'supervisor':
        return 'Supervisor';
      case 'guardia':
        return 'Guard';
      case 'empleado':
        return 'General Employee';
      default:
        return null;
    }
  };

  const filteredData = data.filter(item => {
    const fullName = `${item['Name'] || ''} ${item['Last Name'] || ''} ${item.apellido_materno ? item.apellido_materno : ''}`.toLowerCase().trim();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());

    const translatedSelectedRole = selectedRole ? translateFilterRole(selectedRole) : null;
    const roleMatch = translatedSelectedRole ? item['Role'] === translatedSelectedRole : true;

    return nameMatch && roleMatch;
  });

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header) => (
        <Text key={header} style={[styles.headerCell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)), paddingRight: (header === 'Role' || header === 'VIEW' ? 30 : 10) }]}>
          {header}
        </Text>
      ))}
      {headers.length > 0 && (
        <Text style={[styles.headerCell, { width: moreButtonWidth, paddingRight: 30 }]}>VIEW</Text>
      )}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {headers.map((header) => (
        <Text key={header} style={[styles.cell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)) }]}>
          {item[header]}
        </Text>
      ))}
      {headers.length > 0 && (
        <TouchableOpacity
  style={[styles.moreButton, { width: moreButtonWidth }]}
  onPress={() => {
    const employeeId = item['Employee ID']; // <---- EXTRAE EL ID USANDO LA CLAVE CORRECTA
    if (employeeId) {
      navigation.navigate(navigateTo, { employeeId: employeeId }); // <---- PASA SOLO EL employeeId
    } else {
      console.warn('Employee ID not found in data item:', item);
    }
  }}
>
  <Text style={styles.moreButtonText}>More</Text>
</TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <View style={styles.searchContainer}>
            <Text style={styles.filterLabel}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <View style={styles.roleContainer}>
            <Text style={styles.filterLabel}>Role</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.filterButton, selectedRole === null && styles.filterButtonSelected]} onPress={() => setSelectedRole(null)}>
                <Text>ALL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'supervisor' && styles.filterButtonSelected]} onPress={() => setSelectedRole('supervisor')}>
                <Text>SUPERVISOR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'guardia' && styles.filterButtonSelected]} onPress={() => setSelectedRole('guardia')}>
                <Text>GUARD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.filterButton, selectedRole === 'empleado' && styles.filterButtonSelected]} onPress={() => setSelectedRole('empleado')}>
                <Text>EMPLOYEE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.tableHeader}>
            {renderHeader()}
          </View>
          <View style={styles.tableBody}>
            <FlatList
              ref={flatListRef}
              data={filteredData || []}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
              decelerationRate="fast"
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={21}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
  },
  outerContainer: {
    backgroundColor: '#f5f1e6',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderWidth: 2,
    borderColor: 'black',
    width: '100%',
    height: 400,
  },
  container: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 20, 
    borderRadius: 8,
    borderWidth: 1,

    borderColor: '#ccc',
    flex: 1,
    overflow: 'hidden', 
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableBody: {
    flex: 1,
    height: 500, 
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  filterGroup: {
    flexDirection: 'row',
  },
  searchContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  roleContainer: {
    flexDirection: 'column',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 200,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  filterButtonSelected: {
    backgroundColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    alignItems: 'center',
  },
  headerCell: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    padding: 10,
    textAlign: 'center',
  },
  moreButton: {
    padding: 8,
    backgroundColor: '#e6ddcc',
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    height: 36,
  },
  moreButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
});

export default UsersDataTable;