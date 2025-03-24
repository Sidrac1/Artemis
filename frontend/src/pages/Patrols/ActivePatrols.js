import React, { useState } from "react";
import { View, StyleSheet, PanResponder, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ActivePatrolCard from "../../components/ActivePatrolCard";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const ActivePatrols = () => {
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

  const patrolDataArray = [
    {
      routeName: "Wareground",
      guardName: "Anniston Rewler",
      startDate: "12/03/2025 - 22:00",
      endDate: "13/03/2025 - 06:00",
      sectors: "Sector A -> Sector B -> Sector C",
      frequency: "1 Hour",
    },
    {
      routeName: "Building A",
      guardName: "John Doe",
      startDate: "12/03/2025 - 22:00",
      endDate: "13/03/2025 - 06:00",
      sectors: "Sector D -> Sector E -> Sector F",
      frequency: "2 Hour",
    },
    {
      routeName: "Building B",
      guardName: "Jane Smith",
      startDate: "12/03/2025 - 22:00",
      endDate: "13/03/2025 - 06:00",
      sectors: "Sector G -> Sector H -> Sector I",
      frequency: "3 Hour",
    },
  ];

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <HeaderTitleBox iconName="wifi" text="Active Patrols" />
        <ScrollView>
          {patrolDataArray.map((patrol, index) => (
            <ActivePatrolCard key={index} patrolData={patrol} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

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
    zIndex: 1000,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
});

export default ActivePatrols;