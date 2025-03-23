import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native';
import DataTable from '../../components/DataTable';
import UserDetails from './UserDetails';
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const Stack = createStackNavigator();

const ModifyUsersScreen = ({ navigation }) => {
  const usersData = [
    { "ID": 123, "NAME": "John", "LAST NAME": "Kennedy", "ROLE": "Supervisor", "RFID": "45327", "EMAIL": "john.kennedy@example.com" },
    { "ID": 124, "NAME": "Jane", "LAST NAME": "Doe", "ROLE": "Guard", "RFID": "98765", "EMAIL": "jane.doe@example.com" },
    { "ID": 125, "NAME": "Peter", "LAST NAME": "Parker", "ROLE": "Employee", "RFID": "11223", "EMAIL": "peter.parker@example.com" },
    { "ID": 126, "NAME": "Mary", "LAST NAME": "Jane", "ROLE": "Supervisor", "RFID": "55667", "EMAIL": "mary.jane@example.com" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="user-edit" text="MODIFY USERS" />
      <DataTable
        data={usersData}
        navigation={navigation}
        navigateTo="UserDetails"
        idKey="ID"
      />
    </View>
  );
};

const ModifyUsers = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsersMain" component={ModifyUsersScreen} />
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        // No need to pass initialParams here, DataTable will handle it
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default ModifyUsers;