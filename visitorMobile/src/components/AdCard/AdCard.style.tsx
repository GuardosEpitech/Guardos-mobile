import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Math.round(Dimensions.get('window').width);
const offset = 40;
const radius = 20;

const styles = StyleSheet.create({
    adContainer: {
        width: deviceWidth - offset,
        backgroundColor: '#FFFFFF',
        padding: 20,
        margin: 10,
        height: 230,
        borderRadius: radius,
        shadowColor: '#000',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.75,
        shadowRadius: 4,
        elevation: 9,
        position: 'relative',
    },
    adImage: {
        height: 130,
        width: deviceWidth - offset,
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        opacity: 0.9,
        alignContent: 'center',
        alignSelf: 'center',
    },
    adDescription: {
      color: '#721c24',
      fontSize: 16,
      marginBottom: 5,
    },
    adLink: {
      color: '#007bff',
      fontSize: 14,
      textDecorationLine: 'underline',
    },
  });

  export default styles;