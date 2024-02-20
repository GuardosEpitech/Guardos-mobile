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


type ChangePasswordScreenProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = 
({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // Handle save logic here
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
    navigation.navigate('Profile');
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