import React  from 'react';
import { View, Text, ScrollView, Linking, StyleSheet } from 'react-native';
import { Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Accordion from './Accordion';
import { useTranslation } from 'react-i18next';

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     primary: '#6d071a',
//   },
//   roundness: 5,
//   fonts: {
//     button: {
//       fontFamily: 'Calibri',
//       fontSize: 18,
//       textTransform: 'none',
//     },
//   },
// };

interface Tip {
  title: string;
  content: string;
}

const GuidesPage = () => {
  const { t } = useTranslation();

  const tips = t('pages.GuidePage.tips', { returnObjects: true }) as Tip[];
  const prevention = t('pages.GuidePage.prevention', { returnObjects: true }) as Tip[];
  const faq = t('pages.GuidePage.faq', { returnObjects: true }) as Tip[];

  return (
    <PaperProvider /*theme={theme}*/>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('pages.GuidePage.title')}</Text>
          <Text style={styles.description}>{t('pages.GuidePage.description')}</Text>
        </View>

        {/* Allergen Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pages.GuidePage.tipsTitle')}</Text>
          {tips.map((tip, index) => (
            <Accordion key={index} title={tip.title}>
              <Text>{tip.content}</Text>
            </Accordion>
          ))}
        </View>

        {/* Allergen Prevention and Alternatives Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pages.GuidePage.preventionTitle')}</Text>
          <Text>{t('pages.GuidePage.preventionDescription')}</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('pages.GuidePage.faqTitle')}</Text>
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
});

export default GuidesPage;
