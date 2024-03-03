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
        setErrorMessage('Password must be at least 7 characters long and contain uppercase, lowercase, and numeric characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirmed password do not match.');
        return;
      }

      const userToken = await AsyncStorage.getItem('user');
      if (userToken === null) {
        setErrorMessage('User token not found. Please log in again.');
        return;
      }

      const res = await changeVisitorPassword(userToken, oldPassword, newPassword);
      if (res) {
        await AsyncStorage.setItem('user', res);
        setSuccessMessage('Password changed successfully.');
        navigation.navigate('Profile');
      } else {
        setErrorMessage('Failed to change password. Please check your old password.');
      }
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.heading}>Change Password</Text>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

          <Text style={styles.label}>Enter old password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <Text style={styles.label}>Enter new password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button title="Save" onPress={handleSave} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

export default ChangePasswordScreen;
