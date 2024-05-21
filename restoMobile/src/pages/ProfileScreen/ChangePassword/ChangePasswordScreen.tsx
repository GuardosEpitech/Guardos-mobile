import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    TouchableWithoutFeedback, 
    Keyboard 
} from 'react-native';
import styles from './ChangePasswordScreen.styles';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {changePassword} from "../../../services/profileCalls";
import {useTranslation} from "react-i18next";

type ChangePasswordScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = 
({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState(false);
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
    setErrorNewPassword(false);
    setErrorPassword(false);
    setErrorSamePassword(false);
    if (!isValidPassword(newPassword)) {
      setErrorNewPassword(true);
      return;
    }
    if (oldPassword === newPassword) {
      setErrorSamePassword(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorPassword(true);
      return;
    }
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken === null) {
      return;
    }
    const res = await changePassword(userToken, oldPassword, newPassword);
    if (res) {
      await AsyncStorage.setItem('user', res);
      navigation.navigate('Profile', { passwordChanged: true });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.heading}>{t('pages.Profile.change-pw')}</Text>
      
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
      {errorNewPassword && (
          <Text style={styles.errorText}>
            {t('pages.Profile.wrong-pw-format')}
          </Text>
        )}
      {errorSamePassword && (
          <Text style={styles.errorText}>
            {t('pages.Profile.same-pw')}
          </Text>
        )}
      <Text style={styles.label}>{t('pages.Profile.confirm-pw')}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errorPassword && (
          <Text style={styles.errorText}>
            {t('pages.Profile.no-match')}
          </Text>
        )}
      <Button title={t('common.save')} onPress={handleSave} />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangePasswordScreen;
