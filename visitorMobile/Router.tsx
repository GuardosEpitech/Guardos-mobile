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
import {checkIfTokenIsValid} from "./src/services/userCalls";

const Tab = createBottomTabNavigator();

const MyTabs = () => {
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
        await AsyncStorage.removeItem('userName');
      }
      setLoggedIn(false);
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
            let iconName;

            if (route.name === 'RestaurantScreen') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'MapScreen') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === 'AboutUs') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'ContactUs') {
              iconName = focused ? 'call' : 'call-outline';
            } else if (route.name === 'My Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'log-in' : 'log-in-outline';
            } else if (route.name === 'Register') {
              iconName = focused ? 'person-add' : 'person-add-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#6d071a' : color} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {loggedIn ? (
          <>
            <Tab.Screen name="RestaurantScreen" component={RestaurantScreen} />
            <Tab.Screen name="MapScreen" component={MapPage} />
            <Tab.Screen name="AboutUs" component={AboutUsScreen} />
            <Tab.Screen name="ContactUs" component={ContactUsScreen} />
            <Tab.Screen name="My Profile">
              {(props) => <Profile {...props} setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen name="Login">
              {(props) => <LoginScreen {...props} setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
            <Tab.Screen name="Register" component={Register} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MyTabs;
