import { StyleSheet, PixelRatio } from 'react-native';

const styles = StyleSheet.create({
    imageStyle: {
      height: '50%',
      width: '100%',
      overflow: 'hidden',
      resizeMode: 'contain',
    },
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 30,
    },
    header: {
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    paragraph: {
      fontSize: 17,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    paginationWrapper: {
      position: 'absolute',
      bottom: '10%',
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    paginationDots: {
      height: 10,
      width: 10,
      borderRadius: 10 / 2,
      backgroundColor: '#6d071a',
      marginLeft: 10,
      marginBottom: -40,
    },
  });

export default styles;