// ResetPassword.js
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert } from "react-native";
import { API_IP } from "./api/Config";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ResetPassword = ({ route }) => {
    const { email } = route.params;
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Error", "Por favor, introduce la nueva contraseña y su confirmación.");
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert("Error", "La nueva contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`http://${API_IP}/Artemis/backend/login.php?action=resetPassword`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword,
                }),
            });

            const text = await response.text();
            console.log("Reset Password Response:", text);

            try {
                const result = JSON.parse(text);
                Alert.alert(result.message);

                if (result.status === "success") {
                    navigation.navigate("LoginScreen"); // Redirige a la pantalla de inicio de sesión
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                Alert.alert("Error", "Respuesta del servidor inválida.");
            }
        } catch (error) {
            console.error("Error al hacer la solicitud:", error);
            Alert.alert("Error", "Hubo un problema al restablecer la contraseña. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = [
        styles.container,
        isWeb && { justifyContent: 'center' }
    ];

    const cardStyle = [
        styles.card,
        isWeb && styles.webCard
    ];

    const inputStyle = [
        styles.input,
        isWeb && styles.webInput
    ];

    const buttonStyle = [
        styles.submitButton,
        isWeb && styles.webSubmitButton
    ];

    const buttonTextStyle = [
        styles.submitButtonText,
        isWeb && styles.webSubmitButtonText
    ];

    return (
        <View style={containerStyle}>
            <View style={cardStyle}>
                <Text style={styles.title}>Restablecer Contraseña</Text>
                <Text style={styles.infoText}>Introduce tu nueva contraseña para el correo:</Text>
                <Text style={styles.emailText}>{email}</Text>

                <Text style={styles.label}>Nueva Contraseña:</Text>
                <TextInput
                    style={inputStyle}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    placeholder="Nueva Contraseña"
                />

                <Text style={styles.label}>Confirmar Nueva Contraseña:</Text>
                <TextInput
                    style={inputStyle}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholder="Confirmar Nueva Contraseña"
                />

                <TouchableOpacity style={buttonStyle} onPress={handleResetPassword} disabled={isLoading}>
                    <Text style={buttonTextStyle}>{isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        paddingVertical: 40,
    },
    card: {
        width: width * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6',
        borderRadius: 10,
        alignItems: 'stretch',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    webCard: {
        width: 400,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#007bff',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
        fontFamily: 'Roboto-Regular',
    },
    input: {
        height: 45,
        borderColor: 'black',
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    webInput: {
        height: 40,
        fontSize: 16,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: 'white',
        paddingVertical: 12,
        borderRadius: 25,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#007bff',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
    },
    webSubmitButton: {
        paddingHorizontal: 40,
        width: 'auto',
    },
    submitButtonText: {
        color: '#007bff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Roboto-Medium',
    },
});

export default ResetPassword;