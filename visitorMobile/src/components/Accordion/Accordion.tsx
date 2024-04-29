import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Accordion.styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Accordion = ({ title, children }) => {
  const [ expanded, setExpanded ] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
 useEffect(() => {
    fetchDarkMode()
  });

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
  function toggleItem() {
    setExpanded(!expanded);
  }
  const body = <View>{ children }</View>;

  return (
    <>
      {React.Children.count(children) > 0 && (
        <View style={[styles.accordion, darkMode && styles.accordionDarkTheme]}>
          <TouchableOpacity onPress={toggleItem} style={styles.container}>
            <View style={[styles.titleContainer, darkMode && styles.titleContainerDarkTheme]}>
              <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{title}</Text>
              <Icon
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#bbb"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          {expanded && body}
        </View>
      )}
    </>
  );
};

export default Accordion;
