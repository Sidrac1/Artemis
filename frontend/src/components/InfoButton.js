import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const InfoButton = ({ title, iconName, navigateTo, number }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigateTo) {
      navigation.navigate(navigateTo);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Icon name={iconName} size={50} color="black" />
          <Text style={styles.title}>{title?.toUpperCase() || "DEFAULT"}</Text>
          {number && <Text style={styles.number}>{number}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    height: 240,
    backgroundColor: "#f5f1e6",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "black",
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
  },
  number: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#000",
  },
});

export default InfoButton;
