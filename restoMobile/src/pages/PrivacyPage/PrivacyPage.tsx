import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './PrivacyPage.styles';

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('pages.Privacy.title')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.intro')}</Text>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.controller')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.controllertxt')}</Text>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.types')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.typestxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.type1')}</Text> {t('pages.Privacy.type1txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.type2')}</Text> {t('pages.Privacy.type2txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.type3')}</Text> {t('pages.Privacy.type3txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.type4')}</Text> {t('pages.Privacy.type4txt')}
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.legal')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.legaltxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.legal1')}</Text> {t('pages.Privacy.legal1txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.legal2')}</Text> {t('pages.Privacy.legal2txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.legal3')}</Text> {t('pages.Privacy.legal3txt')}
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.data')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.datatxt')}</Text>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.sharing')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.sharingtxt')}</Text>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.rights')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.rightstxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right1')}</Text> {t('pages.Privacy.right1txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right2')}</Text> {t('pages.Privacy.right2txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right3')}</Text> {t('pages.Privacy.right3txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right4')}</Text> {t('pages.Privacy.right4txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right5')}</Text> {t('pages.Privacy.right5txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right6')}</Text> {t('pages.Privacy.right6txt')}
                </Text>
                <Text>
                  <Text style={styles.bold}>{t('pages.Privacy.right7')}</Text> {t('pages.Privacy.right7txt')}
                </Text>
              </View>
              <Text>{t('pages.Privacy.rightend')}</Text>
            </View>
            <Text style={styles.title}>{t('pages.Privacy.contact')}</Text>
            <View style={styles.line} />
            <View style={styles.text}>
              <Text>{t('pages.Privacy.contacttxt')}</Text>
              <Text />
              <Text>{t('pages.Privacy.address')}</Text>
              <Text>{t('pages.Privacy.email')}</Text>
              <Text>{t('pages.Privacy.phone')}</Text>
              <Text />
              <Text>{t('pages.Privacy.end')}</Text>
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
