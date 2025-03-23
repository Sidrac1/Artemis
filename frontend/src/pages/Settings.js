import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";


//Paginas enlazadas para el boton
import ChangePassword from "./Settings/ChangePassword";
import ChangeEmail from "./Settings/ChangeEmail";

// Definir el Stack
const Stack = createStackNavigator();

const SettingsScreen = () => {
  const navigation = useNavigation(); // Para navegar a otras pantallas
  const [swipeDirection, setSwipeDirection] = useState('');

  // Crear el PanResponder para detectar el deslizamiento
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15; // Solo activar si el deslizamiento es suficiente
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        setSwipeDirection('Right');  // Deslizó hacia la derecha
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx > 100) {
        // Si el deslizamiento es lo suficientemente largo a la derecha, navega hacia "Users"
        navigation.navigate("Users");
      }
      setSwipeDirection('');
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.content}>
        <InfoButton title="CHANGE EMAIL" iconName="user-cog" navigateTo="ChangeEmail" />
        <InfoButton title="CHANGE PASSWORD" iconName="user-cog" navigateTo="ChangePassword" />
      </View>
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
});

export default Settings;
