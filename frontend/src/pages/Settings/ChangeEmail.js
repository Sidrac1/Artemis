import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, PanResponder, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderTitleBox from "../../components/HeaderTitleBox";
import { updateEmpleadoEmail } from "../../api/Empleados"; // Asumo que tienes esta función
import { AuthContext } from "../../AuthContext";
import { API_IP } from "../../api/Config";

const { width } = Dimensions.get("window");

const ChangeEmail = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [swipeDirection, setSwipeDirection] = useState("");
    const [loadingEmail, setLoadingEmail] = useState(true); // Nuevo estado para indicar carga del correo

    const getEmailUrl = `http://${API_IP}/Artemis/backend/login.php?action=getEmail`;

    useEffect(() => {
        const fetchEmail = async () => {
            setLoadingEmail(true);
            if (user && user.id_empleado) {
                try {
                    const response = await fetch(getEmailUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id_empleado: user.id_empleado }),
                    });

                    const data = await response.json();

                    if (response.ok && data && data.email) {
                        setEmail(data.email);
                    } else {
                        Alert.alert("Error", data?.message || "No se pudo obtener el correo electrónico.");
                    }
                } catch (error) {
                    console.error("Error al obtener el correo:", error);
                    Alert.alert("Error", "Error al comunicarse con el servidor para obtener el correo.");
                } finally {
                    setLoadingEmail(false);
                }
            } else {
                Alert.alert("Error", "Información del usuario no disponible.");
                setLoadingEmail(false);
            }
        };

        fetchEmail();
    }, [user]); // Dependencia en 'user' para que se refetch si el usuario cambia

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return Math.abs(gestureState.dx) > 15;
        },
        onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dx > 0) {
                setSwipeDirection("Right");
            } else if (gestureState.dx < 0) {
                setSwipeDirection("Left");
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 100) {
                navigation.navigate("Users");
            } else if (gestureState.dx < -100) {
                navigation.navigate("Patrols");
            }
            setSwipeDirection("");
        },
    });

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Error", "Por favor, introduce un nuevo correo electrónico.");
            return;
        }

        if (!user || !user.id_empleado) {
            Alert.alert("Error", "No se encontró la información del empleado. Por favor, intenta iniciar sesión de nuevo.");
            return;
        }

        const result = await updateEmpleadoEmail(user.id_empleado, email);

        if (result && result.message === "Correo electrónico actualizado exitosamente") {
            Alert.alert("Éxito", "Correo electrónico actualizado correctamente!");
            navigation.goBack();
        } else {
            Alert.alert("Error", result?.message || "Falló la actualización del correo electrónico. Por favor, intenta de nuevo.");
        }
    };

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.backText}>Atrás</Text>
            </TouchableOpacity>
            <HeaderTitleBox iconName="envelope" text="CAMBIAR CORREO ELECTRÓNICO" />

            <View style={styles.content}>
                <View style={styles.outerContainer}>
                    <View style={styles.card}>
                        {loadingEmail ? (
                            <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 20 }}>Cargando correo...</Text>
                        ) : (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Correo Electrónico Actual</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: '#eee' }]}
                                    value={email}
                                    editable={false}
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nuevo Correo Electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce el nuevo correo electrónico"
                                placeholderTextColor="#aaa"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Actualizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    },
    backText: {
        marginLeft: 5,
        fontSize: 16,
        color: "black",
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 30,
    },
    outerContainer: {
        backgroundColor: "#e6ddcc",
        borderRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: "black",
    },
    card: {
        width: width * 0.8,
        padding: 30,
        backgroundColor: "white",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 3,
        borderColor: "black",
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 18,
        backgroundColor: "#f9f9f9",
        flex: 1,
    },
    submitButton: {
        backgroundColor: "#e6ddcc",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: "black",
    },
    submitButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
    },
});

export default ChangeEmail;