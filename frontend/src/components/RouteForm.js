// RouteForm.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importar Picker aunque no se use directamente en móvil
import { useNavigation } from "@react-navigation/native";
import { createRonda } from "../api/Ronda";
import { createRondaGuardia } from "../api/RondaGuardia";
import { styles as webStyles } from "./RouteForm.styles";
import { styles as mobileStyles } from "./RouteForm.styles.mobile";

// Conditional import for mobile (Expo)
let DateTimePicker = null;
if (Platform.OS !== 'web') {
  ({ default: DateTimePicker } = require('@react-native-community/datetimepicker'));
}

// Conditional import for web
let DatePickerWeb = null;
if (Platform.OS === 'web') {
  import('react-datepicker').then(module => {
    DatePickerWeb = module.default;
    import('react-datepicker/dist/react-datepicker.css'); // Import CSS for web
  });
}

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
  const [startDateMode, setStartDateMode] = useState("datetime"); // Ahora es 'datetime' por defecto
  const [endDateMode, setEndDateMode] = useState("datetime"); // Ahora es 'datetime' por defecto

  const frequencyOptions = ["15 Minutes", "30 Minutes", "1 Hour"];

  // Determinar qué estilos usar basados en la plataforma
  const currentStyles = Platform.OS === 'web' ? webStyles : mobileStyles;

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

  const showStartDatepicker = () => {
    setStartDateMode('datetime');
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setEndDateMode('datetime');
    setShowEndDatePicker(true);
  };

  const SectorCheckbox = ({ sector, label, style }) => {
    const isChecked = selectedSectors[sector];
    const order = sectorOrder.indexOf(sector) + 1;
    const displayOrder = isChecked && order > 0 ? `${order}` : '';

    return (
      <TouchableOpacity
        style={[currentStyles.checkboxContainer, style]}
        onPress={() => toggleSector(sector)}
      >
        <View style={[currentStyles.checkbox, isChecked && currentStyles.checkboxChecked]}>
          {displayOrder !== '' && <Text style={currentStyles.checkboxNumber}>{displayOrder}</Text>}
        </View>
        <Text style={currentStyles.sectorName}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={currentStyles.container}>
      <View style={currentStyles.outerContainer}>
        <View style={currentStyles.card}>
          <Text style={currentStyles.label}>Route Name</Text>
          <TextInput
            style={currentStyles.input}
            value={routeName}
            onChangeText={setRouteName}
          />

          <Text style={currentStyles.label}>Select Sectors:</Text>
          <View style={currentStyles.sectorsContainer}>
            <Image
              source={require("../assets/images/maqueta.jpg")}
              style={currentStyles.houseImage}
              resizeMode="contain"
            />
            <SectorCheckbox sector="Sector A" label="Sector A" style={currentStyles.topLeft} />
            <SectorCheckbox sector="Sector B" label="Sector B" style={currentStyles.topRight} />
            <SectorCheckbox sector="Sector C" label="Sector C" style={currentStyles.bottomLeft} />
            <SectorCheckbox sector="Sector D" label="Sector D" style={currentStyles.bottomRight} />
          </View>

          <Text style={currentStyles.label}>Selected Sectors</Text>
          <TextInput
            style={currentStyles.input}
            value={sectorInput}
            editable={false}
          />

          <Text style={currentStyles.label}>Frecuency by sector.</Text>
          {Platform.OS === 'web' ? (
            <View style={currentStyles.pickerContainer}>
              <Picker
                selectedValue={frequency}
                style={currentStyles.picker}
                onValueChange={(itemValue) => setFrequency(itemValue)}
              >
                {frequencyOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          ) : (
            <View style={currentStyles.frequencyOptionsContainer}>
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    currentStyles.frequencyOptionButton,
                    frequency === option && currentStyles.frequencyOptionButtonActive,
                  ]}
                  onPress={() => setFrequency(option)}
                >
                  <Text
                    style={[
                      currentStyles.frequencyOptionText,
                      frequency === option && currentStyles.frequencyOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={currentStyles.dateTimeLabel}>Start Date & Time:</Text>
          {Platform.OS === 'web' && DatePickerWeb ? (
            <DatePickerWeb
              selected={startDate}
              onChange={setStartDate}
              dateFormat="MMMM d,<ctrl3348> h:mm aa"
              showTimeSelect
            />
          ) : (
            Platform.OS !== 'web' && DateTimePicker && (
              <View style={currentStyles.dateContainer}>
                <TouchableOpacity style={currentStyles.dateTimeWrapper} onPress={showStartDatepicker}>
                  <Text style={currentStyles.dateInput}>{startDate.toLocaleString('en-US')}</Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                  <DateTimePicker
                    testID="startDatePicker"
                    value={startDate}
                    mode={startDateMode}
                    is24Hour={false}
                    display="default"
                    onChange={onChangeStartDate}
                  />
                )}
              </View>
            )
          )}

          <Text style={currentStyles.dateTimeLabel}>End Date & Time:</Text>
          {Platform.OS === 'web' && DatePickerWeb ? (
            <DatePickerWeb
              selected={endDate}
              onChange={setEndDate}
              dateFormat="MMMM d,<ctrl3348> h:mm aa"
              showTimeSelect
            />
          ) : (
            Platform.OS !== 'web' && DateTimePicker && (
              <View style={currentStyles.dateContainer}>
                <TouchableOpacity style={currentStyles.dateTimeWrapper} onPress={showEndDatepicker}>
                  <Text style={currentStyles.dateInput}>{endDate.toLocaleString('en-US')}</Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDatePicker"
                    value={endDate}
                    mode={endDateMode}
                    is24Hour={false}
                    display="default"
                    onChange={onChangeEndDate}
                  />
                )}
              </View>
            )
          )}

          <TouchableOpacity style={currentStyles.finishButton} onPress={handleSubmit}>
            <Text style={currentStyles.finishButtonText}>FINISH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RouteForm;