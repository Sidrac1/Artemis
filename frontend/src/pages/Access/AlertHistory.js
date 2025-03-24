import React, { useState } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import { Ionicons } from "@expo/vector-icons"; // Ícono para el botón
import HeaderTitleBox from "../../components/HeaderTitleBox";
import TableNoTitle from "../../components/TableNoTitle";

const AlertHistory = () => {
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
      } else if (gestureState.dx < 0) {
        setSwipeDirection("Left"); // Deslizó hacia la izquierda
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Acción dependiendo de la dirección del deslizamiento
      if (gestureState.dx > 100) {
        navigation.navigate("Patrols");
      } else if (gestureState.dx < -100) {
        navigation.navigate("Dashboard");
      }
      setSwipeDirection("");
    },
  });

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers} // Asocia los gestos al contenedor
    >
      {/* Botón de retroceso */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <HeaderTitleBox iconName="exclamation-circle" text="ALERT HISTORY" />
        <TableNoTitle data={Alert} />
      </View>
    </View>
  );
};

const Alert = [
  {
    area: "Warehouse",
    date: "03/06/2025",
    time: "14:25",
    description: "Attempted entry without valid credentials.",
  },
  {
    area: "Warehouse",
    date: "03/06/2025",
    time: "22:25",
    description: "Attempted entry without valid credentials.",
  },
  {
    area: "Warehouse",
    date: "03/06/2025",
    time: "18:25",
    description: "Attempted entry without valid credentials.",
  },
  {
    area: "Warehouse",
    date: "03/06/2025",
    time: "08:25",
    description: "Attempted entry without valid credentials.",
  },
  {
    area: "Parking Lot",
    date: "04/06/2025",
    time: "10:30",
    description: "Unauthorized movement detected.",
  },
  {
    area: "Main Office",
    date: "05/06/2025",
    time: "13:45",
    description: "Failed fingerprint scan attempt.",
  },
  {
    area: "Reception",
    date: "06/06/2025",
    time: "09:15",
    description: "Door opened outside of schedule.",
  },
  {
    area: "Tool Room",
    date: "07/06/2025",
    time: "17:50",
    description: "Attempted access with invalid RFID card.",
  },
  {
    area: "Garage",
    date: "08/06/2025",
    time: "21:30",
    description: "Unrecognized vehicle entry detected.",
  },
  {
    area: "Server Room",
    date: "09/06/2025",
    time: "11:25",
    description: "Unauthorized file access attempt.",
  },
  {
    area: "Meeting Room",
    date: "10/06/2025",
    time: "16:45",
    description: "Unauthorized entry during restricted hours.",
  },
  {
    area: "Security Room",
    date: "11/06/2025",
    time: "19:00",
    description: "Security camera tampering detected.",
  },
];

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
    zIndex: 100,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
});

export default AlertHistory;
