import React, { useEffect ,useState } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar useNavigation
import { Ionicons } from "@expo/vector-icons"; // Ícono para el botón
import HeaderTitleBox from "../../components/HeaderTitleBox";
import TableNoTitle from "../../components/TableNoTitle";
import { getAccessesHistory } from "../../api/Accesses_History";

const AccessesHistory = () => {
  const navigation = useNavigation(); // Para navegar a otras pantallas
  const [swipeDirection, setSwipeDirection] = useState("");
  const [accessesHistory, setAccessesHistory] = useState([]);

  useEffect(() => {
        const fetchData = async () => {
          try {

            // Obtener las últimas alertas
            const AccessesHistoryData = await getAccessesHistory(); 
            setAccessesHistory(AccessesHistoryData); 
          } catch (error) {
            console.error('Error al obtener los datos:', error);
          }
        };
    
        fetchData();
      }, []);

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
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <HeaderTitleBox iconName="door-open" text="ACCESSES HISTORY" />
        <TableNoTitle data={accessesHistory} />
      </View>
    </View>
  );
};

const AccesesHistory = [
  {
    area: "Tool Room",
    fecha: "03/06/2025",
    time: "14:25",
    name: "Erick Alvarez",
    role: "Supervisor",
    rfid: "45482",
  },
  {
    area: "Servers Room",
    fecha: "06/07/2025",
    time: "14:25",
    name: "Erick Alvarez",
    role: "Employees",
    rfid: "45482",
  },
  {
    area: "Meeting Room",
    fecha: "04/05/2025",
    time: "14:25",
    name: "Angel Gameros",
    role: "Employees",
    rfid: "45482",
  },
  {
    area: "QC Room",
    fecha: "14/07/2025",
    time: "14:25",
    name: "Manuel Osuna",
    role: "Supervisor",
    rfid: "45482",
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

export default AccessesHistory;
