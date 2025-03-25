import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createEmpleado } from '../api/Empleados'; // Importa la función createEmpleado

const { width, height } = Dimensions.get('window');

const UserForm = ({ roles, onSubmit }) => {
  const roleOptions = [
    { display: 'SUPERVISOR', value: 'supervisor', code: '702' },
    { display: 'GUARD', value: 'guard', code: '701' },
    { display: 'EMPLOYEE', value: 'employee', code: '703' },
  ];

  const [formData, setFormData] = useState({
    role: roleOptions[0].value,
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    genero: '',
    email: '',
    password: '',
    telefono: '',
    codigo_puesto: roleOptions[0].code, // Inicializar con el código del primer rol
  });

  const handleChange = (name, value) => {
    let newCodePuesto = formData.codigo_puesto;
    if (name === 'role') {
      const selectedRole = roleOptions.find(option => option.value === value);
      if (selectedRole) {
        newCodePuesto = selectedRole.code;
      }
    }
    setFormData({ ...formData, [name]: value, codigo_puesto: newCodePuesto });
  };

  const handleSubmit = async () => {
    try {
      const response = await createEmpleado({
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        codigo_puesto: formData.codigo_puesto,
        telefono: formData.telefono,
        genero: formData.genero,
        rol: formData.role,
        email: formData.email, 
        password: formData.password, 
      });

      if (response && response.message === "Empleado creado") {
        Alert.alert("Éxito", "Empleado creado con éxito");
        setFormData({
          role: roleOptions[0].value,
          nombre: '',
          apellido_paterno: '',
          apellido_materno: '',
          genero: '',
          email: '',
          password: '',
          telefono: '',
          codigo_puesto: roleOptions[0].code,
        });
      } else {
        Alert.alert("Error", "Error al crear empleado");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      Alert.alert("Error", "Error al crear empleado");
    }
  };

  const showEmailAndPassword = formData.role !== 'guard' && formData.role !== 'employee';
  const showPhoneNumber = formData.role !== 'administrator' && formData.role !== 'supervisor';

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <View style={styles.roleContainer}>
            {roleOptions.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleButton,
                  formData.role === role.value && styles.roleButtonSelected,
                ]}
                onPress={() => handleChange('role', role.value)}
              >
                <Text style={styles.roleButtonText}>{role.display}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#aaa"
              value={formData.nombre}
              onChangeText={(text) => handleChange('nombre', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={formData.apellido_paterno}
              onChangeText={(text) => handleChange('apellido_paterno', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Second Last Name"
              placeholderTextColor="#aaa"
              value={formData.apellido_materno}
              onChangeText={(text) => handleChange('apellido_materno', text)}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.genero}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange('genero', itemValue)}
              >
                <Picker.Item label="Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>

            {showPhoneNumber && (
              <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="#aaa"
                value={formData.telefono}
                onChangeText={(text) => handleChange('telefono', text)}
                keyboardType="phone-pad"
              />
            )}

            {showEmailAndPassword ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry={true}
                />
              </>
            ) : null}
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
  },
  outerContainer: {
    backgroundColor: '#e6ddcc',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  card: {
    width: width * 0.25,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'black',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f4f4f4',
    borderRadius: 15,
    marginBottom: 20,
    paddingVertical: 8,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  roleButtonSelected: {
    backgroundColor: '#e6ddcc',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#000',
    fontSize: 16,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  registerButton: {
    backgroundColor: '#e6ddcc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default UserForm;