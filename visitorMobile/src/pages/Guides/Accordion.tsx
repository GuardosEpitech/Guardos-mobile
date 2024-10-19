import React, { useState, useCallback } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useFocusEffect(
    useCallback(() => {
      fetchDarkMode();
      return () => {};
    }, [])
  );

  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };

  return (
    <View style={[styles.accordion, darkMode && styles.accordionDarkMode]}>
      <TouchableOpacity style={[styles.header, darkMode && styles.headerDarkMode]} onPress={toggleAccordion}>
        <Text style={[styles.title, darkMode && styles.titleDarkMode]}>{title}</Text>
        <AntDesign name={isOpen ? 'up' : 'down'} size={20} />
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.content, darkMode && styles.contentDarkMode]}>
          <Text style={[styles.text , darkMode && styles.textDarkMode]}>{children}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordion: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    backgroundColor: '#fafafa',
  },
  text: {
    color: 'black'
  },
  accordionDarkMode: {
    marginBottom: 10,
    backgroundColor: "#1B1D1E",
    color: 'white',
  },
  headerDarkMode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#1B1D1E',
    color: 'white',
    borderRadius: 5,
  },
  titleDarkMode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  contentDarkMode: {
    padding: 10,
    backgroundColor: '#1B1D1E',
    color: 'white',
  },
  textDarkMode: {
    color: 'white'
  },
});

export default Accordion;
