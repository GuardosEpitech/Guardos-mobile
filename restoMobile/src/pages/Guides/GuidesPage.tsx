import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import Accordion from './Accordion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Tip {
  title: string;
  content: string;
}

const GuidesPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const tips = t('pages.GuidePage.tips', { returnObjects: true }) as Tip[];
  const prevention = t('pages.GuidePage.prevention', { returnObjects: true }) as Tip[];
  const faq = t('pages.GuidePage.faq', { returnObjects: true }) as Tip[];

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
    <PaperProvider>
      <ScrollView style={[styles.container, darkMode && styles.containerDarkMode]}>
        <View style={[styles.header, darkMode && styles.headerDarkMode]}>
          <Text style={[styles.title, darkMode && styles.titleDarkMode]}>
            {t('pages.GuidePage.title')}
          </Text>
          <Text style={[styles.description, darkMode && styles.descriptionDarkMode]}>
            {t('pages.GuidePage.description')}
          </Text>
        </View>

        {/* Allergen Tips Section */}
        <View style={[styles.section, darkMode && styles.sectionDarkMode]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDarkMode]}>
            {t('pages.GuidePage.tipsTitle')}
          </Text>
          {tips.map((tip, index) => (
            <Accordion key={index} title={tip.title}>
              <Text>{tip.content}</Text>
            </Accordion>
          ))}
        </View>

        {/* Allergen Prevention and Alternatives Section */}
        <View style={[styles.section, darkMode && styles.sectionDarkMode]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDarkMode]}>
            {t('pages.GuidePage.preventionTitle')}
          </Text>
          <Text style = {[styles.smallDescription, darkMode && styles.smallDescriptionDarkMode]}>
            {t('pages.GuidePage.preventionDescription')}
          </Text>
          {prevention.map((item, index) => (
            <Accordion key={index} title={item.title}>
              <Text>{item.content}</Text>
            </Accordion>
          ))}
          <Button
            mode="outlined"
            onPress={() => Linking.openURL('https://inspection.canada.ca/en/preventive-controls/food-allergens-gluten-and-added-sulphites')}
          >
            {t('pages.GuidePage.learnMore')}
          </Button>
        </View>

        {/* FAQ Section */}
        <View style={[styles.section, darkMode && styles.sectionDarkMode]}>
          <Text style={[styles.sectionTitle, darkMode && styles.sectionTitleDarkMode]}>
            {t('pages.GuidePage.faqTitle')}
          </Text>
          {faq.map((item, index) => (
            <Accordion key={index} title={item.title}>
              <Text>{item.content}</Text>
            </Accordion>
          ))}
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fafafa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: '#6d071a',
  },
  description: {
    fontSize: 20,
    color: '#555',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    marginBottom: 20,
  },
  smallDescription: {
    fontSize: 15
  },

  containerDarkMode: {
    padding: 20,
    backgroundColor: '#1B1D1E',
  },
  headerDarkMode: {
    marginBottom: 40,
    color: '#white',
  },
  titleDarkMode: {
    fontSize: 32,
    color: '#white',
  },
  descriptionDarkMode: {
    fontSize: 20,
    color: '#FFF',
  },
  sectionDarkMode: {
    marginBottom: 40,
    backgroundColor: '#1B1D1E',
  },
  sectionTitleDarkMode: {
    fontSize: 28,
    marginBottom: 20,
    backgroundColor: '#1B1D1E',
    color: '#FFF',
  },
  smallDescriptionDarkMode: {
    fontSize: 15,
    color : '#FFF'
  },
});

export default GuidesPage;
