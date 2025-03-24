import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, 
  TextInput, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const DataTableDateFilter = ({ data, navigation, navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const screenWidth = Dimensions.get('window').width;
  const moreButtonWidth = 250;

  const filteredData = data.filter(item => {
    const nameMatch = item.NAME.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = filterDate ? item.DATE === filterDate : true;
    return nameMatch && dateMatch;
  });

  const handleDateSelect = (day) => {
    const formattedDate = moment(day.dateString).format('DD/MM/YYYY');
    setFilterDate(formattedDate);
    setShowCalendar(false);
  };

  const dismissModal = () => {
    setShowCalendar(false);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header) => (
        <Text key={header} style={[styles.headerCell, { width: (header === 'VIEW' ? moreButtonWidth : screenWidth / (headers.length + 1)) }]}>
          {header}
        </Text>
      ))}
      {headers.length > 0 && (
        <Text style={[styles.headerCell, { width: moreButtonWidth }]}>VIEW</Text>
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
        <TouchableOpacity style={[styles.moreButton, { width: moreButtonWidth }]} onPress={() => navigation.navigate(navigateTo, item)}>
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
          <View style={styles.dateContainer}>
            <Text style={styles.filterLabel}>Filter</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowCalendar(true)}>
              <Text>{filterDate || 'Select Date'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <FlatList
            data={filteredData || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            style={styles.flatList}
          />
        </View>
      </View>

      <Modal visible={showCalendar} transparent={true}>
  <TouchableWithoutFeedback onPress={dismissModal}>
    <View style={styles.modalContainer}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          hideExtraDays
          style={styles.calendar}
          theme={{
            todayTextColor: '#81694e',
            todayTextStyle: { fontWeight: 'bold' },
            selectedDayTextColor: '#ffffff',
            selectedDayBackgroundColor: '#bfa182',
            arrowColor: '#bfa182',
            arrowStyle: { padding: 10 },
          }}
        />
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>


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
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    width: '100%',
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
  dateContainer: {
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
    borderRadius: 5,
  },
  dateInput: {
    width: 150,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
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
  },
  moreButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  calendar: {
    width: '100%',
  },
});

export default DataTableDateFilter;
