export const calculateCrimeStatistics = (data) => {
    const crimesByState = {};
    const highestCrimesData = {};
    
    data.forEach((delito) => {
      const estado = delito.Entidad;
      const totalDelitos = Object.keys(delito)
        .filter((key) => key.match(/Enero|Febrero/))
        .reduce((sum, mes) => sum + parseInt(delito[mes] || "0", 10), 0);
  
      // Sumar delitos totales por estado
      if (!crimesByState[estado]) crimesByState[estado] = 0;
      crimesByState[estado] += totalDelitos;
  
      // Guardar el delito más frecuente por estado
      if (!highestCrimesData[estado] || highestCrimesData[estado].count < totalDelitos) {
        highestCrimesData[estado] = { crime: delito["Tipo de delito"], count: totalDelitos };
      }
    });
  
    return { crimesByState, highestCrimesData };
  };