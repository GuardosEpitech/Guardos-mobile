import React, { useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faPizzaSlice, faShoppingBasket, faUser, faSignInAlt, faUserPlus, faQrcode, faUnlockKeyhole } from '@fortawesome/free-solid-svg-icons';
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


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs()

const MyTabs = () => {
  const [loggedIn, setLoggedIn] = useState(false);

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

            return <FontAwesomeIcon icon={icon} size={size} style={{ color: focused ? '#6d071a' : color }} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {loggedIn ? (
          <>
            <Tab.Screen name="Scanning" component={MyQrStack} />
            <Tab.Screen name="My Restaurants" component={MyStack} />
            <Tab.Screen name="My Dishes" component={MyDishStack} />
            <Tab.Screen name="My Products" component={MyProductStack} />
            <Tab.Screen
              name="My Profile"
              options={{ headerShown: false }}
            >
              {() => <ProfileStackScreen setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {() => <LoginStackScreen setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
            <Tab.Screen name="Register" component={Register} />
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
    </Stack.Navigator>
  );
}

interface ProfileStackProps {
  setLoggedInStatus: (status: any) => void;
  route?: RouteProp<ParamListBase, 'Profile'> & { params: { passwordChanged: boolean } };
}

const ProfileStackScreen: React.FC<ProfileStackProps> = ({ setLoggedInStatus }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
    >
      {(props) => <ProfilePage {...props} setLoggedInStatus={setLoggedInStatus} />}
    </Stack.Screen>
    <Stack.Screen name="FeatureRequest" component={FeatureRequest} />
    <Stack.Screen name="Change Password" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

interface LoginStackProps {
  setLoggedInStatus: (status: boolean) => void;
}

const LoginStackScreen: React.FC<LoginStackProps> = ({ setLoggedInStatus }) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login">
      {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
    </Stack.Screen>
    <Stack.Screen name="Account Recovery" component={ResetPassword} />
  </Stack.Navigator>
);

export default MyTabs;
