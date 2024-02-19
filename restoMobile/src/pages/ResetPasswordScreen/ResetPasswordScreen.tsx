import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styles from './ResetPasswordScreen.styles';
import { checkIfRestoUserExist } from '../../services/userCalls';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';

type ResetPasswordProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ResetPassword: React.FC<ResetPasswordProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (isValidEmail(email)) {
        setStep(2);
        setError('');
      }
    } else if (step === 2) {
      if (username.trim() !== '') {
        try {
            const response = await checkIfRestoUserExist({ email, username });
            if (response) {
                navigation.navigate('Login');
            } else {
              setError(`That username and email (${email}) don't match. Please check its spelling or try another username.`);
            }
        } catch (error) {
          console.error('Error checking user:', error);
          setError('Error checking user. Please try again.');
        }
      }
    }
  };

  const handleGoBack = () => {
    setStep(1);
    setEmail('');
    setUsername('');
    setError('');
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGoBack();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.heading}>Getting back into your Guardos account</Text>
      <Text style={styles.description}>
        {step === 1 ? 'Tell us some information about your account' : 
        'Next, give us the Guardos username you\'re having trouble with'}
      </Text>
      {step === 1 ? (
        <>
          <Text style={styles.label}>Enter your email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <View style={styles.emailSection}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.emailDisplay}>
              <Text style={styles.emailText}>{email}</Text>
              <TouchableOpacity onPress={handleGoBack}>
                <FontAwesomeIcon style={styles.pencilIcon} icon={faPen} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>Enter your username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            style={styles.input}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}
      <Button
        title={step === 1 ? 'Continue' : 'Send My Password Reset Link'}
        onPress={handleContinue}
        disabled={step === 1 ? !isValidEmail(email) : username.trim() === ''}
        color={step === 1 ? 'blue' : 'red'}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPassword;