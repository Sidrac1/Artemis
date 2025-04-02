import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    borderWidth: 2,
    borderColor: "black",
    width: width * 0.45 * 0.6, // Más angosto
  },
  card: {
    width: '100%',
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 15,
    
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 35,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 12,
    backgroundColor: "#f9f9f9",
  },
  sectorsContainer: {
    alignItems: "center",
    marginBottom: 15,
    position: "relative",
  },
  houseImage: {
    width: width * 0.70 * 0.4 * 0.6 * 0.6, // Ajusta proporcionalmente
    height: width * 0.70 * 0.4 * 0.6 * 0.6, // Ajusta proporcionalmente
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 3,
    marginRight: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: "#e6ddcc", // Color de fondo claro al marcar
  },
  checkboxNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  topLeft: {
    top: "10%",
    left: "10%",
  },
  topRight: {
    top: "10%",
    right: "10%",
  },
  bottomLeft: {
    bottom: "10%",
    left: "10%",
  },
  bottomRight: {
    bottom: "10%",
    right: "10%",
  },
  sectorName: {
    fontSize: 12,
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 35,
    width: "100%",
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateTimeWrapper: {
    flex: 1,
  },
  dateTimeText: {
    fontSize: 12,
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerButton: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  datePickerText: {
    fontSize: 10,
  },
  timePickerButton: {
    backgroundColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  timePickerText: {
    fontSize: 10,
  },
  dateContainerWeb: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateTimeWrapperWeb: {
    flex: 1,
    marginRight: 5,
  },
  dateTimeTextWeb: {
    fontSize: 12,
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#333',
  },
  finishButton: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 1,
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});

export const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === 'ios' ? 60 : 30, // Ajuste para la barra de estado
    width: '100%', // Ocupar todo el ancho
  },
  outerContainer: {
    backgroundColor: "#e6ddcc",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    width: '90%', // Ocupar un 90% del ancho
    maxWidth: 400, // Limitar el ancho máximo en tablets
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    height: 45,
    borderColor: "#bbb",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#f2f2f2",
  },
  sectorsContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    width: '100%', // Asegurar que el contenedor ocupe todo el ancho
    aspectRatio: 1, // Mantener una proporción de 1:1 para la imagen
  },
  houseImage: {
    width: '80%', // La imagen ocupa el 80% del contenedor
    height: '80%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: "#e6ddcc",
  },
  checkboxNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  topLeft: {
    top: '15%',
    left: '15%',
  },
  topRight: {
    top: '15%',
    right: '15%',
  },
  bottomLeft: {
    bottom: '15%',
    left: '15%',
  },
  bottomRight: {
    bottom: '15%',
    right: '15%',
  },
  sectorName: {
    fontSize: 14,
  },
  pickerContainer: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
  },
  picker: {
    height: 45,
    width: "100%",
    fontSize: 14,
  },
  dateContainer: {
    flexDirection: "column",
    marginBottom: 20,
    width: '100%',
  },
  dateTimeWrapper: {
    marginBottom: 10,
  },
  dateTimeText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#555',
  },
  datePickerButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  datePickerText: {
    fontSize: 14,
  },
  timePickerButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  timePickerText: {
    fontSize: 14,
  },
  finishButton: {
    backgroundColor: "#e6ddcc",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 25,
    borderColor: "black",
    borderWidth: 1,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});