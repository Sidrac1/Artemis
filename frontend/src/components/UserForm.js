// Lógica del componente UserForm (fusionado de Código 1 y Código 2)
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createEmpleado } from '../api/Empleados'; // Importa la función createEmpleado
import Notification from './Notification'; // Importa el componente de notificación
import useValidation from './Validations'; // Importa el hook de validaciones

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const UserForm = ({ roles, onSubmit }) => {
    const { validateName, validatePhone, validateEmail, validateGender, validatePassword } = useValidation();

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

    const [errors, setErrors] = useState({});
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [telefonoLength, setTelefonoLength] = useState(0);

    const handleChange = (name, value) => {
        let newCodePuesto = formData.codigo_puesto;
        if (name === 'role') {
            const selectedRole = roleOptions.find(option => option.value === value);
            if (selectedRole) {
                newCodePuesto = selectedRole.code;
            }
            setFormData({ ...formData, [name]: value, codigo_puesto: newCodePuesto });
            setErrors({ ...errors, [name]: null });
            setShowPasswordError(false); // Reset password error visibility on role change
            return;
        }

        let processedValue = value;
        let errorMessage = null;

        switch (name) {
            case 'nombre':
            case 'apellido_paterno':
            case 'apellido_materno':
                errorMessage = validateName(value);
                if (!/^[a-zA-Z\s]*$/.test(value) && value !== '') return;
                break;
            case 'telefono':
                if (!/^[0-9]*$/.test(value) && value !== '') return;
                if (value.length <= 10) processedValue = value;
                else return;
                errorMessage = validatePhone(processedValue);
                setTelefonoLength(processedValue.length);
                break;
            case 'email':
                errorMessage = validateEmail(value);
                break;
            case 'password':
                // We don't validate on change anymore for password
                break;
            case 'genero':
                setFormData({ ...formData, [name]: value });
                setErrors({ ...errors, [name]: null });
                setShowPasswordError(false); // Reset password error visibility on gender change
                return;
            default:
                break;
        }

        setFormData({ ...formData, [name]: processedValue });
        setErrors({ ...errors, [name]: errorMessage });
        if (name !== 'password') {
            setShowPasswordError(false); // Hide password error if other fields change
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nombre: validateName(formData.nombre),
            apellido_paterno: validateName(formData.apellido_paterno),
            apellido_materno: validateName(formData.apellido_materno),
            telefono: validatePhone(formData.telefono),
            email: validateEmail(formData.email),
            genero: validateGender(formData.genero),
            password: validatePassword(formData.password),
        };

        setErrors(newErrors);
        setShowPasswordError(!!newErrors.password); // Show password error if validation fails
        for (const key in newErrors) {
            if (newErrors[key]) {
                isValid = false;
                break;
            }
        }
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
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
                    setTelefonoLength(0);
                    setErrors({});
                    setShowPasswordError(false);
                    if (onSubmit) {
                        onSubmit(formData);
                    }
                } else {
                    setNotification({ message: "Error creating employee", type: 'error' });
                }
            } catch (error) {
                console.error("Error in handleSubmit:", error);
                setNotification({ message: "Error creating employee", type: 'error' });
            }
        } else {
            setNotification({ message: "Please correct the form errors", type: 'error' });
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

                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                        style={[styles.input, errors.nombre && styles.inputError]}
                        placeholder="Name"
                        placeholderTextColor="#aaa"
                        value={formData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

                    <Text style={styles.fieldLabel}>Last Name</Text>
                    <TextInput
                        style={[styles.input, errors.apellido_paterno && styles.inputError]}
                        placeholder="Last Name"
                        placeholderTextColor="#aaa"
                        value={formData.apellido_paterno}
                        onChangeText={(text) => handleChange('apellido_paterno', text)}
                    />
                    {errors.apellido_paterno && <Text style={styles.errorText}>{errors.apellido_paterno}</Text>}

                    <Text style={styles.fieldLabel}>Second Last Name</Text>
                    <TextInput
                        style={[styles.input, errors.apellido_materno && styles.inputError]}
                        placeholder="Second Last Name"
                        placeholderTextColor="#aaa"
                        value={formData.apellido_materno}
                        onChangeText={(text) => handleChange('apellido_materno', text)}
                    />
                    {errors.apellido_materno && <Text style={styles.errorText}>{errors.apellido_materno}</Text>}

                    <Text style={styles.fieldLabel}>Select Gender</Text>
                    {!isWeb && (
                        <View style={[styles.genderButtonContainer, errors.genero && styles.errorBorder]}>
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
                    {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

                    {isWeb && (
                        <View style={[styles.pickerContainer, errors.genero && styles.errorBorder]}>
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
                        <View>
                            <Text style={styles.fieldLabel}>Phone</Text>
                            <TextInput
                                style={[styles.input, errors.telefono && styles.inputError]}
                                placeholder="Phone"
                                placeholderTextColor="#aaa"
                                value={formData.telefono}
                                onChangeText={(text) => {
                                    if (/^[0-9]*$/.test(text) && text.length <= 10) {
                                        handleChange('telefono', text);
                                    }
                                }}
                                keyboardType="phone-pad"
                            />
                            <Text style={styles.phoneLengthIndicator}>{telefonoLength}/10</Text>
                            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
                        </View>
                    )}

                    {showEmailAndPassword ? (
                        <>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                placeholder="Email"
                                placeholderTextColor="#aaa"
                                value={formData.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                            <Text style={styles.fieldLabel}>Password (Min. 8 characters)</Text>
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                placeholder="Password"
                                placeholderTextColor="#aaa"
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                secureTextEntry={true}
                            />
                            {showPasswordError && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </>
                    ) : null}

                    <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default UserForm;

// Separador para los estilos// Estilos del componente UserForm (fusionados de Código 1 y Código 2)
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
    fieldLabel: {
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontWeight: 'bold',
        marginBottom: 5 * (isWeb ? baseScaleWeb : baseScaleMobile),
        color: '#333',
    },
    input: {
        height: 40 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderColor: '#ccc',
        borderWidth: 1 * (isWeb ? baseScaleWeb : baseScaleMobile),
        marginBottom: 2 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingHorizontal: 10 * (isWeb ? baseScaleWeb : baseScaleMobile),
        paddingVertical: 8 * (isWeb ? baseScaleWeb : baseScaleMobile),
        borderRadius: 6 * (isWeb ? baseScaleWeb : baseScaleMobile),
        fontSize: 16 * (isWeb ? baseScaleWeb : baseScaleMobile),
        backgroundColor: '#f9f9f9',
    },
    inputError: {
        borderColor: 'red',
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
        marginTop: 10,
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
    errorText: {
        color: 'red',
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
    },
    errorBorder: {
        borderColor: 'red',
    },
    phoneLengthIndicator: {
        fontSize: 12 * (isWeb ? baseScaleWeb : baseScaleMobile),
        color: '#777',
        textAlign: 'right',
        marginTop: 2,
    },
});