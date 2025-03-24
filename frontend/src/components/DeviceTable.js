import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Switch } from 'react-native';

const DeviceTable = ({ data }) => {
  const [deviceData, setDeviceData] = useState(data);
  const headers = deviceData && deviceData.length > 0 ? Object.keys(deviceData[0]) : [];
  const screenWidth = Dimensions.get('window').width;

  const handleToggle = (index) => {
    const newData = [...deviceData];
    newData[index].active = !newData[index].active;
    setDeviceData(newData);
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

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      {headers.map(header => (
        <View key={header} style={[styles.cell, { width: screenWidth / headers.length }]}> 
          {typeof item[header] === 'boolean' ? (
            <Switch
              value={item[header]}
              onValueChange={() => handleToggle(index)}
            />
          ) : (
            <Text>{item[header] != null ? item[header].toString() : '-'}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.scrollableContainer}>
          <FlatList
            data={deviceData || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            stickyHeaderIndices={[0]}
            style={styles.flatList}
          />
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
    marginTop: 40,
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
    maxHeight: 390,
    overflow: 'hidden',
  },
  flatList: {
    marginTop: 10,
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

export default DeviceTable;