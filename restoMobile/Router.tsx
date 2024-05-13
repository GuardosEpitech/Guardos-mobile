import React, { useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faPizzaSlice, faShoppingBasket, faUser, faSignInAlt, faUserPlus, faQrcode, faUnlockKeyhole, faList } from '@fortawesome/free-solid-svg-icons';
import MyRestaurantsScreen from './src/pages/MyRestaurantsScreen/MyRestaurantsScreen';
import MyDishesScreen from './src/pages/MyDishesScreen/MyDishesScreen';
import MyProductsScreen from './src/pages/MyProductsScreen/MyProductsScreen';
import EditRestaurant from "./src/pages/EditRestaurant/EditRestaurant";
import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuPage from './src/pages/MenuPage/MenuPage';
import AddRestaurantScreen from './src/pages/AddRestaurantScreen/AddRestaurantScreen';
import LoginScreen from './src/pages/ProfileScreen/Login/Login';
import Register from "./src/pages/ProfileScreen/Register/Register";
import QRCodeEngin from './src/pages/QRCodeEngin/QRCodeEngin';
import AddProductScreen from './src/pages/AddProductScreen/AddProductScreen';
import EditProductPage from './src/pages/EditProductPage/EditProductPage';
import {checkIfTokenIsValid} from "./src/services/userCalls";
import EditDish from "./src/pages/EditDishScreen/EditDish";
import ResetPassword from './src/pages/ResetPasswordScreen/ResetPasswordScreen';
import ChangePasswordScreen from './src/pages/ProfileScreen/ChangePassword/ChangePasswordScreen';
import { RouteProp } from '@react-navigation/native';
import ProfilePage from './src/pages/ProfileScreen/Profile/NewProfile';
import FeatureRequest from './src/pages/FeatureRequest/FeatureRequest';
import {useTranslation} from "react-i18next";
import PrivacyPage from './src/pages/PrivacyPage/PrivacyPage';
import ImprintPage from './src/pages/ImprintPage/ImprintPage';
import AddCategoryPage from './src/pages/AddCategories/AddCategories';
import PaymentPage from './src/pages/Payment/PaymentPage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs()

const MyTabs = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const {t} = useTranslation();

  const setLoggedInStatus = (status: any) => {
    setLoggedIn(status);
  };

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

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let icon;

            if (route.name === 'My Restaurants') {
              icon = focused ? faUtensils : faUtensils;
            } else if (route.name === 'My Dishes') {
              icon = focused ? faPizzaSlice : faPizzaSlice;
            } else if (route.name === 'My Categories') {
              icon = focused ? faList : faList;
            } else if (route.name === 'My Products') {
              icon = focused ? faShoppingBasket : faShoppingBasket;
            } else if (route.name === 'My Profile') {
              icon = focused ? faUser : faUser;
            } else if (route.name === 'Login') {
              icon = focused ? faSignInAlt : faSignInAlt;
            } else if (route.name === 'Register') {
              icon = focused ? faUserPlus : faUserPlus;
            } else if (route.name === 'Scanning') {
              icon = focused ? faQrcode : faQrcode;
            }
            // } else if (route.name === 'Account Recovery') {
            //   icon = focused ? faUnlockKeyhole : faUnlockKeyhole;
            // }

            return <FontAwesomeIcon icon={icon} size={size} style={{ color: focused ? 'white' : color }} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'black',
          tabBarStyle: {
            backgroundColor: '#6d071a',
          },
        })}
      >
        {loggedIn ? (
          <>
            <Tab.Screen
              name="Scanning"
              component={MyQrStack}
              options={{
                tabBarLabel: t('pages.Router.scan') as string,
                title: t('pages.Router.scan') as string,
                headerShown: true, 
                headerStyle: {backgroundColor: '#6d071a'}
              }}
            />
            <Tab.Screen
              name="My Restaurants"
              component={MyStack}
              options={{
                tabBarLabel: t('common.my-restos') as string,
                title: t('common.my-restos') as string,
                headerShown: true, 
                headerStyle: {backgroundColor: '#6d071a'}
              }}
            />
            <Tab.Screen
              name="My Categories"
              component={MyCategoryStack}
              options={{
                tabBarLabel: t('common.my-categories') as string,
                title: t('common.my-categories') as string,
                headerShown: true, 
                headerStyle: {backgroundColor: '#6d071a'}
              }}
            />
            <Tab.Screen
              name="My Dishes"
              component={MyDishStack}
              options={{
                tabBarLabel: t('common.my-dishes') as string,
                title: t('common.my-dishes') as string,
                headerShown: true, 
                headerStyle: {backgroundColor: '#6d071a'}
              }}
            />
            <Tab.Screen
              name="My Products"
              component={MyProductStack}
              options={{
                tabBarLabel: t('common.my-products') as string,
                title: t('common.my-products') as string,
                headerShown: true, 
                headerStyle: {backgroundColor: '#6d071a'}
              }}
            />
            <Tab.Screen
              name="My Profile"
              options={{
                tabBarLabel: t('pages.Router.my-profile') as string,
                headerShown: false, 
                headerStyle: {backgroundColor: '#6d071a'}
             }}
            >
              {() => <ProfileStackScreen setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              options={{
                headerShown: false,
                tabBarLabel: t('pages.Router.login') as string
              }}
            >
              {() => <LoginStackScreen setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
            <Tab.Screen
              name="Register"
              component={Register}
              options={{
                tabBarLabel: t('pages.Router.register') as string,
                title: t('pages.Router.register') as string
              }}
            />
          </>
          )
        }

      </Tab.Navigator>
    </NavigationContainer>
  );
};

const MyQrStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="QRCodeEngin"
        component={QRCodeEngin}
        options={{headerShown: false}}
      />
      {/*<Stack.Screen*/}
      {/*  name="AddPage"*/}
      {/*  component={AddPage}*/}
      {/*  options={{ headerShown: false }}*/}
      {/*/>*/}
    </Stack.Navigator>
  )
}

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyRestaurantsScreen"
        component={MyRestaurantsScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="AddRestaurantScreen"
        component={AddRestaurantScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="MenuPage"
        component={MenuPage}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="EditRestaurant"
        component={EditRestaurant}
        options={{ headerShown: false}}
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
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="AddProductScreen"
        component={AddProductScreen}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="EditProductPage"
        component={EditProductPage}
        options={{ headerShown: false}}
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
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="EditDish"
        component={EditDish}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryPage}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const MyCategoryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AddCategory"
        component={AddCategoryPage}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
}

interface ProfileStackProps {
  setLoggedInStatus: (status: any) => void;
  route?: RouteProp<ParamListBase, 'Profile'> & { params: { passwordChanged: boolean } };
}

const ProfileStackScreen: React.FC<ProfileStackProps> = ({ setLoggedInStatus }) => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        options={{
          tabBarLabel: t('pages.Router.my-profile') as string,
          title: t('pages.Router.my-profile') as string,
          headerStyle: {backgroundColor: '#6d071a'},
          headerShown: true, 
        }}
      >
        {(props) => <ProfilePage {...props} setLoggedInStatus={setLoggedInStatus} />}
      </Stack.Screen>
      <Stack.Screen name="FeatureRequest" component={FeatureRequest} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}} />
      <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
      <Stack.Screen name="Imprint" component={ImprintPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
      <Stack.Screen name="Payment methods" component={PaymentPage} options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
    </Stack.Navigator>
  );
}

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
          title: t('pages.Router.login') as string
        }}
      >
        {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
      </Stack.Screen>
      <Stack.Screen name="Account Recovery" component={ResetPassword} />
    </Stack.Navigator>
  )
};

export default MyTabs;
