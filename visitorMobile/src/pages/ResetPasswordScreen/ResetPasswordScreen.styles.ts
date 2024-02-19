import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
        padding: 20,
    },
    heading: {
      fontSize: 24,
      marginBottom: 10,
      alignSelf: 'center',
      fontWeight: 'bold',
    },
    description: {
      fontSize: 22,
      marginBottom: 20,
      alignSelf: 'center',
    },
    label: {
      fontSize: 20,
      marginBottom: 5,
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      fontSize: 20,
    },
    emailSection: {
      marginBottom: 20,
    },
    emailDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      fontSize: 20,
    },
    pencilIcon: {
      marginLeft: 10,
      fontSize: 18,
    },
    error: {
      color: 'red',
      fontSize: 20,
      marginBottom: 10,
    },
    emailText: {
        fontSize: 20,
    }
  });

export default styles;