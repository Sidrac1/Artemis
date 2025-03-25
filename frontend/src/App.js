import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AccessesNavigator from "./pages/Accesses";
import Patrols from "./pages/Patrols";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import LoginScreen from "./LoginScreen";
import { SafeAreaView } from "react-native";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <Header />
        <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
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