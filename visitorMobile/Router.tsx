import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RestaurantScreen from './src/pages/RestaurantScreen/RestaurantScreen';
import AboutUsScreen from './src/pages/AboutUs/AboutUs';
import ContactUsScreen from './src/pages/ContactUs/ContactUs';
import MyProfileScreen from './src/pages/Profile/MyProfile';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'RestaurantScreen') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'AboutUs') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            } else if (route.name === 'ContactUs') {
              iconName = focused ? 'call' : 'call-outline';
            } else if (route.name === 'MyProfile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#6d071a' : color} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="RestaurantScreen" component={RestaurantScreen} />
        <Tab.Screen name="AboutUs" component={AboutUsScreen} />
        <Tab.Screen name="ContactUs" component={ContactUsScreen} />
        <Tab.Screen name="MyProfile" component={MyProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MyTabs;
