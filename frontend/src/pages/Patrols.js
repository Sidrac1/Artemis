import React, { useState } from "react"; // Importa useState
import { View, StyleSheet, PanResponder, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import InfoButton from "../components/InfoButton";

// Páginas enlazadas
import CreatePatrol from "./Patrols/CreatePatrol";
import ActivePatrols from "./Patrols/ActivePatrols";
import PatrolReports from "./Patrols/PatrolReports";
import CreateRoute from "./Patrols/CreateRoute";
import ReportDetails from "./Patrols/ReportDetails";

// Definir el Stack
const Stack = createStackNavigator();

const PatrolsScreen = () => {
  const navigation = useNavigation();
  const [swipeDirection, setSwipeDirection] = useState("");
  const isMobile = Platform.OS !== 'web';

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 15;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        setSwipeDirection("Left");
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -100) {
        navigation.navigate("Accesses");
      }
      setSwipeDirection("");
    },
  });

  const webStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
      alignItems: 'center',
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-around", // Distribute items evenly
      flexWrap: "nowrap", // Prevent wrapping
      marginTop: 100,
      width: '90%', // Adjust width as needed
      maxWidth: 1200, // Set a max width if necessary
    },
  });

  const mobileStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#faf9f9",
      paddingVertical: 20,
    },
    content: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      justifyContent: "flex-start",
    },
  });

  const currentStyles = isMobile ? mobileStyles : webStyles;

  return (
    <View style={currentStyles.container} {...panResponder.panHandlers}>
      <View style={currentStyles.content}>
        <InfoButton title="ACTIVE PATROLS" iconName="wifi" navigateTo="ActivePatrols" />
        <InfoButton title="CREATE PATROL" iconName="calendar-plus" navigateTo="CreatePatrol" />
        <InfoButton title="PATROL REPORTS" iconName="envelope-open-text" navigateTo="PatrolReports" />
      </View>
    </View>
  );
};

const Patrols = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PatrolsMain" component={PatrolsScreen} />
    <Stack.Screen name="ActivePatrols" component={ActivePatrols} />
    <Stack.Screen name="CreatePatrol" component={CreatePatrol} />
    <Stack.Screen name="PatrolReports" component={PatrolReports} />
    <Stack.Screen name="CreateRoute" component={CreateRoute} />
    <Stack.Screen name="ReportDetails" component={ReportDetails} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "flex-start",
  },
});

export default Patrols;