import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './ContactUs.styles';
import { Ionicons } from '@expo/vector-icons';
import { IContactForm } from '../../models/emailInterfaces';
import { sendEmail } from '../../services/emailCalls';
import AsyncStorage from "@react-native-async-storage/async-storage";


const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    fetchDarkMode();  
  })

  const fetchDarkMode = async () => {
    try {
      const darkModeValue = await AsyncStorage.getItem('DarkMode');
      if (darkModeValue !== null) {
        const isDarkMode = darkModeValue === 'true';
        setDarkMode(isDarkMode);
      }
    } catch (error) {
      console.error('Error fetching dark mode value:', error);
    }
  };


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
      <KeyboardAvoidingView style={[styles.container, darkMode && styles.containerDarkTheme]} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        {/* Display contact information */}
        <Text style={[styles.heading, darkMode && styles.headingDarkTheme]}>Get in touch</Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactDetail}>
            <Ionicons name="md-call" size={24} color="black" />
            <Text style={[styles.contactText, darkMode && styles.contactTextDarkTheme]}>030 1234567</Text>
          </View>

          <View style={styles.contactDetail}>
            <Ionicons name="md-mail" size={24} color="black" />
            <Text style={[styles.contactText, darkMode && styles.contactTextDarkTheme]}>guardos-help@outlook.com</Text>
          </View>

          <View style={styles.contactDetail}>
            <Ionicons name="md-pin" size={24} color="black" />
            <Text style={[styles.contactText, darkMode && styles.contactTextDarkTheme]}>Fasanenstraße 86, 10623 Berlin, Germany</Text>
          </View>
        </View>

        {/* Display contact form */}
        <View style={[styles.contactForm, darkMode && styles.contactFormDarkTheme]}>
          <Text style={[styles.heading, darkMode && styles.headingDarkTheme]}>Contact Form</Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Name"
            style={[styles.input, darkMode && styles.inputDarkTheme]}
          />
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Email"
            style={[styles.input, darkMode && styles.inputDarkTheme]}
          />
          <TextInput
            value={formData.subject}
            onChangeText={(text) => handleChange('subject', text)}
            placeholder="Subject"
            style={styles.input}
          />
          <TextInput
            value={formData.message}
            onChangeText={(text) => handleChange('message', text)}
            placeholder="Message"
            multiline
            style={[[styles.input, darkMode && styles.inputDarkTheme], { height: 100 }]}
          />

          {/* Submit button */}
          <TouchableOpacity onPress={handleSubmit} style={[styles.button, { backgroundColor: '#6d071a' }]}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>

          {/* Confirmation message */}
          {showConfirmation && (
            <Text style={[styles.message, { color: 'green' }]}>Message sent successfully!</Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ContactUs;
