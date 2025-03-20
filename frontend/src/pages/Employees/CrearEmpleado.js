import React, { useState } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator 
} from "react-native";
import { createEmpleado } from "../../api/Empleados"; // Asegúrate de importar correctamente la API

const AgregarEmpleadoScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [codigoPuesto, setCodigoPuesto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCrearEmpleado = async () => {
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !codigoPuesto) {
      Alert.alert("Error", "Por favor complete todos los campos.");
      return;
    }

    setLoading(true);

    const nuevoEmpleado = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      codigo_puesto: codigoPuesto,
    };

    const response = await createEmpleado(nuevoEmpleado);

    setLoading(false);

    if (response && response.message === "Empleado creado") {
      Alert.alert("Éxito", "Empleado agregado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() }, // Regresa a la pantalla anterior
      ]);
    } else {
      Alert.alert("Error", "Hubo un error al agregar el empleado.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Empleado</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido Paterno"
        value={apellidoPaterno}
        onChangeText={setApellidoPaterno}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido Materno"
        value={apellidoMaterno}
        onChangeText={setApellidoMaterno}
      />
      <TextInput
        style={styles.input}
        placeholder="Código de Puesto"
        value={codigoPuesto}
        onChangeText={setCodigoPuesto}
      />

      <Button title="Agregar Empleado" onPress={handleCrearEmpleado} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
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
    marginBottom: 20,
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
  loading: {
    marginTop: 20,
  },
});

export default AgregarEmpleadoScreen;
