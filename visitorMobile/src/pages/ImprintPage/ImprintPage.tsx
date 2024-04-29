import React, {useEffect, useState} from 'react';
import {
  View, 
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './ImprintPage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImprintPage: React.FC = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    fetchDarkMode();  
  })

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView style={{flexGrow: 1, backgroundColor: darkMode ? '#181A1B' : 'white'}}>
    <View style={[styles.impressumContainer, darkMode && styles.impressumContainerDarkTheme]}>
      <Text style={[styles.headline, darkMode && styles.headlineDarkTheme]}>{t('pages.Imprint.title')}</Text>
      <Text>{"\n"}</Text>
      <View style={[styles.impressumInfo]}>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.intro')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.us')}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.address1')}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.address2')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.telephone')}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.email')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.register')}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.registerNr')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.ust')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.manager')}</Text>
      </View>
      <View style={styles.impressumLegal}>
        <Text style={[[styles.headline, darkMode && styles.headlineDarkTheme], [styles.legalTitle, darkMode && styles.legalTitleDarkTheme]]}>{t('pages.Imprint.legal')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>{t('pages.Imprint.introLegal')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[[styles.headline, darkMode && styles.headlineDarkTheme], [styles.legalTitle, darkMode && styles.legalTitleDarkTheme]]}>{t('pages.Imprint.txtlegal1')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumText, darkMode && styles.impressumTextDarkTheme]}>
          {t('pages.Imprint.txtlegal2')}{' '}
          <Text style={styles.link}>
            http://ec.europa.eu/consumers/odr
          </Text>{' '}
          {t('pages.Imprint.txtlegal3')}
        </Text>
      </View>
    </View>
    </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ImprintPage;
