// RouteForm.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { createRonda } from "../api/Ronda";
import { createRondaGuardia } from "../api/RondaGuardia";

// Conditional import for mobile (Expo)
let DateTimePicker = null;
if (Platform.OS !== 'web') {
  ({ default: DateTimePicker } = require('@react-native-community/datetimepicker'));
}

// Conditional import for web
let DatePickerWeb = null;
let datepickerCSS = null;
if (Platform.OS === 'web') {
  import('react-datepicker').then(module => {
    DatePickerWeb = module.default;
    import('react-datepicker/dist/react-datepicker.css'); // Import CSS for web
  });
}

const { width, height } = Dimensions.get("window");

const RouteForm = ({ selectedGuard }) => {
  const navigation = useNavigation();
  const [routeName, setRouteName] = useState("");
  const [frequency, setFrequency] = useState("15 Minutes");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedSectors, setSelectedSectors] = useState({
    "Sector A": false,
    "Sector B": false,
    "Sector C": false,
    "Sector D": false,
  });
  const [sectorOrder, setSectorOrder] = useState([]);
  const [sectorInput, setSectorInput] = useState("");

  // Estados para controlar la visibilidad de los pickers de fecha y hora en móvil
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateMode, setStartDateMode] = useState("datetime");
  const [endDateMode, setEndDateMode] = useState("datetime");

  const toggleSector = (sector) => {
    setSelectedSectors((prev) => ({
      ...prev,
      [sector]: !prev[sector],
    }));
    setSectorOrder((prev) => {
      if (prev.includes(sector)) {
        return prev.filter((s) => s !== sector);
      } else {
        return [...prev, sector];
      }
    });
  };

  useEffect(() => {
    setSectorInput(sectorOrder.map((sector) => sector.slice(-1)).join(" -> "));
  }, [sectorOrder]);

  const handleSubmit = async () => {
    try {
      const rondaData = {
        nombre: routeName,
        hora_inicio: startDate.toISOString(),
        hora_fin: endDate.toISOString(),
        intervalos: frequency,
        secuencia: sectorOrder.map((sector) => sector.slice(-1)).join(" "),
      };

      const createdRonda = await createRonda(rondaData);
      console.log("Ronda creada:", createdRonda);

      if (!createdRonda || !createdRonda.codigo) {
        throw new Error("Error al crear la ronda, no se obtuvo el código.");
      }

      const guardId = selectedGuard.ID;
      if (!guardId) {
        throw new Error("El objeto selectedGuard no contiene el ID del guardia.");
      }

      const rondaGuardiaData = {
        codigo_ronda: createdRonda.codigo,
        id_guardia: guardId,
      };
      console.log("Datos para ronda_guardia:", rondaGuardiaData);

      const createdRondaGuardia = await createRondaGuardia(rondaGuardiaData);
      console.log("Ronda-Guardia creada:", createdRondaGuardia);

      alert(`Ronda creada exitosamente con guardia: ${selectedGuard.nombre} ${selectedGuard.apellido_paterno}`);
      navigation.navigate("Patrols");
    } catch (error) {
      console.error("Error al crear la ronda o ronda-guardia:", error);
      alert("Hubo un error al crear la ronda.");
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  const showStartDatepicker = (mode) => {
    setStartDateMode(mode);
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = (mode) => {
    setEndDateMode(mode);
    setShowEndDatePicker(true);
  };

  const SectorButton = ({ sector, label, style }) => (
    <TouchableOpacity
      style={[styles.sectorLabel, style, selectedSectors[sector] && styles.sectorSelected]}
      onPress={() => toggleSector(sector)}
    >
      <Text style={styles.sectorName}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            placeholderTextColor="#aaa"
            value={routeName}
            onChangeText={setRouteName}
          />

          <View style={styles.sectorsContainer}>
            <Image
              source={require("../assets/images/maqueta.jpg")}
              style={styles.houseImage}
              resizeMode="contain"
            />
            <SectorButton sector="Sector A" label="Sector A" style={styles.topLeft} />
            <SectorButton sector="Sector B" label="Sector B" style={styles.topRight} />
            <SectorButton sector="Sector C" label="Sector C" style={styles.bottomLeft} />
            <SectorButton sector="Sector D" label="Sector D" style={styles.bottomRight} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Selected Sectors"
            placeholderTextColor="#aaa"
            value={sectorInput}
            editable={false}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              style={styles.picker}
              onValueChange={(itemValue) => setFrequency(itemValue)}
            >
              <Picker.Item label="15 Minutes" value="15 Minutes" />
              <Picker.Item label="30 Minutes" value="30 Minutes" />
              <Picker.Item label="1 Hour" value="1 Hour" />
            </Picker>
          </View>

          {Platform.OS === 'web' && DatePickerWeb ? (
            <>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>Start Date:</Text>
                <DatePickerWeb
                  selected={startDate}
                  onChange={setStartDate}
                  dateFormat="yyyy-MM-dd h:mm aa"
                  showTimeSelect
                />
              </View>

              <View style={styles.dateTimeContainer}>
                <Text style={styles.dateTimeText}>End Date:</Text>
                <DatePickerWeb
                  selected={endDate}
                  onChange={setEndDate}
                  dateFormat="yyyy-MM-dd h:mm aa"
                  showTimeSelect
                />
              </View>
            </>
          ) : (
            <>
              {Platform.OS !== 'web' && DateTimePicker && (
                <>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateTimeText}>Start Date:</Text>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => showStartDatepicker('date')}>
                      <Text style={styles.datePickerText}>{startDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timePickerButton} onPress={() => showStartDatepicker('time')}>
                      <Text style={styles.timePickerText}>{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                      <DateTimePicker
                        testID="startDatePicker"
                        value={startDate}
                        mode={startDateMode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeStartDate}
                      />
                    )}
                  </View>

                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateTimeText}>End Date:</Text>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => showEndDatepicker('date')}>
                      <Text style={styles.datePickerText}>{endDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.timePickerButton} onPress={() => showEndDatepicker('time')}>
                      <Text style={styles.timePickerText}>{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                      <DateTimePicker
                        testID="endDatePicker"
                        value={endDate}
                        mode={endDateMode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeEndDate}
                      />
                    )}
                  </View>
                </>
              )}
            </>
          )}

          <TouchableOpacity style={styles.finishButton} onPress={handleSubmit}>
            <Text style={styles.finishButtonText}>FINISH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingTop: height * 0.02,
  },
  outerContainer: {
    backgroundColor: "#e6ddcc",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: "black",
  },
  card: {
    width: width * 0.25,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  sectorsContainer: {
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  houseImage: {
    width: width * 0.14,
    height: width * 0.14,
  },
  sectorLabel: {
    position: "absolute",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
  },
  topLeft: {
    bottom: "0%",
    left: "50%",
  },
  topRight: {
    top: "22%",
    left: "12%",
  },
  bottomLeft: {
    top: "2%",
    right: "40%",
  },
  bottomRight: {
    right: "12%",
    top: "28%",
  },
  sectorName: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 40,
    width: "100%",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateTimeText: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    marginRight: 5,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
  },
  finishButton: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
export default RouteForm;
