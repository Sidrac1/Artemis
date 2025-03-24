import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TextInput } from 'react-native';
import { Button, Provider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { parse, format } from 'date-fns';

const TableNoTitle = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [pickerVisible, setPickerVisible] = useState(false);

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];
  const screenWidth = Dimensions.get('window').width;

  const parseDate = dateString => {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  };

  const filteredData = data.filter(item => {
    const searchText = searchTerm.toLowerCase();

    const nameMatch = item.name ? item.name.toLowerCase().includes(searchText) : false;
    const lastnameMatch = item["lastname"] ? item["lastname"].toLowerCase().includes(searchText) : false;
    const areaMatch = item.area ? item.area.toLowerCase().includes(searchText) : false;

    const itemDate = parseDate(item.date);
    const startMatch = dateRange.startDate ? dateRange.startDate <= itemDate : true;
    const endMatch = dateRange.endDate ? dateRange.endDate >= itemDate : true;

    return (nameMatch || lastnameMatch || areaMatch) && startMatch && endMatch;
  });

  const handleDateRangeConfirm = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
    setPickerVisible(false);
  };

  const clearDateRange = () => setDateRange({ startDate: null, endDate: null });

  const formatDate = date => {
    if (!date) return null;
    return format(date, 'dd/MM/yyyy');
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map(header => (
        <Text key={header} style={[styles.headerCell, { width: screenWidth / headers.length }]}>
          {header.toUpperCase()}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {headers.map(header => (
        <Text key={header} style={[styles.cell, { width: screenWidth / headers.length }]}>
          {header === 'date' ? formatDate(parseDate(item[header])) : item[header]}
        </Text>
      ))}
    </View>
  );

  return (
    <Provider>
      <View style={styles.mainContainer}>
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <Text style={styles.filterLabel}>Search</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Name, Lastname, or Area"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <Button mode="contained" style={styles.dateButton} onPress={() => setPickerVisible(true)}>
              {dateRange.startDate && dateRange.endDate
                ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                : 'Select Date Range'}
            </Button>
            <DatePickerModal
              mode="range"
              visible={pickerVisible}
              onDismiss={() => setPickerVisible(false)}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onConfirm={handleDateRangeConfirm}
            />
            {(dateRange.startDate || dateRange.endDate) && (
              <Button mode="text" style={styles.clearButton} onPress={clearDateRange}>
                Clear
              </Button>
            )}
          </View>
        </View>

        <View style={styles.outerContainer}>
          <View style={styles.scrollableContainer}>
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
      </View>
    </Provider>
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
  scrollableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    maxHeight: 360, // Altura predeterminada
    overflow: 'hidden', // Ocultar el desbordamiento externo
  },
  flatList: {
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  searchContainer: {
    flex: 1,
    marginRight: 15,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  filterLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  dateButton: {
    marginTop: 5,
    backgroundColor: '#faf9f9',
  },
  clearButton: {
    marginTop: 5,
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
});

export default TableNoTitle;
