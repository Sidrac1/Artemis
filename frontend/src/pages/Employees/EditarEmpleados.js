import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, Button, TextInput, ActivityIndicator, StyleSheet, Dimensions 
} from "react-native";
import { getEmpleados, updateEmpleado } from "../../api/Empleados";
import Toast from 'react-native-toast-message'; 

const { width, height } = Dimensions.get("window"); 

const EmpleadosScreen = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [updatedNombre, setUpdatedNombre] = useState("");
  const [updatedApellido, setUpdatedApellido] = useState("");

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    const data = await getEmpleados();
    setEmpleados(data);
    setLoading(false);
  };

  const handleUpdateEmpleado = async () => {
    if (selectedEmpleado && updatedNombre && updatedApellido) {
      const updatedData = {
        nombre: updatedNombre,
        apellido_paterno: updatedApellido,
      };
      const response = await updateEmpleado(selectedEmpleado.ID, updatedData);
      
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Empleado Actualizado',
        text2: 'Los datos del empleado se actualizaron correctamente.',
        visibilityTime: 3000,
      });

      fetchEmpleados();
      setSelectedEmpleado(null);
      setUpdatedNombre("");
      setUpdatedApellido("");
    } else {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Por favor, complete los campos para actualizar.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Empleados</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>
                {item.nombre} {item.apellido_paterno}
              </Text>
              <Text style={styles.puesto}>Puesto: {item.puesto}</Text>
              <Button
                title="Actualizar"
                onPress={() => {
                  setSelectedEmpleado(item);
                  setUpdatedNombre(item.nombre);
                  setUpdatedApellido(item.apellido_paterno);
                }}
              />
            </View>
          )}
        />
      )}

      {selectedEmpleado && (
        <View style={styles.updateContainer}>
          <Text style={styles.updateTitle}>Actualizar Empleado</Text>
          <TextInput
            style={styles.input}
            placeholder="Nuevo Nombre"
            value={updatedNombre}
            onChangeText={setUpdatedNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="Nuevo Apellido Paterno"
            value={updatedApellido}
            onChangeText={setUpdatedApellido}
          />
          <Button title="Actualizar Empleado" onPress={handleUpdateEmpleado} />
        </View>
      )}

      {/* Mostrar las notificaciones */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  item: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  puesto: {
    fontSize: 16,
    color: "#666",
  },
  updateContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  updateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default EmpleadosScreen;
