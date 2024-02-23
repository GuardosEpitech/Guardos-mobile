import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 24,
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      alignSelf: 'flex-start',
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
  });
  
  export default styles;