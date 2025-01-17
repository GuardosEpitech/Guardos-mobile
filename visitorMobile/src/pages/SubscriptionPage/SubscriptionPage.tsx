import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  addVisitorUserPermissions,
  getVisitorUserPermission,
  removeVisitorUserPermissions,
} from '../../services/permissionsCalls';
import SubscriptionBox from '../../components/SubscriptionBox/SubscriptionBox';
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./SubscriptionPage.styles";

const SubscriptionPage = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken === null) {
          return;
        }
        const permissions = await getVisitorUserPermission(userToken);
        setUserPermissions(permissions || []);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };
    fetchDarkMode();
    fetchData();
  }, []);

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

  const handleAddPermission = async (permission) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        return;
      }
      await addVisitorUserPermissions(userToken, permission);
      const permissions = await getVisitorUserPermission(userToken);
      setUserPermissions(permissions || []);
    } catch (error) {
      console.error('Error adding user permissions:', error);
    }
  };

  const handleRemovePermission = async (permission) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        return;
      }
      await removeVisitorUserPermissions(userToken, permission);
      const permissions = await getVisitorUserPermission(userToken);
      setUserPermissions(permissions || []);
    } catch (error) {
      console.error('Error removing user permissions:', error);
    }
  };

  const handleSwitchPermissions = async (permission) => {
    await handleRemovePermission(userPermissions);
    await handleAddPermission(permission);
    setUserPermissions(permission);
  };

  return (
    <ScrollView contentContainerStyle={[styles.userPermissionsContainer, darkMode && styles.containerDarkTheme]}>
      <Text style={[styles.title, darkMode && styles.titleDark]}>{t('pages.SubscriptionPage.my-subscription')}</Text>
      <View style={styles.subscriptionContainer}>
        <SubscriptionBox
          title={t('pages.SubscriptionPage.free')}
          description={[t('pages.SubscriptionPage.free-description')]}
          price="0.00 €"
          onClick={handleSwitchPermissions}
          isActive={userPermissions.includes('default') || userPermissions.length === 0}
          permission="default"
          darkMode={darkMode}
        />
        <SubscriptionBox
          title={t('pages.SubscriptionPage.basic')}
          description={[
            t('pages.SubscriptionPage.description-low-level-1'),
            t('pages.SubscriptionPage.description-low-level-2'),
          ]}
          price="2.99 €"
          onClick={handleSwitchPermissions}
          isActive={userPermissions.includes('basicSubscription')}
          permission="basicSubscription"
          onDelete={handleRemovePermission}
          darkMode={darkMode}
        />
        <SubscriptionBox
          title={t('pages.SubscriptionPage.premium')}
          description={[
            t('pages.SubscriptionPage.description-low-level-1'),
            t('pages.SubscriptionPage.description-low-level-2'),
            t('pages.SubscriptionPage.description-high-level-1'),
            t('pages.SubscriptionPage.description-high-level-2'),
          ]}
          price="5.99 €"
          onClick={handleSwitchPermissions}
          isActive={userPermissions.includes('premiumUser')}
          permission="premiumUser"
          onDelete={handleRemovePermission}
          darkMode={darkMode}
        />
      </View>
    </ScrollView>
  );
};

export default SubscriptionPage;
