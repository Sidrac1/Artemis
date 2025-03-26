import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Switch,
} from "react-native";
import { updateEstadoDispositivo } from "../api/Dispositivos";

const DeviceTable = ({ data }) => {
  const [deviceData, setDeviceData] = useState([]);

  useEffect(() => {
    if (data) {
      const formattedData = data.map((item) => ({
        ...item,
        estado: item.estado === 1,
      }));
      setDeviceData(formattedData);
    }
  }, [data]);

  const screenWidth = Dimensions.get("window").width;
  const headers = deviceData.length > 0 ? Object.keys(deviceData[0]) : [];

  const handleToggle = async (codigo, estadoActual) => {
    try {
      const nuevoEstado = estadoActual ? 0 : 1;
      await updateEstadoDispositivo(codigo, nuevoEstado);
      setDeviceData((prevData) =>
        prevData.map((device) =>
          device.codigo === codigo ? { ...device, estado: nuevoEstado === 1 } : device
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado del dispositivo:", error.message);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {headers.map((header, index) => (
        <Text key={index} style={[styles.headerCell, { width: screenWidth / headers.length }]}>
          {header.toUpperCase()}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {headers.map((header, headerIndex) => (
        <View key={headerIndex} style={[styles.cell, { width: screenWidth / headers.length }]}>
          {header === "estado" ? (
            <Switch
              value={item.estado}
              onValueChange={() => handleToggle(item.codigo, item.estado)}
            />
          ) : (
            <Text style={styles.cellText}>{item[header] != null ? item[header].toString() : "-"}</Text>
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
            data={deviceData}
            renderItem={renderItem}
            keyExtractor={(item) => item.codigo.toString()}
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
    alignSelf: "center",
    width: "80%",
    marginVertical: 10,
    alignItems: "center",
    marginTop: 40,
  },
  outerContainer: {
    backgroundColor: "#f5f1e6",
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
  },
  scrollableContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    maxHeight: 390,
    overflow: "hidden",
  },
  flatList: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  cellText: {
    fontSize: 13,
    textAlign: "center",
  },
});

export default DeviceTable;
