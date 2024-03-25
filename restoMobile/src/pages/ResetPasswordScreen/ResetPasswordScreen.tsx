import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import styles from './ResetPasswordScreen.styles';
import { checkIfRestoUserExist, sendRecoveryLinkForRestoUser } from '../../services/userCalls';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ResetPasswordProps = {
    navigation: NavigationProp<ParamListBase>;
  };

const ResetPassword: React.FC<ResetPasswordProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [open, setOpen] = useState(true);
  const [openFailed, setOpenFailed] = useState(true);

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
                setDisableButton(true);
                const emailWasSend = await sendRecoveryLinkForRestoUser({ email, username });
                
                if (emailWasSend) {
                  setStep(3);
                  setDisableButton(true);
                } else {
                  setStep(4);
                }
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

  const handleGoBackToLogin = () => {
    setOpen(false);
    navigation.navigate('Login');
  };

  const handleGoBackToSite = () => {
    setOpenFailed(false);
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
              <Ionicons name={'create'} size={25} color={'gray'}/>
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
      <Modal visible={step === 3} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>E-Mail was sent!</Text>
            <Text>Please check your inbox for an email regarding password recovery, and also review your spam folder. The email contains a link that will remain valid for 15 minutes.</Text>
            <Button title="Go back to login" onPress={handleGoBackToLogin} />
          </View>
        </View>
      </Modal>
      <Modal visible={step === 4} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>There was an Error.</Text>
            <Text>Please try again to get a recovery link. If the Error appears one more time, please contact us.</Text>
            <Button title="Go back to login" onPress={handleGoBackToLogin} />
          </View>
        </View>
      </Modal>
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