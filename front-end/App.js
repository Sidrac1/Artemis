import React, {useState} from 'react';
import {Button} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import styles from './front-end-styles/side-menu-style'
import Icon from "react-native-vector-icons/FontAwesome"; // librería para íconos
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
      <StatusBar style="auto" />
      {sideMenu()}
    </View>
  );
}

const sideMenu = () => { 
  return (
    <View> 
      <Button mode='contained' onPress={conf} style={styles.butonHome}>
        Home
        <Icon name='home' size={20} color='white' style={styles.generalIcons}/>
        </Button>
    </View>
  );
} //funcion sideMenu

const conf = () => {
  return (
    <Text>si funciona</Text>
  );
}

