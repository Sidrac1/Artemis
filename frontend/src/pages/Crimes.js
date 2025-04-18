import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import misDatos from '../components/delitos';

import FiltersSection from "../Crimes/FilersSection";
import ResultsSection from "../Crimes/ResultsSection";
import HighestCrimesSection from "../Crimes/HighestCrimesSection";
import LowestCrimesSection from "../Crimes/LowestCrimesSection";
import EstadoModal from "../components/EstadoModal";
import TitleSection from "../Crimes/TitleSection";
import { calculateCrimeStatistics } from "../Crimes/util";
import GlosarioTerminos from "../Crimes/Glosario";
import CompararEstados from '../components/Comparar';
import jsonData from '../data/delitos.json';

const { height: screenHeight } = Dimensions.get('window');

const Crimes = () => {
  // Estados para control de UI
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(null);

  // Estados para filtros
  const [selectedJuridical, setSelectedJuridical] = useState("");
  const [selectedCrimeType, setSelectedCrimeType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedModality, setSelectedModality] = useState("");

  // Estados para opciones de filtros
  const [uniqueJuridicalGoods, setUniqueJuridicalGoods] = useState([]);
  const [uniqueCrimeTypes, setUniqueCrimeTypes] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [highestCrimes, setHighestCrimes] = useState({});
  const [uniqueModalities, setUniqueModalities] = useState([]);

  // Estados para datos
  const [totalRecords, setTotalRecords] = useState(0);
  const [displayData, setDisplayData] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [crimeDataByState, setCrimeDataByState] = useState({});

  useEffect(() => {
    const juridicalGoods = [...new Set(misDatos.map(item => item["Bien jurídico afectado"]))];
    const crimeTypes = [...new Set(misDatos.map(item => item["Tipo de delito"]))];
    const states = [...new Set(misDatos.map(item => item["Entidad"]))];
    const modalities = [...new Set(misDatos.map(item=>item["Modalidad"]))]

    setUniqueJuridicalGoods(juridicalGoods);
    setUniqueCrimeTypes(crimeTypes);
    setUniqueStates(states);
    setUniqueModalities(modalities);

    const { crimesByState, highestCrimesData } = calculateCrimeStatistics(misDatos);
    setCrimeDataByState(crimesByState);
    setHighestCrimes(highestCrimesData);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { filteredData } = applyFilters();
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setDisplayData(paginatedData);
      setTotalRecords(filteredData.length);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  }, [page, pageSize, selectedJuridical, selectedCrimeType, selectedState, selectedPeriod,selectedModality, isFilterApplied]);

  const applyFilters = useCallback(() => {
    let filteredData = [...misDatos];

    if (selectedJuridical) filteredData = filteredData.filter(item => item["Bien jurídico afectado"] === selectedJuridical);
    if (selectedCrimeType) filteredData = filteredData.filter(item => item["Tipo de delito"] === selectedCrimeType);
    if (selectedState) filteredData = filteredData.filter(item => item["Entidad"] === selectedState);
    if (selectedPeriod !== "all") filteredData = filteredData.filter(item => parseInt(item[selectedPeriod] || "0") > 0);
    if (selectedModality) filteredData = filteredData.filter(item=>item["Modalidad"] === selectedModality);

    return { filteredData };
  }, [selectedJuridical, selectedCrimeType, selectedState, selectedPeriod, selectedModality]);

  useEffect(() => {
    loadData();
  }, [loadData, page]);

  const aplicarFiltros = useCallback(() => {
    setPage(0);
    setIsFilterApplied(!isFilterApplied);
  }, [isFilterApplied]);

  const irPaginaSiguiente = () => setPage(prev => prev + 1);
  const irPaginaAnterior = () => setPage(prev => Math.max(0, prev - 1));

  const handlePressEstado = (estado) => {
    setSelectedEstado(estado);
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <TitleSection />

        <FiltersSection
          selectedJuridical={selectedJuridical}
          setSelectedJuridical={setSelectedJuridical}
          selectedCrimeType={selectedCrimeType}
          setSelectedCrimeType={setSelectedCrimeType}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          uniqueJuridicalGoods={uniqueJuridicalGoods}
          uniqueCrimeTypes={uniqueCrimeTypes}
          uniqueStates={uniqueStates}
          selectedModality={selectedModality}
          setSelectedModality={setSelectedModality}
          uniqueModalities={uniqueModalities}
          aplicarFiltros={aplicarFiltros}
        />

        <ResultsSection
          loading={loading}
          displayData={displayData}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          irPaginaAnterior={irPaginaAnterior}
          irPaginaSiguiente={irPaginaSiguiente}
        />

        <View style={styles.statsContainer}>
          <HighestCrimesSection
            highestCrimes={highestCrimes}
            handlePressEstado={handlePressEstado}
          />

          <LowestCrimesSection
            crimeDataByState={crimeDataByState}
            handlePressEstado={handlePressEstado}
          />

          <CompararEstados data={jsonData} />

        </View>

        <EstadoModal
          visible={modalVisible}
          estado={selectedEstado}
          onClose={() => setModalVisible(false)}
          highestCrimes={highestCrimes}
          crimeDataByState={crimeDataByState}
          crimeData={misDatos}
        />
        <GlosarioTerminos datosDelitos={misDatos} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: screenHeight, // Intenta establecer la altura mínima de la pantalla
  },
  container: {
    padding: 16,
    paddingBottom: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  }
});

export default Crimes;