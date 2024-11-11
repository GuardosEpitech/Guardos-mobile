import { View, StyleSheet, Text, Dimensions } from 'react-native';

const Header = ({ label }) => {

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
