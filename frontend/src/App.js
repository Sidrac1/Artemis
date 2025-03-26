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
import { SafeAreaView, View } from "react-native";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreenWrapper} />
        <Stack.Screen name="Dashboard" component={DashboardWrapper} />
        <Stack.Screen name="Accesses" component={AccessesWrapper} />
        <Stack.Screen name="Patrols" component={PatrolsWrapper} />
        <Stack.Screen name="Users" component={UsersWrapper} />
        <Stack.Screen name="Settings" component={SettingsWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Wrappers:
const LoginScreenWrapper = () => {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
};

const DashboardWrapper = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Dashboard />
    </SafeAreaView>
  );
};
const AccessesWrapper = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <AccessesNavigator />
    </SafeAreaView>
  );
};
const PatrolsWrapper = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Patrols />
    </SafeAreaView>
  );
};
const UsersWrapper = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Users />
    </SafeAreaView>
  );
};
const SettingsWrapper = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Settings />
    </SafeAreaView>
  );
};

export default App;