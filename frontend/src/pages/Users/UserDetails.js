// Frontend (React Native): UserDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native';
import { getApiUrl } from '../../api/Config';

const UserDetails = ({ route, navigation }) => {
    const { employeeId } = route.params;
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [availableRfids, setAvailableRfids] = useState([]);
    const [loadingRfids, setLoadingRfids] = useState(false);
    const [errorRfids, setErrorRfids] = useState(null);
    const [showRfidDropdown, setShowRfidDropdown] = useState(false);
    const [previousRfid, setPreviousRfid] = useState(null); 
    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `${getApiUrl('updateUserDetails')}?action=getEmployeeDetailsByRole`;
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id_empleado=${employeeId}`,
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                if (data && !data.message) {
                    setUserDetails(data);
                    setUpdatedDetails(data);
                    setPreviousRfid(data.rfid); 
                } else {
                    setError(data?.message || 'Failed to fetch user details.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [employeeId]);

    useEffect(() => {
        const fetchInactiveRfids = async () => {
            if (isEditing && (userDetails?.rol === 'supervisor' || userDetails?.rol === 'empleado')) {
                setLoadingRfids(true);
                setErrorRfids(null);
                try {
                    const apiUrl = `${getApiUrl('updateUserDetails')}?action=getInactiveRfidCodes`;
                    const response = await fetch(apiUrl);
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        let filteredRfids = data.filter(rfid => rfid.estado === 'Inactivo' || rfid.codigo_rfid === userDetails?.rfid);
                        filteredRfids = [{ codigo_rfid: '0', estado: 'Inactivo', tipo: userDetails?.rol }, ...filteredRfids];
                        if (userDetails?.rol) {
                            filteredRfids = filteredRfids.filter(rfid => rfid.tipo === userDetails.rol || rfid.codigo_rfid === '0' || rfid.codigo_rfid === userDetails?.rfid);
                        }
                        setAvailableRfids(filteredRfids);
                    } else {
                        setErrorRfids('Failed to fetch available RFID codes.');
                    }
                } catch (err) {
                    setErrorRfids(err.message);
                } finally {
                    setLoadingRfids(false);
                }
            } else {
                setAvailableRfids([]);
            }
        };
        fetchInactiveRfids();
    }, [isEditing, userDetails?.rol, userDetails?.rfid]);

    const handleInputChange = (name, value) => setUpdatedDetails(prev => ({ ...prev, [name]: value }));
    const handleStartEdit = () => { setIsEditing(true); setUpdatedDetails({ ...userDetails }); setPreviousRfid(userDetails.rfid); }; // Store RFID on edit start
    const handleCancelEdit = () => { setIsEditing(false); setUpdatedDetails(userDetails); setUpdateError(null); setShowRfidDropdown(false); };

    const handleUpdateDetails = async () => {
        setUpdateLoading(true);
        setUpdateError(null);
        const updatesToSend = {};
        let rfidUpdateSuccessful = true;

        const sendRfidUpdate = async (rfidToUpdate, employeeIdToAssign, rfidToRemove = null) => {
            const payload = { id_empleado: employeeIdToAssign };
            if (rfidToRemove !== null) {
                payload.rfid_a_remover = rfidToRemove;
            } else if (rfidToUpdate !== null && rfidToUpdate !== '0') {
                payload.codigo_rfid = rfidToUpdate;
            }

            console.log("Enviando actualización de RFID:", payload);

            try {
                const apiUrl = getApiUrl('actualizar_rfid');
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error(`Error updating RFID: ${response.status}`);
                const data = await response.json();
                console.log("Respuesta de actualización de RFID:", data);
                if (data?.message !== 'RFID updated successfully' && data?.message !== 'RFID desasignado exitosamente.') {
                    setUpdateError(data?.message || 'Failed to update RFID.');
                    return false;
                } else {
                    setUserDetails(prev => ({ ...prev, rfid: payload.codigo_rfid === null ? null : payload.codigo_rfid }));
                    setUpdatedDetails(prev => ({ ...prev, rfid: payload.codigo_rfid === null ? null : payload.codigo_rfid }));
                    Alert.alert('Success', data.message);
                    return true;
                }
            } catch (err) {
                setUpdateError(err.message);
                return false;
            }
        };

        let rfidToUpdateToSend = null;
        let rfidToRemoveToSend = null;

        if (updatedDetails.rfid === '0' && userDetails.rfid) {
            rfidToRemoveToSend = userDetails.rfid;
        } else if (updatedDetails.rfid !== userDetails.rfid && updatedDetails.rfid !== '0') {
            rfidToUpdateToSend = updatedDetails.rfid;
        }

        if (rfidToUpdateToSend !== null || rfidToRemoveToSend !== null) {
            rfidUpdateSuccessful = await sendRfidUpdate(rfidToUpdateToSend, employeeId, rfidToRemoveToSend);
        } else {
            rfidUpdateSuccessful = true; // No RFID change
        }

        if (userDetails?.rol === 'supervisor') {
            if (updatedDetails.correo !== userDetails.correo && updatedDetails.correo !== undefined) updatesToSend.correo = updatedDetails.correo;
            if (updatedDetails.newPassword?.length > 0) updatesToSend.newPassword = updatedDetails.newPassword;
        } else if (userDetails?.rol === 'empleado') {
            if (updatedDetails.telefono !== userDetails.telefono && updatedDetails.telefono !== undefined) updatesToSend.telefono = updatedDetails.telefono;
        } else if (userDetails?.rol === 'guardia') {
            if (updatedDetails.telefono !== userDetails.telefono && updatedDetails.telefono !== undefined) updatesToSend.telefono = updatedDetails.telefono;
        }

        const otherUpdatesToSend = Object.keys(updatesToSend).reduce((obj, key) => {
            if (key !== 'rfid' && key !== 'newPassword') obj[key] = updatesToSend[key];
            return obj;
        }, {});

        if (Object.keys(otherUpdatesToSend).length > 0 && rfidUpdateSuccessful) {
            const apiUrl = `${getApiUrl('updateUserDetails')}?action=updateUserDetailsByRole`;
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_empleado: employeeId, ...otherUpdatesToSend }),
                });
                if (!response.ok) throw new Error(`Error updating details: ${response.status}`);
                const data = await response.json();
                if (data?.message === 'User details updated successfully') {
                    Alert.alert('Success', 'User details updated successfully!', [{ text: 'OK', onPress: () => setIsEditing(false) }]);
                    const fetchUserDetails = async () => {
                        setLoading(true);
                        setError(null);
                        try {
                            const apiUrl = `${getApiUrl('updateUserDetails')}?action=getEmployeeDetailsByRole`;
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: `id_empleado=${employeeId}`,
                            });
                            if (!response.ok) throw new Error(`Error fetching details: ${response.status}`);
                            const data = await response.json();
                            if (data && !data.message) {
                                setUserDetails(data);
                                setUpdatedDetails(data);
                                setPreviousRfid(data.rfid); // Update previous RFID after successful save
                            } else {
                                setError(data?.message || 'Failed to fetch user details.');
                            }
                        } catch (err) {
                            setError(err.message);
                        } finally {
                            setLoading(false);
                        }
                    };
                    if (Object.keys(otherUpdatesToSend).length > 0) fetchUserDetails();
                    else setIsEditing(false);
                } else {
                    setUpdateError(data?.message || 'Failed to update user details.');
                }
            } catch (err) {
                setUpdateError(err.message);
            } finally {
                setUpdateLoading(false);
            }
        } else if (!updateError && (updatedDetails.rfid === userDetails.rfid) && Object.keys(otherUpdatesToSend).length === 0) {
            Alert.alert('Info', 'No changes to update.');
            setIsEditing(false);
            setUpdateLoading(false);
        } else if (!updateError && (updatedDetails.rfid !== userDetails.rfid) && Object.keys(otherUpdatesToSend).length === 0 && rfidUpdateSuccessful) {
            setIsEditing(false);
            setUpdateLoading(false);
        } else if (!updateError && updatedDetails.rfid === '0' && userDetails.rfid && rfidUpdateSuccessful) {
            setIsEditing(false);
            setUpdateLoading(false);
        } else {
            setUpdateLoading(false);
        }
    };

    const translateRole = (rol) => {
        switch (rol) {
            case 'supervisor': return 'Supervisor';
            case 'guardia': return 'Guard';
            case 'empleado': return 'General Employee';
            case 'admin': return 'Administrator';
            default: return rol;
        }
    };

    const handleRfidSelect = (rfid) => {
        const textToShow = rfid === '0' ? 'Remove' : rfid;
        console.log("RFID seleccionado:", rfid);
        setUpdatedDetails(prev => ({ ...prev, rfid: rfid === '0' ? '0' : rfid, rfidText: textToShow }));
        setShowRfidDropdown(false);
    };

    if (loading) return <View><Text>Loading...</Text><ActivityIndicator /></View>;
    if (error) return <ScrollView><TouchableOpacity onPress={() => navigation.goBack()}><Text>Back</Text></TouchableOpacity><Text>Error loading user details: {error}</Text></ScrollView>;
    if (!userDetails) return <View><TouchableOpacity onPress={() => navigation.goBack()}><Text>Back</Text></TouchableOpacity><Text>No user details found for ID: {employeeId}</Text></View>;

    return (
        <ScrollView>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text>Back</Text></TouchableOpacity>
            <Text>USER DETAILS</Text>

            <View>
                <Text><Text>Role:</Text> {translateRole(userDetails.rol)}</Text>
                <Text><Text>Employee ID:</Text> {userDetails.ID}</Text>
                <Text><Text>Name:</Text> {userDetails.nombre}</Text>
                <Text><Text>Last Name:</Text> {userDetails.apellido_paterno}</Text>
                {userDetails.apellido_materno && <Text><Text>Second Last Name:</Text> {userDetails.apellido_materno}</Text>}
                {userDetails.genero && <Text><Text>Gender:</Text> {userDetails.genero}</Text>}

                {isEditing ? (
                    <>
                        {(userDetails.rol === 'supervisor') && (
                            <>
                                <Text>Email:</Text>
                                <TextInput value={updatedDetails.correo} onChangeText={(text) => handleInputChange('correo', text)} keyboardType="email-address" />
                                <Text>New Password:</Text>
                                <TextInput placeholder="Enter new password" secureTextEntry onChangeText={(text) => handleInputChange('newPassword', text)} />
                                <Text>RFID:</Text>
                                <TouchableOpacity onPress={() => setShowRfidDropdown(!showRfidDropdown)}>
                                    <Text>{updatedDetails.rfid === '0' ? 'Remove' : updatedDetails.rfid || 'Select RFID'}</Text>
                                </TouchableOpacity>
                                {showRfidDropdown && (
                                    <View>
                                        {loadingRfids ? (
                                            <ActivityIndicator size="small" />
                                        ) : errorRfids ? (
                                            <Text>{errorRfids}</Text>
                                        ) : (
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                {availableRfids.map((rfid) => (
                                                    <TouchableOpacity key={rfid.codigo_rfid} onPress={() => handleRfidSelect(rfid.codigo_rfid)}>
                                                        <Text>{rfid.codigo_rfid === '0' ? 'Remove' : rfid.codigo_rfid}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                )}
                            </>
                        )}
                        {(userDetails.rol === 'empleado') && (
                            <>
                                <Text>Phone:</Text>
                                <TextInput value={updatedDetails.telefono} onChangeText={(text) => handleInputChange('telefono', text)} keyboardType="phone-pad" />
                                <Text>RFID:</Text>
                                <TouchableOpacity onPress={() => setShowRfidDropdown(!showRfidDropdown)}>
                                    <Text>{updatedDetails.rfid === '0' ? 'Remove' : updatedDetails.rfid || 'Select RFID'}</Text>
                                </TouchableOpacity>
                                {showRfidDropdown && (
                                    <View>
                                        {loadingRfids ? (
                                            <ActivityIndicator size="small" />
                                        ) : errorRfids ? (
                                            <Text>{errorRfids}</Text>
                                        ) : (
                                            <ScrollView style={{ maxHeight: 150 }}>
                                                {availableRfids.map((rfid) => (
                                                    <TouchableOpacity key={rfid.codigo_rfid} onPress={() => handleRfidSelect(rfid.codigo_rfid)}>
                                                        <Text>{rfid.codigo_rfid === '0' ? 'Remove' : rfid.codigo_rfid}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                )}
                            </>
                        )}
                        {(userDetails.rol === 'guardia') && (
                            <><Text>Phone:</Text><TextInput value={updatedDetails.telefono} onChangeText={(text) => handleInputChange('telefono', text)} keyboardType="phone-pad" /></>
                        )}
                        {updateError && <Text>{updateError}</Text>}
                        <TouchableOpacity onPress={handleUpdateDetails} disabled={updateLoading}><Text>{updateLoading ? 'Saving...' : 'Save'}</Text></TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit}><Text>Cancel</Text></TouchableOpacity>
                    </>
                ) : (
                    <>
                        {userDetails.rfid && <Text><Text>RFID:</Text> {userDetails.rfid}</Text>}
                        {userDetails.telefono && <Text><Text>Phone:</Text> {userDetails.telefono}</Text>}
                        {userDetails.correo && <Text><Text>Email:</Text> {userDetails.correo}</Text>}
                        <TouchableOpacity onPress={handleStartEdit}><Text>Edit Details</Text></TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default UserDetails;