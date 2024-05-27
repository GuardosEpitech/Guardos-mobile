import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
    getCustomer, 
    addCustomer, 
    deletePaymentMethod, 
    getPaymentMethods, 
    fetchPaymentSheetParams, 
    getStripeKey 
} from '../../services/userCalls';
import CreditCard from '../../components/CreditCard/CreditCard';
import { IPaymentMethod } from '../../../../shared/models/paymentInterfaces';
import styles from './PaymentPage.styles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StripeProvider, usePaymentSheet} from '@stripe/stripe-react-native';

const PaymentPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [customerID, setCustomerId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const [ready, setReady] = useState(false);
    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
    const [publishableKey, setKey] = useState("");

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
    
    const getKey = async () => {
        try {
            const { publishableKey } = await getStripeKey();
            if (publishableKey !== null) {
              setKey(publishableKey);
            }
          } catch (error) {
            console.error('Error fetching stripe key:', error);
          }
    };

    useEffect(() => {
        loadDarkModeState();
        getKey();
        fetchData();
        fetchMethods();
        initialisePaymentSheet();   
    }, []);

    const initialisePaymentSheet = async () => {
        const userToken = await AsyncStorage.getItem('user');
        if (userToken === null) { return; }
        const {setupIntent, ephemeralKey, customer} =
          await fetchPaymentSheetParams(userToken);
        const {error} = await initPaymentSheet({
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          setupIntentClientSecret: setupIntent,
          merchantDisplayName: 'Guardos',
          allowsDelayedPaymentMethods: true,
        });
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          setIsLoading(false);
          setReady(true);
        }
      };

    const onCheckout = async () => {
        const {error} = await presentPaymentSheet();

        if (error) {
            Alert.alert(`${t('pages.Payment.error')} ${error.code}`, error.message);
        } else {
            Alert.alert(t('pages.Payment.success'), t('pages.Payment.msg'));
            setReady(false);
            fetchMethods();
        }
    };

    return (
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.com.guardos"
        >
        <View style={[styles.paymentPage, darkMode && styles.paymentPageDark]}>
            <Text style={[styles.heading, darkMode && styles.headingDark]}>
                {t('pages.Payment.title')}
            </Text>
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
                    <View style={styles.noPaymentMethods}>
                        <Text style={darkMode && styles.noPaymentMethodsDark}>
                            {t('pages.Payment.nopay')}
                        </Text>
                    </View>
                )}
                <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={onCheckout} 
                    disabled={loading || !ready}
                >
                    <Text style={styles.buttonText}>
                        {t('pages.Payment.add')}
                    </Text>
                </TouchableOpacity>
            </>
            )}
        </View>
        </StripeProvider>
    );
};

export default PaymentPage;