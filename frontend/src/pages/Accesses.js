import React, { useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";
import AlertHistory from "./Access/AlertHistory";
import AccessesHistory from "./Access/AccessesHistory";
import ManageDevices from "./Access/ManageDevices";

const Stack = createStackNavigator();

const AccessesScreen = () => {
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

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.content}>
        <InfoButton title="ALERT HISTORY" iconName="exclamation-circle" navigateTo="AlertHistory" />
        <InfoButton title="ACCESSES HISTORY" iconName="door-open" navigateTo="AccessesHistory" />
        <InfoButton title="MANAGE DEVICES" iconName="wrench" navigateTo="ManageDevices" />
      </View>
    </View>
  );
};

const AccessesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccessesMain" component={AccessesScreen} />
      <Stack.Screen name="AlertHistory" component={AlertHistory} />
      <Stack.Screen name="AccessesHistory" component={AccessesHistory} />
      <Stack.Screen name="ManageDevices" component={ManageDevices} />
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

export default AccessesNavigator;
