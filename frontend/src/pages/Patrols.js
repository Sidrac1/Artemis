import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

// Páginas enlazadas
import CreatePatrol from "./Patrols/CreatePatrol";
import ActivePatrols from "./Patrols/ActivePatrols";
import PatrolReports from "./Patrols/PatrolReports";

// Definir el Stack
const Stack = createStackNavigator();

const PatrolsScreen = () => {
  const navigation = useNavigation(); // Para navegar a otras pantallas
  const [swipeDirection, setSwipeDirection] = useState('');

  // Crear el PanResponder para detectar el deslizamiento
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15; // Solo activar si el deslizamiento es suficiente
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        setSwipeDirection('Left');  // Deslizó hacia la izquierda
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx < -100) {
        // Si el deslizamiento es lo suficientemente largo a la izquierda, navega hacia "Accesses"
        navigation.navigate("Accesses");
      }
      setSwipeDirection('');
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.content}>
        <InfoButton title="ACTIVE PATROLS" iconName="wifi" navigateTo="ActivePatrols" />
        <InfoButton title="CREATE PATROL" iconName="calendar-plus" navigateTo="CreatePatrol" />
        <InfoButton title="PATROL REPORTS" iconName="envelope-open-text" navigateTo="PatrolReports" />
      </View>
    </View>
  );
};

const Patrols = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatrolsMain" component={PatrolsScreen} />
      <Stack.Screen name="ActivePatrols" component={ActivePatrols} />
      <Stack.Screen name="CreatePatrol" component={CreatePatrol} />
      <Stack.Screen name="PatrolReports" component={PatrolReports} />
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

export default Patrols;
