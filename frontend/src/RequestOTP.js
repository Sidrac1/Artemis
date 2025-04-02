import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { API_IP } from "./api/Config";
import { useNavigation } from "@react-navigation/native";
import CustomNotification from "./components/CustomNotification"; // Importa el componente de notificación personalizado

const { width } = Dimensions.get('window');

const RequestOTP = () => {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // La notificación se ocultará después de 3 segundos (ajusta la duración si es necesario)
    };

    const requestOTP = async () => {
        if (!email) {
            showNotification("Please enter your email address.", 'error');
            return;
        }

        try {
            const response = await fetch(`http://${API_IP}/Artemis/backend/send_otp.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${email}`,
            });

            const text = await response.text();
            console.log("Response text:", text);

            try {
                const result = JSON.parse(text);

                if (result.status === "success") {
                    showNotification(result.message, 'success');
                    navigation.navigate("VerifyOTP", { email });
                } else if (result.message === "Email address not found in the system.") {
                    showNotification("Email address not found in the system.", 'error');
                } else {
                    showNotification("There was a problem sending the OTP code. Please try again.", 'error');
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                showNotification("Invalid server response.", 'error');
            }
        } catch (error) {
            console.error("Error making the request:", error);
            showNotification("There was a problem sending the OTP. Please try again.", 'error');
        }
    };

    return (
        <View style={styles.container}>
            <CustomNotification
                message={notification?.message}
                type={notification?.type}
                onClose={() => setNotification(null)}
            />
            <Text style={styles.title}>Recover Password</Text>
            <Text style={styles.label}>Enter your email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Email address"
            />
            <TouchableOpacity style={styles.button} onPress={requestOTP}>
                <Text style={styles.buttonText}>Send Code</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        fontFamily: 'Roboto-Bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
        alignSelf: 'flex-start',
        fontFamily: 'Roboto-Regular',
    },
    input: {
        width: '100%',
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
    button: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium',
    },
});

export default RequestOTP;