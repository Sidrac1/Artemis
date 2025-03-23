import React, { useState } from "react";
import { View, Text, StyleSheet, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import Infocard from "../components/Infocard";
import InfoTable from "../components/InfoTable";

const Dashboard = () => {
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
        // Si el deslizamiento es lo suficientemente largo a la derecha, navega hacia la pantalla de "Accesses"
        navigation.navigate("Accesses");
      } else if (gestureState.dx < -100) {
        // Si el deslizamiento es lo suficientemente largo a la izquierda, navega hacia la pantalla de "Users"
        navigation.navigate("Users");
      }
      setSwipeDirection("");
    },
  });

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers} // Asocia los gestos al contenedor
    >
      <View style={styles.content}>
        <Infocard title="Active Routes" number={3} iconName="route" />
        <Infocard title="Supervisors" number={2} iconName="user-cog" />
        <Infocard title="Guards" number={6} iconName="user-shield" />
        <Infocard title="Employees" number={6} iconName="user-lock" />
      </View>
      <View style={styles.content}>
        <InfoTable title="LAST ACCESSES" data={Accesses} />
        <InfoTable title="LAST ALERTS" data={Alerts} />
      </View>
    </View>
  );
};

const Alerts = [
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "14:25",
    description: "Attempted entry without valid credentials.",
  },
  {
    area: "Main Hall",
    date: "03/06/2025",
    time: "10:30",
    description: "Door opened outside of schedule.",
  },
  {
    area: "Warehouse",
    date: "03/06/2025",
    time: "18:45",
    description: "Unauthorized movement detected.",
  },
  {
    area: "Reception",
    date: "03/06/2025",
    time: "08:15",
    description: "Failed fingerprint scan attempt.",
  },
  {
    area: "Garage",
    date: "03/06/2025",
    time: "22:50",
    description: "Forced entry detected at the door.",
  },
];

const Accesses = [
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "14:25",
    name: "Manuel Osuna",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "16:25",
    name: "Erick Alvarez",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "18:25",
    name: "Angel Gameros",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "20:25",
    name: "Edoardo Sanchez",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "16:25",
    name: "Manuel Osuna",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "18:25",
    name: "Manuel Osuna",
    role: "Supervisor",
  },
  {
    area: "Tool Room",
    date: "03/06/2025",
    time: "19:25",
    name: "Manuel Osuna",
    role: "Supervisor",
  },
];

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
  },
});

export default Dashboard;
