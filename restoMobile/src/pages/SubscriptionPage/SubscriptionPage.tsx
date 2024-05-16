import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  addRestoUserPermissions,
  getRestoUserPermission,
  removeRestoUserPermissions,
} from '../../services/permissionsCalls'; // Make sure to adapt the path to your project structure
import SubscriptionBox from '@src/components/SubscriptionBox/SubscriptionBox'; // Make sure to adapt the path to your project structure

const SubscriptionPage = () => {
  const [userPermissions, setUserPermissions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('user');
        if (!userToken) {
          return;
        }
        const permissions = await getRestoUserPermission(userToken);
        setUserPermissions(permissions || []);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddPermission = async (permission) => {
    try {
      const userToken = await AsyncStorage.getItem('user');
      if (!userToken) {
        return;
      }
      await addRestoUserPermissions(userToken, permission);
      const permissions = await getRestoUserPermission(userToken);
      setUserPermissions(permissions || []);
    } catch (error) {
      console.error('Error adding user permissions:', error);
    }
  };

  const handleRemovePermission = async (permission) => {
    try {
      const userToken = await AsyncStorage.getItem('user');
      if (!userToken) {
        return;
      }
      await removeRestoUserPermissions(userToken, permission);
      const permissions = await getRestoUserPermission(userToken);
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
    <View style={styles.userPermissionsContainer}>
      <Text style={styles.title}>{t('pages.SubscriptionPage.my-subscription')}</Text>
      <View style={styles.subscriptionContainer}>
        <SubscriptionBox
          title={t('pages.SubscriptionPage.free')}
          description={[t('pages.SubscriptionPage.free-description')]}
          price="0.00 €"
          onClick={handleSwitchPermissions}
          isActive={userPermissions.includes('default') || userPermissions.length === 0}
          permission="default"
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
        />
        <SubscriptionBox
          title={t('pages.SubscriptionPage.premium')}
          description={[
            t('pages.SubscriptionPage.description-low-level-1'),
            t('pages.SubscriptionPage.description-low-level-2'),
            t('pages.SubscriptionPage.description-high-level-1'),
            t('pages.SubscriptionPage.description-high-level-1'),
          ]}
          price="5.99 €"
          onClick={handleSwitchPermissions}
          isActive={userPermissions.includes('premiumUser')}
          permission="premiumUser"
          onDelete={handleRemovePermission}
        />
      </View>
    </View>
  );
};

export default SubscriptionPage;

const styles = StyleSheet.create({
  userPermissionsContainer: {
    margin: '0 auto',
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  subscriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscriptionCard: {
    position: 'relative',
    width: '45%',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  highlighted: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  cardTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  descriptionText: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#333',
    color: 'white',
    padding: 8,
    textAlign: 'center',
  },
  buttonHover: {
    backgroundColor: '#555',
  },
});
