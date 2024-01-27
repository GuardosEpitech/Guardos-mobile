import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RestaurantScreen from './src/pages/RestaurantScreen/RestaurantScreen';
import AboutUsScreen from './src/pages/AboutUs/AboutUs';
import ContactUsScreen from './src/pages/ContactUs/ContactUs';
import MapPage from './src/pages/MapPage/MapPage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Register from "./src/pages/ProfileScreen/Register/Register";
import Profile from "./src/pages/ProfileScreen/Profile/Profile";
import LoginScreen from "./src/pages/ProfileScreen/Login/Login";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {checkIfTokenIsValid} from "./src/services/userCalls";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const setLoggedInStatus = (status) => {
    setLoggedIn(status);
  };

  const checkAuthentication = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      setLoggedIn(true);
    } else {
      const isUserTokenValid = await checkIfTokenIsValid({key: userToken});

      if (isUserTokenValid === 'OK') {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        await AsyncStorage.removeItem('userToken');
      }
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <Stack.Navigator>
      {loggedIn ? (
        <Stack.Screen name="My Profile">
          {(props) => <Profile {...props} setLoggedInStatus={setLoggedInStatus} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
};

const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'RestaurantScreen') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'MapScreen') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'AboutUs') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'ContactUs') {
              iconName = focused ? 'call' : 'call-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#6d071a' : color} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="RestaurantScreen" component={RestaurantScreen} />
        <Tab.Screen name="MapScreen" component={MapPage} />
        <Tab.Screen name="AboutUs" component={AboutUsScreen} />
        <Tab.Screen name="ContactUs" component={ContactUsScreen} />
        <Tab.Screen options={{headerShown: false}} name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MyTabs;
