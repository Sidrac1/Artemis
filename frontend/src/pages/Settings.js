import React, { useState } from "react";
import { View, StyleSheet, PanResponder, TouchableOpacity, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

// Páginas enlazadas para el botón
import ChangePassword from "./Settings/ChangePassword";
import ChangeEmail from "./Settings/ChangeEmail";

// Definir el Stack
const Stack = createStackNavigator();

const SettingsScreen = () => {
  const navigation = useNavigation(); // Para navegar a otras pantallas
  const [swipeDirection, setSwipeDirection] = useState("");

  // Crear el PanResponder para detectar el deslizamiento
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15; // Solo activar si el deslizamiento es suficiente
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        setSwipeDirection("Right"); // Deslizó hacia la derecha
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx > 100) {
        // Si el deslizamiento es lo suficientemente largo a la derecha, navega hacia "Users"
        navigation.navigate("Users");
      }
      setSwipeDirection("");
    },
  });

  const handleLogout = () => {
    // Aquí puedes agregar lógica para cerrar la sesión (por ejemplo, limpiar tokens, etc.)
    navigation.navigate("LoginScreen"); // Navegar a la pantalla de inicio de sesión
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.content}>
        <InfoButton title="CHANGE EMAIL" iconName="user-cog" navigateTo="ChangeEmail" />
        <InfoButton title="CHANGE PASSWORD" iconName="user-cog" navigateTo="ChangePassword" />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

// Definir el Navigator correctamente
const Settings = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersMain" component={SettingsScreen} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingVertical: 20,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginBottom: 30,
    marginTop: 160,
  },
  logoutButton: {
    display: 'flex',
    backgroundColor: "#e6ddcc",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "black",
    alignSelf: "center",
    width: 200,
    alignItems: 'center', // Centramos verticalmente
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center', // Centramos horizontalmente
  },
});

export default Settings;