import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../../api/Config';
import HeaderTitleBoxID from '../../components/HeaderTitleBoxIDS';

const ReportDetails = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [ronda, setRonda] = useState(null);
    const [pulsaciones, setPulsaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const rondaResponse = await fetch(getApiUrl('active_patrols'));
                if (!rondaResponse.ok) {
                    throw new Error(`HTTP error! status: ${rondaResponse.status}`);
                }
                const rondaData = await rondaResponse.json();
                const selectedRonda = rondaData.find(item => item.codigo === id);
                if (selectedRonda) {
                    setRonda(selectedRonda);
                } else {
                    console.error(`Round with ID ${id} not found.`);
                    setError('Round not found.');
                }

                const pulsacionesResponse = await fetch(`${getApiUrl('ruta_pulsasiones')}?codigo_ronda=${id}`);
                if (!pulsacionesResponse.ok) {
                    throw new Error(`HTTP error! status: ${pulsacionesResponse.status}`);
                }
                const pulsacionesData = await pulsacionesResponse.json();
                setPulsaciones(pulsacionesData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const getPulsacionStatus = (timestamp) => {
        const pulsacionTime = new Date(timestamp).getTime();
        const now = Date.now();
        const diffMinutes = Math.floor((now - pulsacionTime) / (1000 * 60));

        if (diffMinutes <= 3) {
            return (
                <View style={styles.statusContainer}>
                    <Ionicons name="checkmark-circle" size={20} color="green" />
                    <Text style={styles.statusText}>OK</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.statusContainer}>
                    <Ionicons name="warning" size={20} color="red" />
                    <Text style={styles.statusText}>Alert</Text>
                </View>
            );
        }
    };

    const calculatePulsacionDescription = (pulsacion, frequency) => {
        const pulsacionTime = new Date(pulsacion.timestamp).getTime();
        const rondaStartTime = new Date(ronda.start).getTime();
        const elapsedTime = pulsacionTime - rondaStartTime;
        const expectedTime = frequency * 60 * 1000;

        const difference = Math.abs(elapsedTime - expectedTime);
        let differenceMinutes = Math.floor(difference / (1000 * 60));

        const sectors = ronda.sectors.split(' ');
        const sectorIndex = sectors.indexOf(pulsacion.ubicacion);

        const getRelativeTimeInfo = () => {
            const cycleTime = frequency * sectors.length * 60 * 1000;
            let relativeElapsedTime = elapsedTime % cycleTime;
            if (relativeElapsedTime < 0) {
                relativeElapsedTime += cycleTime;
            }
            const expectedRelativeTime = (sectors.indexOf(pulsacion.ubicacion) * frequency * 60 * 1000);
            const relativeDifference = Math.abs(relativeElapsedTime - expectedRelativeTime);
            const relativeDifferenceMinutes = Math.floor(relativeDifference / (1000 * 60));
            return { relativeDifferenceMinutes };
        };

        if (sectorIndex === -1) {
            const timeDifferenceNow = Math.floor((Date.now() - pulsacionTime) / (1000 * 60));
            const earlyOrLate = timeDifferenceNow < 0 ? 'early' : 'late';
            const absTimeDifference = Math.abs(timeDifferenceNow);
            const timeString = absTimeDifference >= 60 ? `${Math.floor(absTimeDifference / 60)} hours ${absTimeDifference % 60} minutes` : `${absTimeDifference} minutes`;
            return `Sector not in expected sequence, pressed ${timeString} ${earlyOrLate}.`;
        }

        const expectedSectorTime = rondaStartTime + (frequency * sectorIndex * 60 * 1000);
        const { relativeDifferenceMinutes } = getRelativeTimeInfo();

        if (relativeDifferenceMinutes <= 3) {
            return 'Pulsation within expected time.';
        } else if (elapsedTime < expectedSectorTime && relativeDifferenceMinutes <= 5) {
            return 'Pulsation pressed early.';
        } else if (elapsedTime > expectedSectorTime && relativeDifferenceMinutes > 3) {
            let displayTime = `${relativeDifferenceMinutes} minutes`;
            if (relativeDifferenceMinutes >= 60) {
                const hours = Math.floor(relativeDifferenceMinutes / 60);
                const minutes = relativeDifferenceMinutes % 60;
                displayTime = `${hours} hours ${minutes} minutes`;
            }
            return `Pulsation pressed late (${displayTime}).`;
        } else {
            const { relativeDifferenceMinutes } = getRelativeTimeInfo();
            return `Pulsation out of sequence.`;
        }
    };

    const formatSectors = (sectors) => {
        if (!sectors) return '';
        return sectors.split(' ').join(' -> ');
    };

    const getRoundStatus = (end) => {
        if (!end) {
            return { status: 'In progress', color: 'green' };
        } else {
            return { status: 'Finalized', color: 'red' };
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!ronda) {
        return (
            <View style={styles.container}>
                <Text>Round data not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <ScrollView style={styles.content}>
                <HeaderTitleBoxID iconName="clipboard-list" id={id} />

                <View style={[styles.infoContainer, { marginTop: 10 }]}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{ronda.nombre}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Guard:</Text>
                    <Text style={styles.infoValue}>{ronda.guard}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Start:</Text>
                    <Text style={styles.infoValue}>{ronda.start}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>End:</Text>
                    <Text style={styles.infoValue}>{ronda.end}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Sectors:</Text>
                    <Text style={styles.infoValue}>{formatSectors(ronda.sectors)}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Frequency:</Text>
                    <Text style={styles.infoValue}>{ronda.frequency} Minutes per sector</Text>
                </View>

                <View style={styles.pulsacionesContainerOuter}>
                    <View style={styles.pulsacionesContainerInner}>
                        <View style={styles.pulsationHeader}>
                            <Text style={styles.title}>Pulsations:</Text>
                            <Text style={[styles.roundStatus, { color: getRoundStatus(ronda.end).color }]}>
                                {getRoundStatus(ronda.end).status}
                            </Text>
                        </View>
                        <ScrollView style={styles.pulsacionesScroll}>
                            {pulsaciones.length === 0 ? (
                                <Text style={styles.noPulsations}>No pulsations found.</Text>
                            ) : (
                                pulsaciones.map((pulsacion, index) => (
                                    <React.Fragment key={index}>
                                        <View style={styles.pulsacionItem}>
                                            <View style={styles.pulsacionDetails}>
                                                <Text style={styles.pulsacionTextBold}>Location: {pulsacion.ubicacion}</Text>
                                                <Text style={styles.pulsacionText}>Time: {pulsacion.timestamp}</Text>
                                                <Text style={styles.pulsacionText}>Desc: {calculatePulsacionDescription(pulsacion, ronda.frequency)}</Text>
                                            </View>
                                            <View style={styles.pulsacionStatus}>
                                                {getPulsacionStatus(pulsacion.timestamp)}
                                            </View>
                                        </View>
                                        {index < pulsaciones.length - 1 && <View style={styles.separator} />}
                                    </React.Fragment>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#faf9f9',
        padding: 10,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        position: "absolute",
        top: 30,
        left: 10,
        backgroundColor: "#ddd",
        borderRadius: 8,
        zIndex: 1000,
    },
    backText: {
        marginLeft: 5,
        fontSize: 14,
        color: "black",
    },
    content: {
        paddingTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
    },
    pulsacionesContainerOuter: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginTop: 20,
        backgroundColor: '#f5f1e6',
    },
    pulsacionesContainerInner: {
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        padding: 12,
        maxHeight: 400,
    },
    pulsacionesScroll: {
        flexGrow: 1,
    },
    pulsacionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    pulsacionDetails: {
        flex: 1,
    },
    pulsacionText: {
        fontSize: 14,
        marginBottom: 3,
    },
    pulsacionTextBold: {
        fontSize: 14,
        marginBottom: 3,
        fontWeight: 'bold',
    },
    pulsacionStatus: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        flexDirection: 'row',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        marginLeft: 5,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    noPulsations: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        paddingVertical: 10,
    },
    pulsationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    roundStatus: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Barra de separación con ligera opacidad
    },
});

export default ReportDetails;