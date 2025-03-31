import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, CheckBox } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Estilos por defecto de la librería
import { useNavigation } from "@react-navigation/native";
import { createRonda } from "../api/Ronda"; // API para insertar en "ronda"
import { createRondaGuardia } from "../api/RondaGuardia"; // API para insertar en "ronda_guardia"

const { width, height } = Dimensions.get("window");

const RouteForm = ({ selectedGuard }) => {
  const navigation = useNavigation();
  const [routeName, setRouteName] = useState("");
  const [frequency, setFrequency] = useState("15 Minutes");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedSectors, setSelectedSectors] = useState({});
  const [sectorOrder, setSectorOrder] = useState([]);
  const [sectorInput, setSectorInput] = useState("");

  const toggleSector = (sector) => {
    if (selectedSectors[sector]) {
      setSelectedSectors((prev) => ({ ...prev, [sector]: false }));
      setSectorOrder((prev) => prev.filter((s) => s !== sector));
    } else {
      setSelectedSectors((prev) => ({ ...prev, [sector]: true }));
      setSectorOrder((prev) => [...prev, sector]);
    }
  };

  useEffect(() => {
    setSectorInput(sectorOrder.map((sector) => sector.slice(-1)).join(" -> "));
  }, [sectorOrder]);

  const handleSubmit = async () => {
    try {
      const startDateLocal = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000);
      const endDateLocal = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000);

      // 1. Crear los datos de la ronda
      const rondaData = {
        nombre: routeName,
        hora_inicio: startDate.toISOString(),
        hora_fin: endDate.toISOString(),
        intervalos: frequency,
        secuencia: sectorOrder.map((sector) => sector.slice(-1)).join(" "), // Ejemplo: "B C D A"
      };
  
      // 2. Insertar la ronda y obtener el código
      const createdRonda = await createRonda(rondaData);
      console.log("Ronda creada:", createdRonda);
  
      if (!createdRonda || !createdRonda.codigo) {
        throw new Error("Error al crear la ronda, no se obtuvo el código.");
      }
  
      // 3. Obtener el ID del guardia (usando la propiedad "ID")
      const guardId = selectedGuard.ID;
      if (!guardId) {
        throw new Error("El objeto selectedGuard no contiene el ID del guardia.");
      }
  
      // 4. Crear el objeto para insertar en ronda_guardia
      const rondaGuardiaData = {
        codigo_ronda: createdRonda.codigo, // Código obtenido de la ronda creada
        id_guardia: guardId, // Usamos selectedGuard.ID
      };
      console.log("Datos para ronda_guardia:", rondaGuardiaData);
  
      // 5. Insertar en ronda_guardia
      const createdRondaGuardia = await createRondaGuardia(rondaGuardiaData);
      console.log("Ronda-Guardia creada:", createdRondaGuardia);
  
      alert(`Ronda creada exitosamente con guardia: ${selectedGuard.nombre} ${selectedGuard.apellido_paterno}`);
      navigation.navigate("Patrols");
    } catch (error) {
      console.error("Error al crear la ronda o ronda-guardia:", error);
      alert("Hubo un error al crear la ronda.");
    }
  };
  
  

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
            <TouchableOpacity
              style={[styles.sectorLabel, styles.topLeft]}
              onPress={() => toggleSector("Sector A")}
            >
              <Text style={styles.sectorName}>Sector A</Text>
              <CheckBox value={selectedSectors["Sector A"] || false} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sectorLabel, styles.topRight]}
              onPress={() => toggleSector("Sector B")}
            >
              <Text style={styles.sectorName}>Sector B</Text>
              <CheckBox value={selectedSectors["Sector B"] || false} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sectorLabel, styles.bottomLeft]}
              onPress={() => toggleSector("Sector C")}
            >
              <Text style={styles.sectorName}>Sector C</Text>
              <CheckBox value={selectedSectors["Sector C"] || false} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sectorLabel, styles.bottomRight]}
              onPress={() => toggleSector("Sector D")}
            >
              <Text style={styles.sectorName}>Sector D</Text>
              <CheckBox value={selectedSectors["Sector D"] || false} />
            </TouchableOpacity>
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

          {/* Start Date Picker */}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>Start Date:</Text>
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="yyyy-MM-dd h:mm aa"
              showTimeSelect
            />
          </View>

          {/* End Date Picker */}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>End Date:</Text>
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="yyyy-MM-dd h:mm aa"
              showTimeSelect
            />
          </View>

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
