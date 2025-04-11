import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const GlosarioTerminos = ({ datosDelitos }) => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('bien_juridico');
  const [terminoExpandido, setTerminoExpandido] = useState(null);

  // Extraer términos únicos para cada categoría
  const bienesJuridicos = [...new Set(datosDelitos.map(item => item["Bien jurídico afectado"]))];
  const tiposDelito = [...new Set(datosDelitos.map(item => item["Tipo de delito"]))];
  const modalidades = [...new Set(datosDelitos.map(item => item.Modalidad))];

  // Obtener los términos según la categoría seleccionada
  const obtenerTerminos = () => {
    switch(categoriaSeleccionada) {
      case 'bien_juridico': 
        return bienesJuridicos;
      case 'tipo_delito': 
        return tiposDelito;
      case 'modalidad': 
        return modalidades;
      default: 
        return [];
    }
  };

  // Definiciones de ejemplo (deberías completar con las definiciones reales)
  const definiciones = {
    // Bienes jurídicos
    "La vida y la Integridad corporal": "Protege el derecho fundamental a la vida y a la integridad física de las personas.",
    "La libertad personal": "Garantiza la libertad de movimiento y acción de los individuos.",
    
    // Tipos de delito
    "Homicidio": "Privación ilegítima de la vida de una persona.",
    "Robo": "Apoderamiento ilegítimo de bienes ajenos.",
    
    // Modalidades
    "Con arma de fuego": "Delito cometido utilizando un arma de fuego.",
    "Con arma blanca": "Delito cometido utilizando un objeto cortante o punzante."
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Glosario de Términos Jurídicos</Text>
      
      <View style={styles.selectorContainer}>
        <Picker
          selectedValue={categoriaSeleccionada}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setCategoriaSeleccionada(itemValue);
            setTerminoExpandido(null);
          }}
        >
          <Picker.Item label="Bien Jurídico" value="bien_juridico" />
          <Picker.Item label="Tipo de Delito" value="tipo_delito" />
          <Picker.Item label="Modalidad" value="modalidad" />
        </Picker>
      </View>

      <ScrollView style={styles.listaTerminos}>
        {obtenerTerminos().map((termino, index) => (
          <ScrollView key={index} style={styles.terminoContainer}>
            <TouchableOpacity 
              onPress={() => setTerminoExpandido(terminoExpandido === termino ? null : termino)}
              style={styles.terminoBtn}
            >
              <Text style={styles.terminoTitulo}>{termino}</Text>
            </TouchableOpacity>
            
            {terminoExpandido === termino && (
              <ScrollView style={styles.definicionContainer}>
                <Text style={styles.definicionText}>
                  {definiciones[termino] || "Definición no disponible."}
                </Text>
                <Text style={styles.ejemploText}>
                  Ejemplo: {datosDelitos.find(d => 
                    categoriaSeleccionada === 'bien_juridico' ? d["Bien jurídico afectado"] === termino :
                    categoriaSeleccionada === 'tipo_delito' ? d["Tipo de delito"] === termino :
                    d.Modalidad === termino
                  )?.Subtipo || "No hay ejemplo disponible"}
                </Text>
              </ScrollView>
            )}
          </ScrollView>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    height: "20%",
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  selectorContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  listaTerminos: {
    flex: 1,
    height: '20%',
  },
  terminoContainer: {
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  terminoBtn: {
    padding: 16,
  },
  terminoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  definicionContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  definicionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  ejemploText: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
});

export default GlosarioTerminos;