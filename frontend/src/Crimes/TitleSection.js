import React from 'react';
import { Text } from 'react-native';

const TitleSection = () => (
  <Text style={styles.titulo}>Información Sobre Crímenes en México</Text>
);

const styles = {
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#343a40',
    marginTop: 10,
  }
};

export default TitleSection;