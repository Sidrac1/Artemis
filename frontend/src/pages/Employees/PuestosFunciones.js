import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, FlatList, StyleSheet } from "react-native";
import { getPuestos, createPuesto, updatePuesto, deletePuesto } from "../../api/Puestos";

const PuestosScreen = () => {
  const [puestos, setPuestos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [nombrePuesto, setNombrePuesto] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async () => {
    const data = await getPuestos();
    setPuestos(data);
  };

  const handleCreatePuesto = async () => {
    const response = await createPuesto(descripcion, nombrePuesto);
    alert(response.message);
    fetchPuestos();
    setDescripcion("");
    setNombrePuesto("");
  };

  const handleUpdatePuesto = async () => {
    const response = await updatePuesto(editing.codigo, descripcion, nombrePuesto);
    alert(response.message);
    fetchPuestos();
    setEditing(null);
    setDescripcion("");
    setNombrePuesto("");
  };

  const handleDeletePuesto = async (codigo) => {
    const response = await deletePuesto(codigo);
    alert(response.message);
    fetchPuestos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puestos</Text>

      <FlatList
        data={puestos}
        keyExtractor={(item) => item.codigo.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nombre_puesto}</Text>
            <Button title="Editar" onPress={() => {
              setEditing(item);
              setDescripcion(item.descripcion);
              setNombrePuesto(item.nombre_puesto);
            }} />
            <Button title="Eliminar" onPress={() => handleDeletePuesto(item.codigo)} />
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre del puesto"
        value={nombrePuesto}
        onChangeText={setNombrePuesto}
      />

      <Button
        title={editing ? "Actualizar Puesto" : "Crear Puesto"}
        onPress={editing ? handleUpdatePuesto : handleCreatePuesto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});

export default PuestosScreen;
