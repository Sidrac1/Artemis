import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import RouteForm from "../../components/RouteForm"; // Importa RouteForm

const CreateRoute = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGuard } = route.params || {};

  const handleCreateRoute = (formData) => {
    // Aquí puedes agregar la lógica para crear la ruta con el guardia seleccionado y los detalles de la ruta.
    console.log("Creating route with guard:", selectedGuard);
    console.log("Route Data:", formData);
    // Navegar de regreso o a la siguiente pantalla según sea necesario.
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="map" text="CREATE ROUTE" />

      <View style={styles.content}>
        {selectedGuard && (
          <Text style={styles.guardInfo}>
            Guard: {selectedGuard.Name} {selectedGuard.LastName}
          </Text>
        )}

        {/* Reemplaza los TextInput y el botón con RouteForm */}
        <RouteForm onSubmit={handleCreateRoute} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  guardInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default CreateRoute;