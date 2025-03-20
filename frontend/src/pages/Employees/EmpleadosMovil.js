import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, Platform, Dimensions 
} from "react-native";
import { getEmpleados } from "../../api/Empleados";

const { width, height } = Dimensions.get("window");

const EmpleadosScreen = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    const data = await getEmpleados();
    setEmpleados(data);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Mostrar tabla solo en Web */}
      {Platform.OS === "web" && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Lista de Empleados</Text>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                <th style={styles.tableHeader}>Nombre</th>
                <th style={styles.tableHeader}>Puesto</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((item) => (
                <tr key={item.ID}>
                  <td style={styles.tableCell}>{item.ID}</td>
                  <td style={styles.tableCell}>{item.nombre} {item.apellido_paterno}</td>
                  <td style={styles.tableCell}>{item.codigo_puesto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </View>
      )}

      {/* Mostrar lista solo en móvil */}
      {Platform.OS !== "web" && (
        <>
          <Text style={styles.title}>Lista de Empleados</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={empleados}
              keyExtractor={(item) => item.ID.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{item.nombre} {item.apellido_paterno}</Text>
                  <Text style={styles.puesto}>Puesto: {item.codigo_puesto}</Text>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === "web" ? height * 0.05 : 20, 
    backgroundColor: Platform.OS === "web" ? "#f4f4f4" : "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: Platform.OS === "web" ? width * 0.02 : 24, 
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  item: {
    padding: 15,
    marginVertical: 10,
    width: Platform.OS === "web" ? "80%" : "90%", 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  name: {
    fontSize: Platform.OS === "web" ? width * 0.015 : 20,
    fontWeight: "bold",
    color: "#333",
  },
  puesto: {
    fontSize: Platform.OS === "web" ? width * 0.012 : 16, 
    color: "#666",
  },
  tableContainer: {
    width: "80%",
    marginVertical: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.1)",
  },
  tableTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  tableCell: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
});

export default EmpleadosScreen;
