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
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

export default styles;