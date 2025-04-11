import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import DownloadButton from '../components/DownloadButton';
import CrimeCard from './CrimeCard';

const ResultsSection = ({
  loading,
  displayData,
  totalRecords,
  page,
  pageSize,
  irPaginaAnterior,
  irPaginaSiguiente
}) => (
  <View style={styles.resultsContainer}>
    <Text style={styles.sectionTitle}>
      Resultados (Página {page + 1} de {Math.ceil(totalRecords / pageSize)})
    </Text>
    
    {loading ? (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    ) : (
      <>
        <FlatList
          data={displayData}
          renderItem={({ item }) => <CrimeCard item={item} />}
          keyExtractor={(item, index) => `crime-${index}`}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({ length: 180, offset: 180 * index, index })}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron registros con los filtros seleccionados</Text>
          }
          style={styles.flatList}
          nestedScrollEnabled={true}
        />
        
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.pageButton, page === 0 && styles.disabledButton]} 
            onPress={irPaginaAnterior}
            disabled={page === 0}
          >
            <Text style={styles.pageButtonText}>Anterior</Text>
          </TouchableOpacity>
          
          <View>
            <DownloadButton data={displayData} />
          </View>
          
          <Text style={styles.pageInfo}>
            {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalRecords)} de {totalRecords}
          </Text>
          
          <TouchableOpacity 
            style={[styles.pageButton, (page + 1) * pageSize >= totalRecords && styles.disabledButton]} 
            onPress={irPaginaSiguiente}
            disabled={(page + 1) * pageSize >= totalRecords}
          >
            <Text style={styles.pageButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
);

const styles = {
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#495057',
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6c757d',
    fontSize: 16,
  },
  flatList: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    marginTop: 10,
  },
  pageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.5,
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: '#495057',
  }
};

export default ResultsSection;