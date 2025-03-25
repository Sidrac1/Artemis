import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createEmpleado } from '../api/Empleados'; // Importa la función createEmpleado
import Notification from './Notification'; // Importa el componente de notificación

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const UserForm = ({ roles, onSubmit }) => {
  const roleOptions = [
    { display: 'SUPERVISOR', value: 'supervisor', code: '702' },
    { display: 'GUARD', value: 'guard', code: '701' },
    { display: 'EMPLOYEE', value: 'employee', code: '703' },
  ];

  const genderOptions = [
    { display: 'Gender', value: '' },
    { display: 'Male', value: 'Male' },
    { display: 'Female', value: 'Female' },
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
    codigo_puesto: roleOptions[0].code,
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

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
        // Find the display name of the selected role
        const selectedRole = roleOptions.find(option => option.value === formData.role);
        let roleDisplayName = selectedRole ? selectedRole.display : 'User'; // Default to 'User' if not found

        // Format the role display name
        if (roleDisplayName) {
          roleDisplayName = roleDisplayName.charAt(0).toUpperCase() + roleDisplayName.slice(1).toLowerCase();
        }

        setNotification({ message: `${roleDisplayName} successfully registered`, type: 'success' });
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
        setNotification({ message: "Error creating employee", type: 'error' });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setNotification({ message: "Error creating employee", type: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ message: '', type: '' });
  };

  const showEmailAndPassword = formData.role !== 'guard' && formData.role !== 'employee';
  const showPhoneNumber = formData.role !== 'administrator' && formData.role !== 'supervisor';

  return (
    <View style={styles.container}>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
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

            {!isWeb && (
              <View style={styles.genderButtonContainer}>
                {genderOptions.map((gender) => (
                  <TouchableOpacity
                    key={gender.value}
                    style={[
                      styles.genderButton,
                      formData.genero === gender.value && styles.genderButtonSelected,
                    ]}
                    onPress={() => handleChange('genero', gender.value)}
                  >
                    <Text style={styles.genderButtonText}>{gender.display}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {isWeb && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.genero}
                  style={styles.picker}
                  onValueChange={(itemValue) => handleChange('genero', itemValue)}
                >
                  {genderOptions.map((gender) => (
                    <Picker.Item key={gender.value} label={gender.display} value={gender.value} />
                  ))}
                </Picker>
              </View>
            )}

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

const baseScaleMobile = 0.8;
const baseScaleWeb = 1.0;
const mobileOuterContainerWidthPercentage = 0.90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  outerContainer: {
    backgroundColor: '#e6ddcc',
    borderRadius: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    padding: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderColor: 'black',
    maxWidth: isWeb ? 400 : width * mobileOuterContainerWidthPercentage * (1 / baseScaleMobile),
    width: isWeb ? 400 : width * mobileOuterContainerWidthPercentage * baseScaleMobile,
  },
  card: {
    width: '100%',
    padding: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
    backgroundColor: 'white',
    borderRadius: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderColor: 'black',
    marginBottom: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f4f4f4',
    borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    marginBottom: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  roleButton: {
    paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingHorizontal: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    alignItems: 'center',
    borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  roleButtonSelected: {
    backgroundColor: '#e6ddcc',
  },
  roleButtonText: {
    fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  input: {
    height: 40 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderColor: '#ccc',
    borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
    marginBottom: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
    fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
    marginBottom: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40 * (isWeb ? baseScaleWeb : baseScaleMobile),
    width: '100%',
    color: '#000',
    fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  registerButton: {
    backgroundColor: '#e6ddcc',
    paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingHorizontal: 30 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderRadius: 25 * (isWeb ? baseScaleWeb : baseScaleMobile),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
    borderColor: 'black',
  },
  registerButtonText: {
    fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
    fontWeight: 'bold',
    color: 'black',
  },
  genderButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    backgroundColor: '#f4f4f4',
    borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  genderButton: {
    paddingVertical: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
    paddingHorizontal: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
    alignItems: 'center',
    borderRadius: 15 * (isWeb ? baseScaleWeb : baseScaleMobile),
  },
  genderButtonSelected: {
    backgroundColor: '#e6ddcc',
  },
  genderButtonText: {
    fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
    fontWeight: 'bold',
  },
});

export default UserForm;