import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getCustomer, addCustomer, deletePaymentMethod, getPaymentMethods } from '../../../services/userCalls';
import CreditCard from '../../../components/CreditCard/CreditCard';
import { IPaymentMethod } from '../../../../../shared/models/paymentInterfaces';
import styles from './PaymentPage.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [customerID, setCustomerId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    const fetchMethods = async () => {
        try {
            const userToken = await AsyncStorage.getItem('user');
            if (userToken === null) { return; }
            const methods = await getPaymentMethods(userToken);
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchData = async () => {
        try {
            const userToken = await AsyncStorage.getItem('user');
            if (userToken === null) { return; }
            const customer = await getCustomer(userToken);
            if (!customer) {
                const newCustomerId = await addCustomer(userToken);
                setCustomerId(newCustomerId);
            } else {
                setCustomerId(customer);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
        fetchData();
        fetchMethods();
        setIsLoading(false);
    }, []);

    return (
        <View style={[styles.paymentPage, darkMode && styles.paymentPageDark]}>
            <Text style={[styles.heading, darkMode && styles.headingDark]}>{t('pages.Payment.title')}</Text>
            {isLoading ? (
                <View style={[styles.containerLoad, darkMode && styles.containerLoadDark]}>
                    <Text>{t('common.loading')}</Text>
                </View>
            ) : (
                <>
                {paymentMethods.length > 0 ? (
                <ScrollView contentContainerStyle={styles.creditCardsContainer}>
                    {paymentMethods.map((paymentMethod, index) => (
                        <CreditCard
                            key={index}
                            name={paymentMethod.name}
                            brand={paymentMethod.brand}
                            last4={paymentMethod.last4}
                            exp_month={paymentMethod.exp_month}
                            exp_year={paymentMethod.exp_year}
                            id={paymentMethod.id}
                            onDelete={deletePaymentMethod}
                            onUpdate={fetchMethods}
                        />
                    ))}
                </ScrollView>
                ) : (
                    <View style={[styles.noPaymentMethods, darkMode && styles.noPaymentMethodsDark]}>
                        <Text>{t('pages.Payment.nopay')}</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.addButton} onPress={() => { /* handle adding payment method */ }}>
                    <Text style={styles.buttonText}>{t('pages.Payment.add')}</Text>
                </TouchableOpacity>
            </>
            )}
        </View>
    );
};

export default PaymentPage;