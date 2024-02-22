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


type ChangePasswordScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = 
({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    const userToken = await AsyncStorage.getItem('user');
    if (userToken === null) {
      return;
    }
    const res = await changePassword(userToken, oldPassword, newPassword);
    if (res) {
      await AsyncStorage.setItem('user', res);
      navigation.navigate('Profile');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      
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
