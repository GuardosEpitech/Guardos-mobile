import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './PrivacyPage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyPage = () => {
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
    <ScrollView>
      <View style={[styles.container, darkMode && styles.containerDarkTheme]}>
        <View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.title')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.intro')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.controller')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.controllertxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.types')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.typestxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.type1')}</Text> 
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.type1txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.type2')}</Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.type2txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.type3')}</Text> 
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.type3txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.type4')}</Text> 
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.type4txt')} </Text>
                </Text>
              </View>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.legal')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.legaltxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.legal1')}</Text>
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.legal1txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.legal2')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.legal2txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.legal3')}</Text>
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.legal3txt')} </Text>
                </Text>
              </View>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.data')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]}/>
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.datatxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.sharing')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.sharingtxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.rights')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.rightstxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right1')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.right1txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right2')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.right2txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right3')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.right3txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right4')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.right4txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right5')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.right5txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right6')}</Text>
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.right6txt')} </Text>
                </Text>
                <Text>
                  <Text style={[styles.bold, darkMode && styles.boldDarkTheme]}>{t('pages.Privacy.right7')}</Text> 
                  <Text style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.Privacy.right7txt')}</Text>
                </Text>
              </View>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.rightend')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.Privacy.contact')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.contacttxt')}</Text>
              <Text />
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.address')}</Text>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.email')}</Text>
              <Text />
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.Privacy.end')}</Text>
              <Text />
            </View>
          </View>
          <View style={styles.emptySpace} />
        </View>
      </View>
    </ScrollView>
  );
};

export default PrivacyPage;
