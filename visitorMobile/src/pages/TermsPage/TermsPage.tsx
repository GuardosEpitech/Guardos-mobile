import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './TermsPage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TermsPage = () => {
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
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.title')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.intro')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.introTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.definitions')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <View style={styles.indentedList}>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.T&C.service')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.T&C.user')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.profile')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.content')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.premium')} </Text>
                </Text>
              </View>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.responibilities')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.reg')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]}/>
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.regTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.conduct')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.conductTxt')}</Text>
              <View style={styles.indentedList}>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.T&C.conductOpt1')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}> {t('pages.T&C.conductOpt2')} </Text>
                </Text>
                <Text>
                  <Text  style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.conductOpt3')} </Text>
                </Text>
              </View>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.upload')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.uploadTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.payment')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.paymentTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.property')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.ownership')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.ownershipTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.license')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.licenseTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.restriction')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.restrictionTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.privacy')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.privacyTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.diclaimer')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.serviceAvailability')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.availabilityTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.thirdParty')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.thirdPartyTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.warranty')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.warrantyTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.limit')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.limitTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.termination')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.right')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.rightTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.effect')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.effectTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.law')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.jurisdiction')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.jurisdictionTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.dispute')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.disputeTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.contact')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.contactTxt')}</Text>
              <Text />
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.name')}</Text>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.address')}</Text>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.email')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.app')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.purchase')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.purchaseTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.appTerms')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.appTermsTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.device')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.deviceTxt')}</Text>
            </View>
            <Text style={[styles.title, darkMode && styles.titleDarkTheme]}>{t('pages.T&C.update')}</Text>
            <View style={[styles.line, darkMode && styles.lineDarkTheme]} />
            <View style={[styles.text, darkMode && styles.textDarkTheme]}>
              <Text style={[styles.text, darkMode && styles.textDarkTheme]}>{t('pages.T&C.updateTxt')}</Text>
            </View>
          </View>
          <View style={styles.emptySpace} />
        </View>
      </View>
    </ScrollView>
  );
};

export default TermsPage;
