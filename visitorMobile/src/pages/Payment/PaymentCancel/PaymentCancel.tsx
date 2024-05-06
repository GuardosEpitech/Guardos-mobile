import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import styles from './PaymentCancel.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentCancel: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState(false);

    const redirectToPaymentPage = () => {
        navigation.navigate('Payment methods');
    };

    const loadDarkModeState = async () => {
        try {
          const darkModeValue = await AsyncStorage.getItem('DarkMode');
          if (darkModeValue !== null) {
            setDarkMode(JSON.parse(darkModeValue));
          }
        } catch (error) {
          console.error('Error loading dark mode value:', error);
        }
      };

    useEffect(() => {
        loadDarkModeState();
    }, []);

    return (
        <View style={[styles.paymentFailPage, darkMode && styles.paymentFailPageDark]}>
            <Text style={[styles.heading, darkMode && styles.headingDark]}>{t('pages.PaymentCancel.title')}</Text>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={redirectToPaymentPage}>
                    <Text>{t('pages.PaymentCancel.back')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PaymentCancel;
