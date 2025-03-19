import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import EmpleadosScreen from "./screens/EmpleadosMovil";
import EditarEmpleados from "./screens/EditarEmpleados";
import CrearEmpleado from "./screens/CrearEmpleado";
import PuestosFunciones from "./screens/PuestosFunciones";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Editar Empleado" component={EditarEmpleados} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
