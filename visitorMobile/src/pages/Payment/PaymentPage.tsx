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
import { StripeProvider, usePaymentSheet } from '@stripe/stripe-react-native';

const PaymentPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [customerID, setCustomerId] = useState("");
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
    const [darkMode, setDarkMode] = useState(false);
    const [ready, setReady] = useState(false);
    const [publishableKey, setKey] = useState("");
    const [isKeyLoading, setIsKeyLoading] = useState(true);
    const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();

    const fetchMethods = async () => {
        try {
            const userToken = await AsyncStorage.getItem('user');
            if (!userToken) return;
            const methods = await getPaymentMethods(userToken);
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const fetchData = async () => {
        try {
            const userToken = await AsyncStorage.getItem('user');
            if (!userToken) return;
            const customer = await getCustomer(userToken);
            if (!customer) {
                const newCustomerId = await addCustomer(userToken);
                setCustomerId(newCustomerId);
            } else {
                setCustomerId(customer);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    const loadDarkModeState = async () => {
        try {
            const darkModeValue = await AsyncStorage.getItem('DarkMode');
            if (darkModeValue !== null) {
                setDarkMode(JSON.parse(darkModeValue));
            }
        } catch (error) {
            console.error('Error loading dark mode state:', error);
        }
    };

    const getKey = async () => {
        try {
            const response = await getStripeKey();
            const { publishableKey } = response;
            if (publishableKey) {
                setKey(publishableKey);
            } else {
                console.error('Publishable Key is null or undefined');
            }
        } catch (error) {
            console.error('Error fetching Stripe key:', error);
        } finally {
            setIsKeyLoading(false);
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
        try {
            const userToken = await AsyncStorage.getItem('user');
            if (!userToken) return;

            const response = await fetchPaymentSheetParams(userToken);
            console.log('fetchPaymentSheetParams response:', response);

            const { setupIntent, ephemeralKey, customer } = response || {};

            if (!setupIntent || !ephemeralKey || !customer) {
                Alert.alert(`${t('pages.Payment.error')}`, `${t('pages.ResetPasswordScreen.user-error')}`);
                return;
            }

            const { error } = await initPaymentSheet({
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
        } catch (error) {
            console.error('Error initializing Payment Sheet:', error);
        }
    };

    const onCheckout = async () => {
        try {
            const { error } = await presentPaymentSheet();
            if (error) {
                Alert.alert(`${t('pages.Payment.error')} ${error.code}`, error.message);
            } else {
                Alert.alert(t('pages.Payment.success'), t('pages.Payment.msg'));
                setReady(false);
                fetchMethods();
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    if (isKeyLoading) {
        return (
            <View style={[styles.containerLoad, darkMode && styles.containerLoadDark]}>
                <Text>{t('common.loading')}</Text>
            </View>
        );
    }

    if (!publishableKey) {
        return (
            <View style={[styles.containerLoad, darkMode && styles.containerLoadDark]}>
                <Text>{t('common.unexpected-error')}</Text>
            </View>
        );
    }

    return (
        <StripeProvider publishableKey={publishableKey} merchantIdentifier="merchant.com.guardos">
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
                                        {...paymentMethod}
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
