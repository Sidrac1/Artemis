import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Notification from './Notification';
import useUserFormLogic from './UserFormLogic';
import { styles } from './UserFormStyles'; // Importa los estilos
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener esta librería instalada

const isWeb = Platform.OS === 'web'; // Corrección del uso de Dimensions

const UserForm = ({ onSubmit }) => {
    const {
        formData,
        errors,
        showPasswordError,
        notification,
        telefonoLength,
        roleOptions,
        genderOptions,
        handleChange,
        handleSubmit,
        handleCloseNotification,
        showEmailAndPassword,
        showPhoneNumber,
    } = useUserFormLogic({ onSubmit });

    const formRef = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
                        style={styles.input}
                        placeholder="Enter your name"
                        placeholderTextColor="#aaa"
                        value={formData.nombre}
                        onChangeText={(text) => handleChange('nombre', text)}
                    />
                    {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

                    <Text style={styles.fieldLabel}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your last name"
                        placeholderTextColor="#aaa"
                        value={formData.apellido_paterno}
                        onChangeText={(text) => handleChange('apellido_paterno', text)}
                    />
                    {errors.apellido_paterno && <Text style={styles.errorText}>{errors.apellido_paterno}</Text>}

                    <Text style={styles.fieldLabel}>Second Last Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your second last name"
                        placeholderTextColor="#aaa"
                        value={formData.apellido_materno}
                        onChangeText={(text) => handleChange('apellido_materno', text)}
                    />
                    {errors.apellido_materno && <Text style={styles.errorText}>{errors.apellido_materno}</Text>}

                    <Text style={styles.fieldLabel}>Select Gender</Text>
                    {!isWeb ? (
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
                    ) : (
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
                    {errors.genero && <Text style={styles.errorText}>{errors.genero}</Text>}

                    {showPhoneNumber && (
                        <View style={{ marginBottom: errors.telefono ? 35 : 10 }}>
                            <Text style={styles.fieldLabel}>Phone number</Text>
                            <View style={mergedStyles.phoneInputContainer}>
                                <TextInput
                                    style={mergedStyles.phoneInput}
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#aaa"
                                    value={formData.telefono}
                                    onChangeText={(text) => {
                                        if (/^[0-9]*$/.test(text) && text.length <= 10) {
                                            handleChange('telefono', text);
                                        }
                                    }}
                                    keyboardType="default"
                                />
                                <Text style={mergedStyles.phoneLengthIndicator}>{telefonoLength}/10</Text>
                            </View>
                            {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
                        </View>
                    )}

                    {showEmailAndPassword && (
                        <>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="example@domain.com"
                                placeholderTextColor="#aaa"
                                value={formData.email}
                                onChangeText={(text) => handleChange('email', text)}
                                keyboardType="email-address"
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                            <Text style={styles.fieldLabel}>Password (Min. 8 characters)</Text>
                            <View style={mergedStyles.passwordInputContainer}>
                                <TextInput
                                    style={mergedStyles.passwordInput}
                                    placeholder="Enter password"
                                    placeholderTextColor="#aaa"
                                    value={formData.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity style={mergedStyles.eyeIcon} onPress={togglePasswordVisibility}>
                                    <Icon
                                        name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color="#aaa"
                                    />
                                </TouchableOpacity>
                            </View>
                            {showPasswordError && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </>
                    )}

                    <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Corrección en los estilos
const localStyles = StyleSheet.create({
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    phoneInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    phoneLengthIndicator: {
        position: 'absolute',
        right: 10,
        fontSize: 12,
        color: '#888',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: '#f9f9f9',
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
});

const mergedStyles = StyleSheet.create({
    ...styles,
    ...localStyles,
});

export default UserForm;