import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from './Login.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loginUser} from "../../../services/userCalls";
import {Ionicons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";
import {getProfileDetails} from "../../../services/profileCalls";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const {t, i18n} = useTranslation();

  const handleSubmit = async () => {
    try {
      const dataStorage = JSON.stringify({
        username: username,
        password: password
      });

      const response = await loginUser(dataStorage);

      if (response === 'Invalid Access') {
        setErrorForm(true);
        AsyncStorage.removeItem('userToken');
      } else {
        setErrorForm(false);
        getProfileDetails(response)
          .then((res) => {
            if (res.preferredLanguage) {
              i18n.changeLanguage(res.preferredLanguage);
            }
          });
        AsyncStorage.setItem('userToken', response);
        setLoggedInStatus(true);
        navigation.navigate('Scanning');
      }
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
      >
        <Ionicons name="language" size={24} color="black" />
      </TouchableOpacity>
      {showLanguageDropdown && (
        <View style={styles.languageDropdown}>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('en');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>{t('common.english')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('de');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>{t('common.german')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              i18n.changeLanguage('fr');
              setShowLanguageDropdown(false);
            }}
          >
            <Text>{t('common.french')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('pages.Profile.username-or-email') as string}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder={t('pages.Profile.password') as string}
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
        {errorForm && <Text style={styles.errorText}>{t('pages.Profile.invalid-login')}</Text>}
        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
          <Text style={styles.loginText}>{t('pages.Profile.login')}</Text>
        </TouchableOpacity>
        <Text style={styles.registerInfo}>
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Account Recovery')}>
            {t('pages.Profile.trouble-logging-in')}
          </Text>
        </Text>
        <Text style={styles.registerInfo}>
          {t('pages.Profile.register-prompt')}
          <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
            {t('pages.Profile.register-here')}
          </Text>
          .
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
