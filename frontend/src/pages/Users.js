import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

// Páginas enlazadas
import CreateUsers from "./Users/CreateUsers";
import ModifyUsers from "./Users/ModifyUsers";

// Definir el Stack
const Stack = createStackNavigator();

const UsersScreen = () => {
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
      } else if (gestureState.dx < 0) {
        setSwipeDirection('Left');  // Deslizó hacia la izquierda
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx > 100) {
        // Deslizar a la derecha
        navigation.navigate("Dashboard");
      } else if (gestureState.dx < -100) {
        // Deslizar a la izquierda
        navigation.navigate("Settings");
      }
      setSwipeDirection('');
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.content}>
        <InfoButton title="MODIFY USERS" iconName="user-edit" navigateTo="ModifyUsers" />
        <InfoButton title="CREATE USERS" iconName="user-plus" navigateTo="CreateUsers" />
      </View>
    </View>
  );
};

// Definir el Navigator correctamente
const Users = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersMain" component={UsersScreen} />
      <Stack.Screen name="ModifyUsers" component={ModifyUsers} />
      <Stack.Screen name="CreateUsers" component={CreateUsers} />
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

export default Users;
