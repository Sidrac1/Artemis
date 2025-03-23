import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const { width, height } = Dimensions.get("window");

const UserDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userData = route.params;
  const [formData, setFormData] = useState(userData);

  useEffect(() => {
    setFormData(route.params);
  }, [route.params]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Form Data to Update:", formData);
    // Aquí puedes agregar la lógica para enviar los datos actualizados a tu API
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <HeaderTitleBox iconName="address-card" text="USER DETAILS" />

      <View style={styles.content}>
        {formData && (
          <View style={styles.cardContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Role:</Text>
              <TextInput
                style={styles.formInputDisabled}
                value={formData.ROLE}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name:</Text>
              <TextInput
                style={styles.formInputDisabled}
                value={formData.NAME}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Last Name:</Text>
              <TextInput
                style={styles.formInputDisabled}
                value={formData["LAST NAME"]}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender:</Text>
              <TextInput
                style={styles.formInputDisabled}
                value={formData.GENDER}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>RFID:</Text>
              <TextInput
                style={styles.formInputDisabled}
                value={formData.RFID}
                editable={false}
                pointerEvents="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone:</Text>
              <TextInput
                style={styles.formInput}
                value={formData.PHONE}
                onChangeText={(text) => handleChange("PHONE", text)}
                keyboardType="phone-pad"
              />
            </View>

            {formData.ROLE === "Supervisor" && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Email:</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.EMAIL}
                    onChangeText={(text) => handleChange("EMAIL", text)}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Password:</Text>
                  <TextInput
                    style={styles.formInput}
                    value={formData.PASSWORD}
                    onChangeText={(text) => handleChange("PASSWORD", text)}
                    secureTextEntry
                  />
                </View>
              </>
            )}

            <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
              <Text style={styles.updateButtonText}>UPDATE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
    alignItems: 'center',
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
  content: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    backgroundColor: '#e6ddcc',
    borderRadius: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'black',
    maxWidth: 500,
    width: '90%',
    alignSelf: 'center',
  },
  cardContainer: {
    width: "90%",
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'black',
    boxSizing: 'border-box',
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 10,
    width: "100%",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'black',
    marginBottom: 3,
  },
  formInput: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    width: "100%",
  },
  formInputDisabled: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: '#e0e0e0',
    color: '#888',
    width: "100%",
  },
  updateButton: {
    backgroundColor: '#e6ddcc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default UserDetails;