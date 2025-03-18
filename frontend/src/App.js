import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header"; // Importar el Header
import Dashboard from "./pages/Dashboard";
import Accesses from "./pages/Accesses";
import Patrols from "./pages/Patrols";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import { View, StyleSheet } from "react-native";  // Importa View y StyleSheet

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Header /> 

        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{ headerShown: false }} // Desactiva el header por defecto de react-navigation
        >
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Accesses" component={Accesses} />
          <Stack.Screen name="Patrols" component={Patrols} />
          <Stack.Screen name="Users" component={Users} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default App;
