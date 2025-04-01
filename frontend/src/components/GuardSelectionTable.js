// GuardSelectionTable.js
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput } from "react-native";

const GuardSelectionTable = ({ data, onGuardSelect, onContinue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuard, setSelectedGuard] = useState(null);
  const headers = useMemo(
    () => (data && data.length > 0 ? Object.keys(data[0]).filter((header) => header !== "ROLE") : []),
    [data]
  );
  const screenWidth = Dimensions.get("window").width;

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((item) => {
      const fullName = `${item.Nombre || item.Name} ${item.Apellido || item.LastName}`.toLowerCase();
      return fullName.includes(lowerSearchTerm);
    });
  }, [data, searchTerm]);

  const handleRowPress = (guard) => {
    setSelectedGuard(guard);
    onGuardSelect(guard);
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header) => (
        <Text key={header} style={[styles.headerCell, { width: screenWidth / headers.length }]}>
          {header}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.row,
        selectedGuard && selectedGuard.ID === item.ID && styles.selectedRow,
      ]}
      onPress={() => handleRowPress(item)}
    >
      {headers.map((header) => (
        <Text key={header} style={[styles.cell, { width: screenWidth / headers.length }]}>
          {item[header[0]] || item[header]}
        </Text>
      ))}
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.noResultsText}>No matching results found.</Text>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.filterContainer}>
      <View style={styles.searchContainer}>
        <Text style={styles.filterLabel}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>
    </View>
  );

  const ListFooter = () => (
    <TouchableOpacity
      style={styles.continueButton}
      onPress={() => {
        if (selectedGuard) {
          onContinue(selectedGuard);
        } else {
          console.error("No guard selected.");
        }
      }}
    >
      <Text style={styles.continueButtonText}>CONTINUE</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={[styles.outerContainer, { marginTop: 10 }]}>
        <View style={styles.container}>
          <FlatList
            data={filteredData.length > 0 ? filteredData : [{ empty: true }]}
            renderItem={({ item }) => (item.empty ? renderEmptyList() : renderItem({ item }))}
            keyExtractor={(item, index) => (item.empty ? "empty" : index.toString())}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListFooter}
            stickyHeaderIndices={[]}
            style={styles.flatList}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={11}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps="handled"
            getItemLayout={(data, index) => ({
              length: 44,
              offset: 44 * index,
              index,
            })}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: "center",
    width: "80%",
    marginVertical: 10,
    alignItems: "center",
  },
  outerContainer: {
    backgroundColor: "#f5f1e6",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  searchContainer: {
    flexDirection: "column",
    marginRight: 10,
  },
  filterLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    width: 200,
  },
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    height: 300,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  headerCell: {
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    padding: 10,
    textAlign: "center",
  },
  flatList: {
    marginTop: 10,
  },
  continueButton: {
    backgroundColor: "#e6ddcc",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  selectedRow: {
    backgroundColor: "#e0e0e0",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: "gray",
  },
});

export default GuardSelectionTable;