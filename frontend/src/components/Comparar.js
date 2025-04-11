import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CompararEstados = ({ data }) => {
  const [estado1, setEstado1] = useState("");
  const [estado2, setEstado2] = useState("");
  const [comparacion, setComparacion] = useState([]);

  useEffect(() => {
    if (estado1 && estado2) {
      const filtrarYSumar = (estado) => {
        const delitosPorTipo = {};
        data["2025"].forEach((item) => {
          if (item.Entidad === estado) {
            const tipo = item["Tipo de delito"];
            const total = Object.keys(item)
              .filter((key) => ["Enero", "Febrero"].includes(key))
              .reduce((sum, mes) => sum + parseInt(item[mes] || 0, 10), 0);
            
            delitosPorTipo[tipo] = (delitosPorTipo[tipo] || 0) + total;
          }
        });
        return delitosPorTipo;
      };

      const datosEstado1 = filtrarYSumar(estado1);
      const datosEstado2 = filtrarYSumar(estado2);

      const tiposDelitos = new Set([...Object.keys(datosEstado1), ...Object.keys(datosEstado2)]);
      const nuevaComparacion = Array.from(tiposDelitos).map((tipo) => ({
        delito: tipo,
        [estado1]: datosEstado1[tipo] || 0,
        [estado2]: datosEstado2[tipo] || 0,
      }));

      setComparacion(nuevaComparacion);
    }
  }, [estado1, estado2, data]);

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Comparación de Estados</h2>

      <label style={{marginTop:10, marginBottom:10, fontSize: 15, fontWeight:'bold'}}>Estado 1:</label>
      <select onChange={(e) => setEstado1(e.target.value)}>
        <option value="">Selecciona un estado</option>
        {[...new Set(data["2025"].map((item) => item.Entidad))].map((entidad) => (
          <option key={entidad} value={entidad}>{entidad}</option> //set data sirve para que se iteren todos los estados pero solo una vez
        ))}
      </select>

      <label style={{marginTop:10, marginBottom:10, fontSize: 15, fontWeight:'bold'}}>Estado 2:</label>
      <select onChange={(e) => setEstado2(e.target.value)}>
        <option value="">Selecciona un estado</option>
        {[...new Set(data["2025"].map((item) => item.Entidad))].map((entidad) => (
          <option key={entidad} value={entidad}>{entidad}</option>
        ))}
      </select>

      {comparacion.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparacion}>
            <XAxis dataKey="delito" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={estado1} fill="#8884d8" />
            <Bar dataKey={estado2} fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'column',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    fontSize: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
    display: 'flex',
    flex: 1,
    justifyContent:'center',
  }
});

export default CompararEstados;
