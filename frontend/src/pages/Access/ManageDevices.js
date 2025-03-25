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
import DeviceTable from "../../components/DeviceTable";

const ManageDevices = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > 15,
    onPanResponderMove: (evt, gestureState) => {
      setSwipeDirection(gestureState.dx > 0 ? "Right" : "Left");
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) navigation.navigate("Patrols");
      else if (gestureState.dx < -100) navigation.navigate("Dashboard");
      setSwipeDirection("");
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <HeaderTitleBox iconName="wrench" text="MANAGE DEVICES" />
        <DeviceTable data={data} />
      </View>
    </View>
  );
};

const data = [
  { type: "Patrolman", description: "Offices door", active: true },
  { type: "Patrolman", description: "Tool Room door", active: false },
  { type: "Patrolman", description: "Warehouse door", active: true },
  { type: "Patrolman", description: "Logistic Center door", active: false },
  { type: "Patrolman", description: "QA", active: true },
  { type: "Patrolman", description: "QC", active: true },
  { type: "Patrolman", description: "RH", active: false },
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

export default ManageDevices;
