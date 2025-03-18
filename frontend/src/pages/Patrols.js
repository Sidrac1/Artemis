import React, { useState } from "react";
import { View, Text, StyleSheet, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";  // Importar useNavigation

const Patrols = () => {
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
    <View
      style={styles.container}
      {...panResponder.panHandlers} // Asocia los gestos al contenedor
    >
      <View style={styles.content}>
        <Text style={styles.text}>Patrols</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",  // Fondo corregido
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#62605c",  // Ajusta el color del texto según tu tema
  },
});

export default Patrols;
