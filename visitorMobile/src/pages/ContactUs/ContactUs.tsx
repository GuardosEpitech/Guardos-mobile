import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import styles from './ContactUs.styles';
import axios from 'axios';
// @ts-ignore
import { API_URL } from '@env';

interface IContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
const baseUrl = `${API_URL}sendEmail/`;

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    const { name, email, subject, message } = formData;
    if (name && email && subject && message && isValidEmail(email)) {
      try {
        const response = await axios.post(baseUrl, formData);

        if (response.status >= 200 && response.status < 300) {
          console.log('Backend response:', response.data);
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
          console.error('Backend responded with an error:', response.data);
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
        <ScrollView contentContainerStyle={styles.contactInfo}>
          <Text>Address: Your Address</Text>
          <Text>Telephone: Your Telephone Number</Text>
          <Text>Email: Your Email Address</Text>
        </ScrollView>

        {/* Display contact form */}
        <View style={styles.contactForm}>
          <TextInput
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="Name"
            style={styles.input}
          />
          <TextInput
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            placeholder="Email"
            style={styles.input}
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
            style={[styles.input, { height: 100 }]}
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
