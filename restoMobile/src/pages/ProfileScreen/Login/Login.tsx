import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import styles from './Login.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, verfyTwoFactorAndLogin, resendValidationLink } from "../../../services/userCalls";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { getProfileDetails } from "../../../services/profileCalls";
import VerificationCodeInput from "../../../components/TwoFactorAuth/TwoFactorAuthentification";

type LoginScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const LoginScreen: React.FC<LoginScreenProps & { setLoggedInStatus: (status: boolean) => void }> = ({ navigation, setLoggedInStatus }) => {
  const [username, setUsername] = useState<string>('');  // Typed as string
  const [password, setPassword] = useState<string>('');  // Typed as string
  const [errorForm, setErrorForm] = useState<boolean>(false);  // Explicit boolean
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isUnverified, setIsUnverified] = useState<boolean>(false);

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
      } else if (response === 'Unverified email') {
        setIsUnverified(true);
        AsyncStorage.removeItem('userToken');
      } else {
        setIsUnverified(false);
        if (response.twoFactor) {
          setShowTwoFactor(true);
          setUserId(response.userId);
        } else {
          setErrorForm(false);
          await getProfileDetails(response.token)
              .then((res) => {
                if (res.preferredLanguage) {
                  i18n.changeLanguage(res.preferredLanguage);
                }
              });
          await AsyncStorage.setItem('userToken', response.token);
          setLoggedInStatus(true);
          navigation.navigate('Scanning');
        }
      }
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    try {
      const response = await verfyTwoFactorAndLogin(userId, code, { username, password });
      if (response && response.status === 200) {
        AsyncStorage.setItem('userToken', response.data);
        setErrorForm(false);
        setLoggedInStatus(true);
        navigation.navigate('Scanning');
      } else {
        setVerificationError(t('components.TwoFactor.incorrect-code'));
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setVerificationError(t('components.TwoFactor.code-error'));
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
        {isUnverified && (
          <>
            <Text style={styles.errorText}>{t('pages.Login.unverified')}</Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => username && resendValidationLink(username)}  // Ensure username is provided
            >
              <Text>{t('pages.Login.resend')}</Text>
            </TouchableOpacity>
          </>
        )}
        {!showTwoFactor ? (
          <>
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
          </>
        ) : (
          <VerificationCodeInput
            onSubmit={handleTwoFactorSubmit}
            errorMessage={verificationError}
          />
        )}
      </View>
    </View>
  );
};

export default LoginScreen;
