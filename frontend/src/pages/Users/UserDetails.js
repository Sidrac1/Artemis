import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";

const { width, height } = Dimensions.get("window");

const UserDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userData = route.params; // Get user data passed from DataTable

  useEffect(() => {
    // Log the received data for debugging
    console.log("UserDetails - route.params:", route.params);
  }, [route.params]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <HeaderTitleBox iconName="address-card" text="USER DETAILS" />

      <View style={styles.content}>
        <Text style={styles.titleText}>User Details</Text>

        {userData && (
          <View style={styles.detailContainer}>
            <Text style={styles.detailLabel}>ID:</Text>
            <Text style={styles.detailText}>{userData.ID}</Text>

            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailText}>{userData.NAME}</Text>

            <Text style={styles.detailLabel}>Last Name:</Text>
            <Text style={styles.detailText}>{userData["LAST NAME"]}</Text>

            <Text style={styles.detailLabel}>Role:</Text>
            <Text style={styles.detailText}>{userData.ROLE}</Text>

            <Text style={styles.detailLabel}>RFID:</Text>
            <Text style={styles.detailText}>{userData.RFID}</Text>

            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailText}>{userData.EMAIL}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f9",
    paddingVertical: 20,
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
    flex: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailContainer: {
    width: width * 0.8,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default UserDetails;