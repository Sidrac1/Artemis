import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import GuardSelectionTable from "../../components/GuardSelectionTable";

const CreatePatrol = () => {
  const navigation = useNavigation();
  const [selectedGuard, setSelectedGuard] = useState(null);

  const handleGuardSelect = (guard) => {
    setSelectedGuard(guard);
    console.log("Selected Guard:", guard);
  };

  const handleContinue = (navigation) => { // Recibe navigation como argumento
    if (selectedGuard) {
      console.log("Continue with selected guard:", selectedGuard);
      // Navegar a CreateRoute y pasar el guardia seleccionado como parámetro.
      navigation.navigate("CreateRoute", { selectedGuard: selectedGuard });
    } else {
      console.log("No guard selected.");
      // Puedes agregar aquí una lógica para manejar el caso en que no se ha seleccionado un guardia.
    }
  };

  const tableData = [
    { ID: 1, Name: "John", LastName: "Doe", Gender: "Male", Phone: "555-1234" },
    { ID: 2, Name: "Jane", LastName: "Smith", Gender: "Female", Phone: "555-5678" },
    { ID: 3, Name: "Robert", LastName: "Johnson", Gender: "Male", Phone: "555-9012" },
    { ID: 4, Name: "Emily", LastName: "Williams", Gender: "Female", Phone: "555-3456" },
    { ID: 5, Name: "Michael", LastName: "Brown", Gender: "Male", Phone: "555-7890" },
    { ID: 6, Name: "Jessica", LastName: "Davis", Gender: "Female", Phone: "555-2345" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <HeaderTitleBox iconName="id-card-alt" text="ASSIGN GUARD" />

      <View style={styles.content}>
        <GuardSelectionTable
          data={tableData}
          onGuardSelect={handleGuardSelect}
          onContinue={() => handleContinue(navigation)} // Pasa navigation a handleContinue
        />
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
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: "black",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreatePatrol;