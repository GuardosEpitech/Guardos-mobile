import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './ContactUs.styles';
import { Ionicons } from '@expo/vector-icons';
import { IContactForm } from '../../models/emailInterfaces';
import { sendEmail } from '../../services/emailCalls';
import {useTranslation} from "react-i18next";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {t} = useTranslation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    const { name, email, subject, message } = formData;
    if (name && email && subject && message && isValidEmail(email)) {
      try {
        const response = await sendEmail(formData);

        if (response) {
          Keyboard.dismiss();
          setShowConfirmation(true);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
          });

          setTimeout(() => {
            setShowConfirmation(false);
          }, 3000);
        } else {
          console.error('Backend responded with an error:', response);
        }
      } catch (error) {
        console.error('Error sending data to the backend:', error);
      }
    }
  };

  const isValidEmail = (email: string) => {
    // Add your email validation logic here
    return true;
  };

  const handleChange = (key: keyof IContactForm, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        {/* Display contact information */}
        <Text style={styles.heading}>{t('pages.ContactUs.get-in-touch')}</Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactDetail}>
            <Ionicons name="md-call" size={24} color="black" />
            <Text style={styles.contactText}>030 1234567</Text>
          </View>

          <View style={styles.contactDetail}>
            <Ionicons name="md-mail" size={24} color="black" />
            <Text style={styles.contactText}>guardos-help@outlook.com</Text>
          </View>

          <View style={styles.contactDetail}>
            <Ionicons name="md-pin" size={24} color="black" />
            <Text style={styles.contactText}>{t('pages.ContactUs.address')}</Text>
          </View>
        </View>

        {/* Display contact form */}
        <View style={styles.contactForm}>
          <Text style={styles.heading}>{t('pages.ContactUs.contact-form')}</Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder={t('pages.ContactUs.name') as string}
            style={styles.input}
          />
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder={t('pages.ContactUs.email') as string}
            style={styles.input}
          />
          <TextInput
            value={formData.subject}
            onChangeText={(text) => handleChange('subject', text)}
            placeholder={t('pages.ContactUs.subject') as string}
            style={styles.input}
          />
          <TextInput
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            placeholder={t('pages.ContactUs.message') as string}
            multiline
            style={[styles.input, { height: 100 }]}
          />

          {/* Submit button */}
          <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: '#6d071a' }]}>
            <Text style={styles.buttonText}>{t('common.submit')}</Text>
          </TouchableOpacity>

          {/* Confirmation message */}
          {showConfirmation && (
            <Text style={[styles.message, { color: 'green' }]}>{t('pages.ContactUs.message-sent-success')}</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ContactUs;
