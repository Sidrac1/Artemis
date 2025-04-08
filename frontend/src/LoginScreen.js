// LoginScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_IP } from "./api/Config";
import { AuthContext } from "./AuthContext";
// --- Importaciones de Notificaciones ---
import * as Notifications from "expo-notifications";
import Constants from "expo-constants"; // Para obtener projectId
// --- Fin Importaciones de Notificaciones ---

const { width, height } = Dimensions.get("window");

// --- Configuración Inicial de Notificaciones (Fuera del componente) ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mostrar alerta cuando la app está en primer plano
    shouldPlaySound: true, // Reproducir sonido
    shouldSetBadge: false, // Actualizar el contador de notificaciones en el ícono (iOS)
  }),
});
// --- Fin Configuración Inicial ---

// --- Función para registrar y obtener token ---
async function registerForPushNotificationsAsync() {
  let token;

  console.log("✅ Checkpoint 1: Entrando a la función registerForPushNotificationsAsync");

  if (Platform.OS === "android") {
    console.log("✅ Checkpoint 2: Configurando canal de notificación para Android");
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  console.log("✅ Checkpoint 3: Verificando permisos existentes");
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    console.log("⚠️ Permiso NO concedido aún, solicitando permiso...");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("✅ Checkpoint 4: Resultado de la solicitud de permiso:", finalStatus);
  } else {
    console.log("✅ Permiso ya concedido:", finalStatus);
  }

  if (finalStatus !== "granted") {
    console.log("❌ Checkpoint 5: Permiso de notificaciones denegado.");
    return null;
  }

  try {
    console.log("✅ Checkpoint 6: Intentando obtener el projectId desde Constants");
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.warn("⚠️ No se encontró projectId. Intentando obtener token sin projectId...");
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("✅ Checkpoint 7: Token obtenido SIN projectId:", token);
    } else {
      console.log("✅ projectId encontrado:", projectId);
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("✅ Checkpoint 8: Token obtenido CON projectId:", token);
    }
  } catch (error) {
    console.error("❌ Checkpoint 9: Error obteniendo el token:", error);
    Alert.alert("Error", "No se pudo obtener el token para notificaciones.");
    return null;
  }

  console.log("✅ Checkpoint 10: Token final retornado:", token);
  return token;
}
// --- Fin Función para registrar y obtener token ---

const LoginScreen = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login, isLoading, setIsLoading } = useContext(AuthContext); // Obtén login, isLoading y setIsLoading del Context
  const [loginError, setLoginError] = useState("");

  // --- Listeners de Notificaciones (Opcional pero recomendado aquí o en App.js) ---
  useEffect(() => {
    // Listener para cuando recibes una notificación con la app en primer plano
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificación recibida:", notification);
        // Aquí podrías actualizar el estado, mostrar un modal, etc.
      }
    );

    // Listener para cuando el usuario interactúa (toca) la notificación
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Interacción con notificación:", response);
        const notificationData = response.notification.request.content.data;
        // Aquí podrías navegar a una pantalla específica basado en notificationData
        // por ejemplo: if (notificationData.screen) navigation.navigate(notificationData.screen);
      });

    // Cleanup listeners al desmontar el componente
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  // --- Fin Listeners ---

  const handleLogin = async () => {
    if (isLoading) {
        return;
    }
    setLoginError("");
    setIsLoading(true);

    if (!userId || !password) {
        setLoginError("Por favor, introduce correo y contraseña.");
        setIsLoading(false);
        return;
    }

    try {
        const response = await axios.post(
            `http://${API_IP}/Artemis/backend/login.php`,
            {
                correo: userId,
                contrasena: password,
            }
        );

        console.log(response.data);

        if (response.data.message === "Inicio de sesión exitoso") {
            await login({
                id_empleado: response.data.id_empleado,
                rol: response.data.rol,
            });

            // Obtener y guardar token ANTES de la navegación
            const pushToken = await registerForPushNotificationsAsync();
            console.log("Token obtenido:", pushToken);

            if (pushToken) {
                try {
                    console.log("Enviando token al backend...", {
                        id_empleado: response.data.id_empleado,
                        token: pushToken,
                    });
                    await axios.post(`http://${API_IP}/Artemis/backend/save_token.php`, {
                        id_empleado: response.data.id_empleado,
                        token: pushToken,
                    });
                    console.log("Token enviado al backend exitosamente.");
                    navigation.navigate("Dashboard"); // Navega después de enviar el token
                } catch (tokenError) {
                    console.error("Error al enviar el token al backend:", tokenError);
                    Alert.alert(
                        "Advertencia",
                        "No se pudo registrar el dispositivo para notificaciones."
                    );
                    navigation.navigate("Dashboard"); // Navega incluso si falla el token.
                }
            } else {
                // No hay token, mostrar alerta o el token
                console.log("No se pudo obtener un token válido. Revisa la consola para más detalles.");
                console.log("Token:", pushToken);
            }
        } else {
            Alert.alert("Error", response.data.message);
        }
    } catch (error) {
        console.error("Error en el login:", error);
        Alert.alert("Error", "Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
        setIsLoading(false);
    }
};

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  const mobileStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F1E6",
    },
    card: {
      width: width * 0.85,
      padding: 20,
      backgroundColor: "#F5F1E6",
      elevation: 5,
      alignItems: "center",
    },
    logo: {
      width: 160,
      height: 160,
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      color: "black",
      alignSelf: "flex-start",
      marginBottom: 5,
    },
    input: {
      height: 40,
      width: "100%",
      borderColor: "black",
      borderWidth: 1.5,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: "white",
      fontFamily: "Roboto-Regular",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    loginButton: {
      backgroundColor: "white",
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignSelf: "center",
      borderWidth: 2,
      borderColor: "black",
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
      fontFamily: "Roboto-Regular",
    },
    recoverPassword: {
      fontSize: 14,
      color: "#444",
      marginTop: 10,
      fontFamily: "Roboto-Regular",
    },
  });

  const desktopStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
    },
    outerContainer: {
      backgroundColor: "#F5F1E6",
      borderWidth: 2,
      borderColor: "black",
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    card: {
      width: width * 0.35,
      padding: 30,
      backgroundColor: "#F5F1E6",
      elevation: 5,
      alignItems: "center",
    },
    logo: {
      width: 160,
      height: 160,
      marginBottom: 10,
    },
    label: {
      fontSize: 14,
      fontFamily: "Roboto-Regular",
      color: "black",
      alignSelf: "flex-start",
      marginBottom: 5,
    },
    input: {
      height: 40,
      width: "100%",
      borderColor: "black",
      borderWidth: 1.5,
      marginBottom: 15,
      paddingHorizontal: 15,
      borderRadius: 8,
      fontSize: 16,
      backgroundColor: "white",
      fontFamily: "Roboto-Regular",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
    },
    loginButton: {
      backgroundColor: "white",
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 25,
      alignSelf: "center",
      borderWidth: 2,
      borderColor: "black",
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
      fontFamily: "Roboto-Regular",
    },
    recoverPassword: {
      fontSize: 14,
      color: "#444",
      marginTop: 10,
      fontFamily: "Roboto-Regular",
    },
  });

  const styles = isMobile ? mobileStyles : desktopStyles;

  return (
    <View style={styles.container}>
      {isMobile ? (
        <View style={styles.card}>
          <Image
            source={require("./assets/images/as.png")}
            style={styles.logo}
          />
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            keyboardType="default"
          />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.recoverPassword}>Recover Password</Text>
        </View>
      ) : (
        <View style={styles.outerContainer}>
          <View style={styles.card}>
            <Image
              source={require("./assets/images/as.png")}
              style={styles.logo}
            />
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              keyboardType="default"
            />
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text style={styles.loginButtonText}>LOG IN</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.recoverPassword}>Recover Password</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default LoginScreen;