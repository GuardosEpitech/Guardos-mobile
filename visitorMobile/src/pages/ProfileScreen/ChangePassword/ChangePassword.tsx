import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import styles from './ChangePassword.styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {changeVisitorPassword} from "../../../services/profileCalls";
import {useTranslation} from "react-i18next";


type ChangePasswordScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> =
  ({navigation}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {t} = useTranslation();

    function isValidPassword(password: string): boolean {
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /[0-9]/;

      return (
        password.length >= 7 &&
        uppercaseRegex.test(password) &&
        lowercaseRegex.test(password) &&
        numberRegex.test(password)
      );
    }

    const handleSave = async () => {
      if (!isValidPassword(newPassword)) {
        setErrorMessage( t('pages.Profile.wrong-pw-format') as string);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage(t('pages.Profile.no-match') as string);
        return;
      }

      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        setErrorMessage(t('pages.Profile.no-token-error') as string);
        return;
      }

      const res = await changeVisitorPassword(userToken, oldPassword, newPassword);
      if (res) {
        await AsyncStorage.setItem('userToken', res);
        setSuccessMessage(t('pages.Profile.pw-changed') as string);
        navigation.navigate('Profile');
      } else {
        setErrorMessage(t('pages.Profile.pw-changed-failure') as string);
      }
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.heading}>{t('pages.Profile.change-pw')}</Text>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

          <Text style={styles.label}>{t('pages.Profile.old-pw')}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <Text style={styles.label}>{t('pages.Profile.new-pw')}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>{t('pages.Profile.confirm-pw')}</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button title={t('common.save') as string} onPress={handleSave} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

export default ChangePasswordScreen;
