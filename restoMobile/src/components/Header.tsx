import { View, StyleSheet, Text, Dimensions } from 'react-native';

import {
    useFonts,
    Montserrat_100Thin,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  } from "@expo-google-fonts/montserrat";

const Header = ({ label }) => {
    let [fontsLoaded] = useFonts({
        Montserrat_100Thin,
        Montserrat_300Light,
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    
      });

  return (
    <View style={styles.container}>
      <Text style={styles.labelStyle}>{label}</Text>
    </View>
  );
};


const deviceWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: 60,
    backgroundColor: '#6D071A',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    alignItems: 'center',
  },
  labelStyle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Header;