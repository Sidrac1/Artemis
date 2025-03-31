import React, { useState, useEffect } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DataTable from "../../components/DataTableDateFilter"; // Asegúrate de la ruta correcta
import HeaderTitleBox from "../../components/HeaderTitleBox"; // Importa HeaderTitleBox
import { getPatrolReports } from "../../api/PatrolReports"; // Asegúrate de la ruta correcta
import moment from "moment"; // Asegúrate de importar moment

const PatrolReports = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");
  const [patrolReportsData, setPatrolReportsData] = useState([]);

  useEffect(() => {
    // Obtener los datos de la API cuando el componente se monte
    const fetchPatrolReports = async () => {
      const data = await getPatrolReports();
      if (data) {
        // Formatear las fechas antes de guardarlas en el estado
        const formattedData = data.map((report) => {
          return {
            ...report,
            // Suponiendo que la fecha es un campo llamado "DATE"
            DATE: moment(report.DATE).format("DD/MM/YYYY"),
          };
        });
        setPatrolReportsData(formattedData); // Guardar los datos formateados en el estado
      }
    };

    fetchPatrolReports();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        setSwipeDirection("Right");
      } else if (gestureState.dx < 0) {
        setSwipeDirection("Left");
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        navigation.navigate("Patrols");
      } else if (gestureState.dx < -100) {
        navigation.navigate("Dashboard");
      }
      setSwipeDirection("");
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <HeaderTitleBox iconName="file-alt" text="Patrol Reports" />
        <DataTable
          data={patrolReportsData} // Pasando los datos obtenidos
          navigation={navigation}
          navigateTo="ReportDetails"
          idKey="ID"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Esto permite que el ScrollView crezca si es necesario
    backgroundColor: "#faf9f9",
    paddingVertical: 20,
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
    zIndex: 1000,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default PatrolReports;
