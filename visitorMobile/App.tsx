import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Platform, NativeModules} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import MyTabs from './Router';
import './i18n/i18n';
import {useTranslation} from "react-i18next";

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
    const deviceLanguage =
      (Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier).split('_')[0];

    if (deviceLanguage == 'en' || deviceLanguage == 'de' || deviceLanguage == 'fr') {
      i18n.changeLanguage(deviceLanguage);
    }
  }

  const renderContent = () => {
    if (!hasInternetConnection) {
      return <ErrorScreen errorMessage={t('pages.Router.no-internet-error') as string} />;
    }
    return (
      <MyTabs />
    );
  };

  return (
    // <ErrorBoundary>
      renderContent()
    // {/* </ErrorBoundary> */}
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
