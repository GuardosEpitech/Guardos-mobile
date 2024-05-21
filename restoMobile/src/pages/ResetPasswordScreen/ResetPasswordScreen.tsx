import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Modal } from 'react-native';
import styles from './ResetPasswordScreen.styles';
import { checkIfRestoUserExist, sendRecoveryLinkForRestoUser } from '../../services/userCalls';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";

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
  const {t} = useTranslation();

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
              setError(t('pages.ResetPasswordScreen.username-email-no-match', {email: email}) as string);
            }
        } catch (error) {
          console.error('Error checking user:', error);
          setError(t('pages.ResetPasswordScreen.user-error') as string);
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
      <Text style={styles.heading}>{t('pages.ResetPasswordScreen.re-enter-account')}</Text>
      <Text style={styles.description}>
        {step === 1 ? t('pages.ResetPasswordScreen.enter-info') :
          t('pages.ResetPasswordScreen.enter-username-prompt')}
      </Text>
      {step === 1 ? (
        <>
          <Text style={styles.label}>{t('pages.ResetPasswordScreen.enter-email')}</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('pages.ResetPasswordScreen.email')}
            keyboardType="email-address"
            style={styles.input}
          />
        </>
      ) : (
        <>
          <View style={styles.emailSection}>
            <Text style={styles.label}>{t('pages.ResetPasswordScreen.email')}</Text>
            <View style={styles.emailDisplay}>
              <Text style={styles.emailText}>{email}</Text>
              <TouchableOpacity onPress={handleGoBack}>
              <Ionicons name={'create'} size={25} color={'gray'}/>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.label}>{t('pages.ResetPasswordScreen.enter-username')}</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder={t('pages.ResetPasswordScreen.username')}
            style={styles.input}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </>
      )}
      <Modal visible={step === 3} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{t('pages.ResetPasswordScreen.email-sent')}</Text>
            <Text>{t('pages.ResetPasswordScreen.check-your-email')}</Text>
            <Button title={t('pages.ResetPasswordScreen.go-back')} onPress={handleGoBackToLogin} />
          </View>
        </View>
      </Modal>
      <Modal visible={step === 4} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{t('pages.ResetPasswordScreen.error')}</Text>
            <Text>{t('pages.ResetPasswordScreen.try-again-msg')}</Text>
            <Button title={t('pages.ResetPasswordScreen.go-back')} onPress={handleGoBackToLogin} />
          </View>
        </View>
      </Modal>
      <Button
        title={step === 1 ?
          t('pages.ResetPasswordScreen.continue') as string :
          t('pages.ResetPasswordScreen.send-reset-link') as string}
        onPress={handleContinue}
        disabled={step === 1 ? !isValidEmail(email) : username.trim() === ''}
        color={step === 1 ? 'blue' : 'red'}
      />
    </View>
    </TouchableWithoutFeedback>
  );
};

export default ResetPassword;
