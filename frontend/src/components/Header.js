import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Header = () => {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state || {});
  const activeRoute =
    navigationState?.index !== undefined
      ? navigationState.routes[navigationState.index]?.name
      : "Dashboard"; // Asegura que "Dashboard" esté activo por defecto

  const getActiveStyle = (routeName) =>
    activeRoute === routeName ? styles.active : {};

  return (
    <View style={Platform.OS === "web" ? styles.headerWeb : styles.headerMobile}>
      <Pressable style={[styles.menuItem, getActiveStyle("Patrols")]} onPress={() => navigation.navigate("Patrols")}>
        {Platform.OS !== "web" && <Icon name="route" size={20} color="#62605c" />}
        <Text style={styles.buttonText}>Patrols</Text>
      </Pressable>

      <Pressable style={[styles.menuItem, getActiveStyle("Accesses")]} onPress={() => navigation.navigate("Accesses")}>
        {Platform.OS !== "web" && <Icon name="door-open" size={20} color="#62605c" />}
        <Text style={styles.buttonText}>Accesses</Text>
      </Pressable>

      <Pressable style={[styles.menuItem, getActiveStyle("Dashboard")]} onPress={() => navigation.navigate("Dashboard")}>
        {Platform.OS !== "web" && <Icon name="chart-bar" size={20} color="#62605c" />}
        <Text style={styles.buttonText}>{Platform.OS === "web" ? "ARTEMIS" : "Dashboard"}</Text>
      </Pressable>

      <Pressable style={[styles.menuItem, getActiveStyle("Users")]} onPress={() => navigation.navigate("Users")}>
        {Platform.OS !== "web" && <Icon name="users" size={20} color="#62605c" />}
        <Text style={styles.buttonText}>Users</Text>
      </Pressable>

      <Pressable style={[styles.menuItem, getActiveStyle("Settings")]} onPress={() => navigation.navigate("Settings")}>
        {Platform.OS !== "web" && <Icon name="cogs" size={20} color="#62605c" />}
        <Text style={styles.buttonText}>Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  headerMobile: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f1e6",
    height: 80,
    paddingVertical: 10,
    position: "absolute",  // Se coloca nuevamente en absoluto para que esté fijo
    bottom: 0,  // Asegura que esté en la parte inferior
    width: "100%",
    zIndex: 10,  // Para que el Header esté encima de otros elementos
  },
  headerWeb: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f5f1e6",
    height: 100,
    paddingVertical: 15,
    position: "relative",
  },
  menuItem: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "PlayfairDisplay-Regular",
    fontSize: 18,
    color: "#62605c",
  },
  active: {
    backgroundColor: "#d1cdc5",
  },
});

export default Header;
