// VerifyOTP.js
import { useState } from "react";
import { View, TextInput, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { API_IP } from "./api/Config";
import { useNavigation } from "@react-navigation/native";
import CustomNotification from "./components/CustomNotification"; // Importa el componente de notificación personalizado

const { width } = Dimensions.get('window');

const VerifyOTP = ({ route }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState("");
    const navigation = useNavigation();
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000); // La notificación se ocultará después de 3 segundos (ajusta la duración si es necesario)
    };

    const verifyOTP = async () => {
        if (!otp) {
            showNotification("Please enter the verification code.", 'error');
            return;
        }

        try {
            const response = await fetch(`http://${API_IP}/Artemis/backend/verify_otp.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${email}&otp=${otp}`,
            });

            const text = await response.text();
            console.log("Verify OTP Response:", text);

            try {
                const result = JSON.parse(text);

                if (result.status === "success") {
                    showNotification(result.message, 'success');
                    navigation.navigate("ResetPassword", { email });
                } else {
                    showNotification("The verification code is incorrect.", 'error');
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                showNotification("Invalid server response.", 'error');
            }
        } catch (error) {
            console.error("Error making the request:", error);
            showNotification("There was a problem verifying the OTP. Please try again.", 'error');
        }
    };

    return (
        <View style={styles.container}>
            <CustomNotification
                message={notification?.message}
                type={notification?.type}
                onClose={() => setNotification(null)}
            />
            <Text style={styles.title}>Code Verification</Text>
            <Text style={styles.infoText}>A verification code has been sent to:</Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.label}>Enter the code:</Text>
            <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                placeholder="OTP Code"
                maxLength={6} // Ajusta la longitud según tu necesidad
            />
            <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                <Text style={styles.buttonText}>Verify Code</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.85,
        padding: 20,
        backgroundColor: '#F5F1E6', // Similar background
        borderRadius: 8, // Slightly softer corners
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Less intense shadow
        borderWidth: 1, // Subtle border
        borderColor: '#ddd',
    },
    title: {
        fontSize: 24, // Slightly larger title
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#4a4a4a', // Darker gray title
        fontFamily: 'Roboto-Bold',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666', // Medium gray info text
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
    },
    emailText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0056b3', // Darker blue for email
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        alignSelf: 'flex-start',
        fontFamily: 'Roboto-Regular',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#ccc', // Light gray border
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 18,
        fontSize: 16,
        backgroundColor: 'white',
        fontFamily: 'Roboto-Regular',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        alignSelf: 'center',
        borderWidth: 1.5,
        borderColor: '#007bff', // Primary blue color
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    buttonText: {
        color: '#007bff', // Primary blue text
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium',
    },
});

export default VerifyOTP;