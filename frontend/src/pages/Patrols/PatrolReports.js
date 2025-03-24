import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DataTable from "../../components/DataTableDateFilter"; // Asegúrate de la ruta correcta

const PatrolReports = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");

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

  const patrolReportsData = [
    {
      ID: 123,
      NAME: "Paco",
      DATE: "16/03/2025",
    },
    {
      ID: 123,
      NAME: "Nighttime in Warehouse",
      DATE: "15/03/2025",
    },
    {
      ID: 123,
      NAME: "Nighttime in Warehouse",
      DATE: "15/03/2025",
    },
    {
      ID: 123,
      NAME: "Nighttime in Warehouse",
      DATE: "15/03/2025",
    },
  ];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <DataTable
          data={patrolReportsData}
          navigation={navigation}
          navigateTo="ReportDetails" // Nombre de la ruta para ReportDetails.js
          idKey="ID"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 60,
  },
});

export default PatrolReports;