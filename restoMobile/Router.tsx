import React from 'react';
import * as Font from 'expo-font';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyRestaurantsScreen from './src/pages/MyRestaurantsScreen/MyRestaurantsScreen';
import MyDishesScreen from './src/pages/MyDishesScreen/MyDishesScreen';
import MyProductsScreen from './src/pages/MyProductsScreen/MyProductsScreen';
import EditRestaurant from "src/pages/EditRestaurant/EditRestaurant";
import { LogBox } from 'react-native';
import AddRestaurant from "src/pages/AddRestaurantScreen/AddRestaurantScreen";
import MenuPage from 'src/pages/MenuPage/MenuPage';
import AddRestaurantScreen from 'src/pages/AddRestaurantScreen/AddRestaurantScreen';
import LoginScreen from './src/pages/ProfileScreen/Login/Login';
import Register from "./src/pages/ProfileScreen/Register/Register";
import AddPage from './src/pages/AddPage/AddPage';
import QRCodeEngin from './src/pages/QRCodeEngin/QRCodeEngin';
import AddProductScreen from './src/pages/AddProductScreen/AddProductScreen';
import EditProductPage from './src/pages/EditProductPage/EditProductPage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(['Warning: ...']);

const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'My Restaurants') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'My Dishes') {
              iconName = focused ? 'pizza' : 'pizza-outline';
            } else if (route.name === 'My Products') {
              iconName = focused ? 'basket' : 'basket-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Scanning') {
              iconName = focused ? 'scan' : 'scan-outline';
            }

            return <Ionicons name={iconName} size={size} color={focused ? '#6d071a' : color} />;
          },
          tabBarActiveTintColor: '#6d071a',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Scanning" component={MyQrStack} />
        <Tab.Screen name="My Restaurants" component={MyRestaurantsScreen} />
        <Tab.Screen name="My Dishes" component={MyDishesScreen} />
        <Tab.Screen name="My Products" component={MyProductStack} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={Register} />
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
      <Stack.Screen
        name="AddPage"
        component={AddPage}
        options={{ headerShown: false }}
      />
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

export default MyTabs;
