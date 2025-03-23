import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header"; 
import Dashboard from "./pages/Dashboard";
import AccessesNavigator from "./pages/Accesses"; // Importa el nuevo navigator
import Patrols from "./pages/Patrols";
import Users from "./pages/Users";
import Settings from "./pages/Settings";



import { View, SafeAreaView } from "react-native"; // SafeAreaView para la seguridad en los dispositivos

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Si tu Header está fijo en la parte superior, puedes dejarlo fuera de la navegación */}
        <Header /> 
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Accesses" component={AccessesNavigator} />
          <Stack.Screen name="Patrols" component={Patrols} />
          <Stack.Screen name="Users" component={Users} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
