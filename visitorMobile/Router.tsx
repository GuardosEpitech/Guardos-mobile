import React, {useState, createContext, useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LogBox} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RestaurantScreen from './src/pages/RestaurantScreen/RestaurantScreen';
import AboutUsScreen from './src/pages/AboutUs/AboutUs';
import ContactUsScreen from './src/pages/ContactUs/ContactUs';
import MapPage from './src/pages/MapPage/MapPage';
import Register from "./src/pages/ProfileScreen/Register/Register";
import LoginScreen from "./src/pages/ProfileScreen/Login/Login";
// import {checkIfTokenIsValid} from "./src/services/userCalls";
// import MyProfileScreen from './src/pages/Profile/MyProfile';
import MenuPage from './src/pages/MenuPage/MenuPage';
import ResetPassword from './src/pages/ResetPasswordScreen/ResetPasswordScreen';
import ChangePasswordScreen from "./src/pages/ProfileScreen/ChangePassword/ChangePassword";
import Profile from "./src/pages/ProfileScreen/Profile/Profile";
import FeatureRequest from './src/pages/FeatureRequest/FeatureRequest';
import { ISearchCommunication } from '../shared/models/communicationInterfaces';
import { FilterContext } from './src/models/filterContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs()

const MyTabs = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState<ISearchCommunication>({});
  const [darkMode, setDarkMode] = useState(false);

  const setLoggedInStatus = (status) => {
    setLoggedIn(status);
  };

  useEffect(() => {
    fetchDarkMode();  
  });

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
  // const checkAuthentication = async () => {
  //   try {
  //     const userToken = await AsyncStorage.getItem('userToken');
  //
  //     if (userToken === null) {
  //       setLoggedIn(false);
  //       return;
  //     }
  //
  //     const isUserTokenValid = await checkIfTokenIsValid({ key: userToken });
  //
  //     if (isUserTokenValid === 'OK') {
  //       setLoggedIn(true);
  //     } else {
  //       setLoggedIn(false);
  //       await AsyncStorage.removeItem('userToken');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching login data:', error);
  //   }
  // };
  //
  // useEffect(() => {
  //   checkAuthentication();
  // }, []);

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
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
            } else if (route.name === 'MenuPage') {
              return null;
            } else if (route.name === 'Account Recovery') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? 'black' : color}/>;
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
              name="RestaurantScreen" 
              component={RestauStack} 
              options={{headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
            <Tab.Screen 
              name="MapScreen" 
              component={MapPage}
              options={{headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
            <Tab.Screen 
              name="AboutUs" 
              component={AboutUsScreen}
              options={{headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}/>
            <Tab.Screen 
              name="ContactUs" 
              component={ContactUsScreen}
              options={{headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}
              />
            <Tab.Screen
              name="My Profile"
              options={{headerShown: true, headerStyle: {backgroundColor: '#6d071a'}}}>
              {() => <ProfileStackScreen setLoggedInStatus={setLoggedInStatus}/>}
            </Tab.Screen>
            <Tab.Screen 
              name="MenuPage"
              component={MenuPage}
              options={{ headerShown: true, headerStyle: {backgroundColor: '#6d071a'}, tabBarButton: () => null }} />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Login"
              options={{ headerShown: false }}
            >
              {() => <LoginStackScreen setLoggedInStatus={setLoggedInStatus} />}
            </Tab.Screen>
            <Tab.Screen name="Register" component={Register}/>
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
    </FilterContext.Provider>
  );
};

interface ProfileStackProps {
  setLoggedInStatus: (status: boolean) => void;
}

const ProfileStackScreen: React.FC<ProfileStackProps> = ({setLoggedInStatus}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Profile"
      options={{headerShown: false,}}
    >
      {(props) => <Profile {...props} setLoggedInStatus={setLoggedInStatus}/>}
    </Stack.Screen>
    <Stack.Screen name="FeatureRequest" component={FeatureRequest} />
    <Stack.Screen name="Change Password" component={ChangePasswordScreen}/>
  </Stack.Navigator>
);

const RestauStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RestaurantScreen"
        component={RestaurantScreen}
        options={{headerShown: false, headerStyle: {backgroundColor: 'black'}}}
      />
      <Stack.Screen
        name="MenuPage"
        component={MenuPage}
        options={{headerShown: false, headerStyle: {backgroundColor: '#6d071a'}}}
      />
    </Stack.Navigator>
  );
};

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
