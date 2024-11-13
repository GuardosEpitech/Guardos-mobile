import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules, View, Text, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import './i18n/i18n';

import RestaurantScreen from './src/pages/RestaurantScreen/RestaurantScreen';
import AboutUsScreen from './src/pages/AboutUs/AboutUs';
import ContactUsScreen from './src/pages/ContactUs/ContactUs';
import MapPage from './src/pages/MapPage/MapPage';
import Register from "./src/pages/ProfileScreen/Register/Register";

//Use this LoginScreen if you want to build the apk
import LoginScreen from "./src/pages/ProfileScreen/Login/LoginWithThridParty";
//import LoginScreen from "./src/pages/ProfileScreen/Login/Login";
import ChangePasswordScreen from "./src/pages/ProfileScreen/ChangePassword/ChangePassword";
import Profile from "./src/pages/ProfileScreen/Profile/Profile";
import FeatureRequest from './src/pages/FeatureRequest/FeatureRequest';
import PrivacyPage from './src/pages/PrivacyPage/PrivacyPage';
import ImprintPage from './src/pages/ImprintPage/ImprintPage';
import AppIntro from './src/pages/AppIntro/AppIntro';
import SubscriptionPage from "./src/pages/SubscriptionPage/SubscriptionPage";
import PaymentPage from './src/pages/Payment/PaymentPage';
import TermsPage from "./src/pages/TermsPage/TermsPage";
import UserSupport from "./src/pages/UserSupport/UserSupport";
import MenuPage from './src/pages/MenuPage/MenuPage';
import i18n from "i18next";
import GuidesPage from "./src/pages/Guides/GuidesPage";
import ResetPassword from './src/pages/ResetPasswordScreen/ResetPasswordScreen';
import { ISearchCommunication } from '../shared/models/communicationInterfaces';
import { FilterContext } from './src/models/filterContext';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ErrorScreen: React.FC<{ errorMessage: string }> = ({ errorMessage }) => (
    <View style={styles.container}>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
);

const MainDrawer = ({ setLoggedInStatus }) => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [filter, setFilter] = useState<ISearchCommunication>({});

  useEffect(() => {
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

    fetchDarkMode();
  }, []);


  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      <Drawer.Navigator
          screenOptions={({ route }) => ({
            drawerIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'RestaurantScreen':
                  iconName = focused ? 'restaurant' : 'restaurant-outline';
                  break;
                case 'MapScreen':
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case 'Guides':
                  iconName = focused ? 'book' : 'book-outline';
                  break;
                case 'AboutUs':
                  iconName = focused ? 'information-circle' : 'information-circle-outline';
                  break;
                case 'ContactUs':
                  iconName = focused ? 'call' : 'call-outline';
                  break;
                case 'My Profile':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                default:
                  iconName = 'alert-circle-outline';
                  break;
              }

              return <Ionicons name={iconName} size={size} color={focused ? 'black' : color} />;
            },
            drawerStyle: {
              backgroundColor: darkMode ? '#121212' : '#fff',
            },
            drawerActiveTintColor: darkMode ? 'white' : 'black',
            drawerInactiveTintColor: darkMode ? '#b0b0b0' : 'black',
          })}
      >
        <Drawer.Screen
            name="Restaurant Screen"
            options={{
              drawerLabel: t('pages.Router.resto-screen') as string,
              title: t('pages.Router.resto-screen') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
            component={MyStack}
        />
        <Drawer.Screen
            name="MapScreen"
            component={MapPage}
            options={{
              drawerLabel: t('pages.Router.map-screen') as string,
              title: t('pages.Router.map-screen') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
          name="Guides"
          component={GuidesPage}
          options={{
            drawerLabel: t('pages.Router.guides') as string,
            title: t('pages.Router.guides') as string,
            headerShown: true,
            headerStyle: { backgroundColor: '#6d071a' },
          }}
        />
        <Drawer.Screen
            name="AboutUs"
            component={AboutUsScreen}
            options={{
              drawerLabel: t('pages.Router.about-us') as string,
              title: t('pages.Router.about-us') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="ContactUs"
            component={ContactUsScreen}
            options={{
              drawerLabel: t('pages.Router.contact-us') as string,
              title: t('pages.Router.contact-us') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="My Profile"
            options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }}
        >
          {() => <ProfileStackScreen setLoggedInStatus={setLoggedInStatus} />}
        </Drawer.Screen>
      </Drawer.Navigator>
      </FilterContext.Provider>
  );
};

const Router: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [hasInternetConnection, setHasInternetConnection] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasInternetConnection(state.isConnected);
    });

    fetchUserLanguage();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchUserLanguage = async () => {
    console.log('Fetching user language...');
    const deviceLanguage =
        (Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier).split('_')[0];

    if (deviceLanguage === 'en' || deviceLanguage === 'de' || deviceLanguage === 'fr') {
      console.log('Setting user language to:', deviceLanguage);
      i18n.changeLanguage(deviceLanguage);
    }
  };

  const fetchIntro = async () => {
    try {
      const introValue = await AsyncStorage.getItem('introShown');
      if (introValue === null) {
        setShowIntro(true);
      }
    } catch (error) {
      console.error('Error fetching intro value:', error);
    }
  };

  const handleIntroFinish = () => {
    setShowIntro(false);
    AsyncStorage.setItem('introShown', 'true');
  };

  useEffect(() => {
    fetchIntro();
  }, []);

  const renderContent = () => {
    if (!hasInternetConnection) {
      return <ErrorScreen errorMessage={t('pages.Router.no-internet-error') as string} />;
    }
    return (
        <NavigationContainer>
          {loggedIn && showIntro ? (
              <AppIntro onFinish={handleIntroFinish} />
          ) : (
              <Stack.Navigator>
                {!loggedIn ? (
                    <Stack.Screen name="Auth" options={{ headerShown: false }}>
                      {(props) => <AuthTabs {...props} setLoggedInStatus={setLoggedIn} />}
                    </Stack.Screen>
                ) : (
                    <>
                      <Stack.Screen name="Main" options={{ headerShown: false }}>
                        {(props) => <MainDrawer {...props} setLoggedInStatus={setLoggedIn} />}
                      </Stack.Screen>
                      <Stack.Screen name="RestaurantScreen" component={RestaurantScreen} options={{ headerShown: false }} />
                    </>
                )}
              </Stack.Navigator>
          )}
        </NavigationContainer>
    );
  };

  return renderContent();
};

const AuthTabs = ({ setLoggedInStatus }) => {
  const { t } = useTranslation();

  return (
      <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let icon;

              if (route.name === 'Login') {
                icon = focused ? 'log-in' : 'log-in-outline';
              } else if (route.name === 'Register') {
                icon = focused ? 'person-add' : 'person-add-outline';
              }

              return <Ionicons name={icon} size={size} color={focused ? 'black' : color} />;
            },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'black',
            tabBarStyle: {
              backgroundColor: '#6d071a',
            },
          })}
      >
        <Tab.Screen
            name="Login"
            options={{ tabBarLabel: t('pages.Router.login') as string }}
        >
          {() => <LoginStackScreen setLoggedInStatus={setLoggedInStatus} />}
        </Tab.Screen>
        <Tab.Screen
            name="Register"
            component={Register}
            options={{ tabBarLabel: t('pages.Router.register') as string }}
        />
      </Tab.Navigator>
  );
};

const MyStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="RestaurantScreen"
            component={RestaurantScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="MenuPage"
            component={MenuPage}
            options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

interface ProfileStackProps {
  setLoggedInStatus: (status: boolean) => void;
}

const ProfileStackScreen: React.FC<ProfileStackProps> = ({ setLoggedInStatus }) => {
  const { t } = useTranslation();

  return (
      <Stack.Navigator>
        <Stack.Screen
            name="Profile"
            options={{
              title: t('pages.Router.my-profile') as string,
              headerShown: false,
            }}
        >
          {(props) => <Profile {...props} setLoggedInStatus={setLoggedInStatus} />}
        </Stack.Screen>
        <Stack.Screen name="FeatureRequest" component={FeatureRequest} options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }} />
        <Stack.Screen name="UserSupport" component={UserSupport} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}} />
        <Stack.Screen name="Subscriptions" component={SubscriptionPage} options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }} />
        <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
        <Stack.Screen name="Terms and Conditions" component={TermsPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
        <Stack.Screen name="Privacy" component={PrivacyPage} options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }} />
        <Stack.Screen name="Imprint" component={ImprintPage} options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }} />
        <Stack.Screen name="Payment methods" component={PaymentPage} options={{ headerShown: true, headerStyle: { backgroundColor: '#6d071a' } }} />
      </Stack.Navigator>
  );
};

interface LoginStackProps {
  setLoggedInStatus: (status: boolean) => void;
}

const LoginStackScreen: React.FC<LoginStackProps> = ({ setLoggedInStatus }) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{
          title: t('pages.Router.login') as string,
          headerShown: false
        }}
      >
        {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
      </Stack.Screen>
      <Stack.Screen name="Account Recovery" component={ResetPassword} />
    </Stack.Navigator>
  );
}


// @ts-ignore
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Router;
