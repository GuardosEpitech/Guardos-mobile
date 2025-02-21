import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

import MyRestaurantsScreen from './src/pages/MyRestaurantsScreen/MyRestaurantsScreen';
import MyDishesScreen from './src/pages/MyDishesScreen/MyDishesScreen';
import MyProductsScreen from './src/pages/MyProductsScreen/MyProductsScreen';
import EditRestaurant from "./src/pages/EditRestaurant/EditRestaurant";
import MenuPage from './src/pages/MenuPage/MenuPage';
import AddRestaurantScreen from './src/pages/AddRestaurantScreen/AddRestaurantScreen';
import LoginScreen from "./src/pages/ProfileScreen/Login/Login";
import Register from "./src/pages/ProfileScreen/Register/Register";
import QRCodeEngin from './src/pages/QRCodeEngin/QRCodeEngin';
import AddProductScreen from './src/pages/AddProductScreen/AddProductScreen';
import EditProductPage from './src/pages/EditProductPage/EditProductPage';
import EditDish from "./src/pages/EditDishScreen/EditDish";
import ResetPassword from './src/pages/ResetPasswordScreen/ResetPasswordScreen';
import ChangePasswordScreen from './src/pages/ProfileScreen/ChangePassword/ChangePasswordScreen';
import ProfilePage from './src/pages/ProfileScreen/Profile/NewProfile';
import FeatureRequest from './src/pages/FeatureRequest/FeatureRequest';
import PrivacyPage from './src/pages/PrivacyPage/PrivacyPage';
import ImprintPage from './src/pages/ImprintPage/ImprintPage';
import AddCategoryPage from './src/pages/AddCategories/AddCategories';
import AppIntro from './src/pages/AppIntro/AppIntro';
import SubscriptionPage from "./src/pages/SubscriptionPage/SubscriptionPage";
import PaymentPage from './src/pages/Payment/PaymentPage';
import UserSupport from './src/pages/UserSupport/UserSupport';
import {checkIfTokenIsValid} from "./src/services/userCalls";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import TermsPage from "./src/pages/TermsPage/TermsPage";
import DishDiscountPage from './src/pages/DishDiscountPage/DishDiscountPage';
import DishComboPage from './src/pages/DishComboPage/DishComboPage';
import UserInsights from "./src/pages/UserInsights/UserInsinghts";
import GuidesPage from "./src/pages/Guides/GuidesPage";
import AddRestoChain from "./src/pages/AddRestoChain/AddRestoChain";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

// @ts-ignore
const MainDrawer = ({ setLoggedInStatus }) => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
      <Drawer.Navigator
          screenOptions={({ route }) => ({
            drawerIcon: ({ focused, color, size }) => {
              let iconName;

              switch (route.name) {
                case 'MyRestaurantsScreen':
                  iconName = focused ? 'restaurant' : 'restaurant-outline';
                  break;
                case 'MyCategoriesScreen':
                    iconName = focused ? 'menu' : 'menu-outline';
                    break;
                case 'MyDishesScreen':
                  iconName = focused ? 'pizza' : 'pizza-outline';
                  break;
                case 'MyProductsScreen':
                  iconName = focused ? 'cart' : 'cart-outline';
                  break;
                case 'MyRestoChainScreen':
                    iconName = focused ? 'link' : 'link-outline';
                    break;
                case 'Profile':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                case 'QRCodeEngin':
                  iconName = focused ? 'qr-code' : 'qr-code-outline';
                  break;
                case 'Guides':
                  iconName = focused ?  'book' : 'book-outline';
                  break;
                case 'Insights':
                  iconName = focused ? 'analytics' : 'analytics-outline';
                  break;
                default:
                  iconName = 'alert-circle-outline'; // Default icon for unrecognized routes
                  break;
              }              
              return <Ionicons name={iconName} size={size} color={focused ? (darkMode ? 'white' : 'black') : color} />;
            },
            drawerStyle: {
              backgroundColor: darkMode ? '#121212' : '#fff',
            },
            drawerActiveTintColor: darkMode ? 'white' : 'black',
            drawerInactiveTintColor: darkMode ? '#b0b0b0' : 'black',
          })}
      >
        <Drawer.Screen
            name="MyRestaurantsScreen"
            component={MyStack}
            options={{
              drawerLabel: t('common.my-restos') as string,
              title: t('common.my-restos') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="MyCategoriesScreen"
            component={MyCategoryStack}
            options={{
              drawerLabel: t('common.my-categories') as string,
              title: t('common.my-categories') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="MyRestoChainScreen"
            component={AddRestoChain}
            options={{
              drawerLabel: t('common.my-resto-chains') as string,
              title: t('common.my-resto-chains') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="MyDishesScreen"
            component={MyDishStack}
            options={{
              drawerLabel: t('common.my-dishes') as string,
              title: t('common.my-dishes') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="MyProductsScreen"
            component={MyProductStack}
            options={{
              drawerLabel: t('common.my-products') as string,
              title: t('common.my-products') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="QRCodeEngin"
            component={MyQrStack}
            options={{
              drawerLabel: t('pages.Router.scan') as string,
              title: t('pages.Router.scan') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
        <Drawer.Screen
            name="Profile"
            options={{
              drawerLabel: t('pages.Router.my-profile') as string,
              title: t('pages.Router.my-profile') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        >
          {() => <ProfileStackScreen setLoggedInStatus={setLoggedInStatus} />}
        </Drawer.Screen>
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
            name="Insights"
            component={UserInsights}
            options={{
              title: t('common.my-analytics') as string,
              drawerLabel: t('common.my-analytics') as string,
              headerShown: true,
              headerStyle: { backgroundColor: '#6d071a' },
            }}
        />
      </Drawer.Navigator>
  );
};

const Router: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchIntro();
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken === null) {
        setLoggedIn(false);
        return;
      }

      const isUserTokenValid = await checkIfTokenIsValid({ key: userToken });

      if (isUserTokenValid === 'OK') {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        await AsyncStorage.removeItem('userToken');
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
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
                  <Stack.Screen name="Main" options={{ headerShown: false }}>
                    {(props) => <MainDrawer {...props} setLoggedInStatus={setLoggedIn} />}
                  </Stack.Screen>
              )}
            </Stack.Navigator>
        )}
      </NavigationContainer>
  );
};

// @ts-ignore
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

              return <Ionicons name={icon} size={size} color={focused ? 'white' : color} />;
            },
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'white',
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#6d071a',
            },
          })}
      >
        <Tab.Screen
            name="Login"
            options={{ tabBarLabel: t('pages.Router.login') as string }}
        >
          {(props) => <LoginStackScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
        </Tab.Screen>
        <Tab.Screen
            name="Register"
            component={Register}
            options={{ tabBarLabel: t('pages.Router.register') as string }}
        />
      </Tab.Navigator>
  );
};

const MyQrStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="QRCodeEngin"
            component={QRCodeEngin}
            options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

const MyStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="MyRestaurantsScreen"
            component={MyRestaurantsScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="AddRestaurantScreen"
            component={AddRestaurantScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="MenuPage"
            component={MenuPage}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="EditRestaurant"
            component={EditRestaurant}
            options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

const MyProductStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="MyProductsScreen"
            component={MyProductsScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="AddProductScreen"
            component={AddProductScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="EditProductPage"
            component={EditProductPage}
            options={{ headerShown: false }}
        />
      </Stack.Navigator>
  );
};

const MyDishStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="MyDishesScreen"
            component={MyDishesScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="EditDish"
            component={EditDish}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="AddCategory"
            component={AddCategoryPage}
            options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MyDishCombination" 
          component={DishComboPage} 
          options={{ 
            title: 'Dish Combination',
            headerStyle: { backgroundColor: '#6d071a' },
 }} 
      />
        <Stack.Screen
            name="Manage Discount"
            component={DishDiscountPage}
            options={{ headerShown: true }}
        />
      </Stack.Navigator>
  );
};

const MyCategoryStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen
            name="AddCategory"
            component={AddCategoryPage}
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
          tabBarLabel: t('pages.Router.my-profile') as string,
          title: t('pages.Router.my-profile') as string,
          headerStyle: {backgroundColor: '#6d071a'},
          headerShown: false,
        }}
      >
        {(props) => <ProfilePage {...props} setLoggedInStatus={setLoggedInStatus} />}
      </Stack.Screen>
      <Stack.Screen name="FeatureRequest" component={FeatureRequest} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}} />
      <Stack.Screen name="UserSupport" component={UserSupport} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}} />
      <Stack.Screen name="Subscriptions" component={SubscriptionPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}} />
      <Stack.Screen name="Terms and Conditions" component={TermsPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
      <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
      <Stack.Screen name="Imprint" component={ImprintPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
      <Stack.Screen name="Payment methods" component={PaymentPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
    </Stack.Navigator>
  );
};

interface LoginStackProps {
  setLoggedInStatus: (status: boolean) => void;
}

const LoginStackScreen: React.FC<LoginStackProps> = ({ setLoggedInStatus }) => {
  const { t } = useTranslation();

  return (
      <Stack.Navigator>
        <Stack.Screen
            name="Login"
            options={{
              title: t('pages.Router.login') as string,
            }}
        >
          {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
        </Stack.Screen>
        <Stack.Screen name="Account Recovery" component={ResetPassword} />
      </Stack.Navigator>
  );
};

export default Router;
