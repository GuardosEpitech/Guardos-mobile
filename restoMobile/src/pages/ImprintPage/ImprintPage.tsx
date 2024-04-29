import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
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
    <View style={[styles.impressumContainer, darkMode && styles.impressumContainerDarkTheme]}>
      <Text style={[styles.headline, darkMode && styles.headlineDarkTheme]}>{t('pages.Imprint.title')}</Text>
      <Text>{"\n"}</Text>
      <View style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.intro')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.us')}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.address1')}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.address2')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.telephone')}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.email')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.register')}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.registerNr')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.ust')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[styles.impressumInfo, darkMode && styles.impressumInfoDarkTheme]}>{t('pages.Imprint.manager')}</Text>
      </View>
      <View style={styles.impressumLegal}>
        <Text style={[[styles.headline, darkMode && styles.headlineDarkTheme], [styles.legalTitle, darkMode && styles.legalTitleDarkTheme]]}>{t('pages.Imprint.legal')}</Text>
        <Text>{"\n"}</Text>
        <Text style = {[styles.impressumLegal, darkMode && styles.impressumLegalDarkTheme]} >{t('pages.Imprint.introLegal')}</Text>
        <Text>{"\n"}</Text>
        <Text style={[[styles.headline, darkMode && styles.headlineDarkTheme], [styles.legalTitle, darkMode && styles.legalTitleDarkTheme]]}>{t('pages.Imprint.txtlegal1')}</Text>
        <Text>{"\n"}</Text>
        <Text style = {[styles.impressumLegal, darkMode && styles.impressumLegalDarkTheme]}>
          {t('pages.Imprint.txtlegal2')}{' '}
          <Text style={styles.link}>
            http://ec.europa.eu/consumers/odr
          </Text>{' '}
          {t('pages.Imprint.txtlegal3')}
        </Text>
      </View>
    </View>
  );
};

export default ImprintPage;
