import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton"; // Importamos el nuevo componente

const AccessesHistory = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 15,
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
      <BackButton /> {/* Usamos el nuevo componente */}

      <View style={styles.content}>
        <Text style={styles.backText}>Accesses History</Text>
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
  content: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginBottom: 30,
    marginTop: 160,
  },
  backText: {
    fontSize: 16,
    color: "black",
  },
});

export default AccessesHistory;
