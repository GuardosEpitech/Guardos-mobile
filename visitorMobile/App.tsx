import 'react-native-gesture-handler'; // Muss als erstes importiert werden
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, NativeModules } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Router from './Router';
import './i18n/i18n';
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Settings, LoginManager } from 'react-native-fbsdk-next';

Settings.setAppID('3681976368725984');
Settings.initializeSDK();


interface ErrorScreenProps {
  errorMessage: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorMessage }) => (
    <View style={styles.container}>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
);

const App: React.FC = () => {
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasInternetConnection(state.isConnected);
    });

    fetchUserLanguage();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchUserLanguage = async () => {
    let deviceLanguage = 'en'; // Standardsprache

    try {
      if (Platform.OS === 'ios') {
        const settings = NativeModules.SettingsManager.settings;
        deviceLanguage = settings.AppleLocale || (settings.AppleLanguages && settings.AppleLanguages[0]) || 'en';
      } else {
        deviceLanguage = NativeModules.I18nManager.localeIdentifier || 'en';
      }
      deviceLanguage = deviceLanguage.split('_')[0];
    } catch (error) {
      console.error('Fehler beim Abrufen der Gerätesprache:', error);
    }

    if (['en', 'de', 'fr'].includes(deviceLanguage)) {
      i18n.changeLanguage(deviceLanguage);
    } else {
      i18n.changeLanguage('en'); // Fallback-Sprache
    }
  };

  const renderContent = () => {
    if (!hasInternetConnection) {
      return <ErrorScreen errorMessage={t('pages.Router.no-internet-error') as string} />;
    }
    return <Router />;
  };

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        {renderContent()}
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default App;
