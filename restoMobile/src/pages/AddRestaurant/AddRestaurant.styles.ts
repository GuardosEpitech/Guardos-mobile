import { StyleSheet, Dimensions, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      position: 'relative',
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
      marginTop: 10,
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 10,
    },
    placeholderContainer: {
      backgroundColor: 'rgba(0, 123, 255, 0.2)',
      width: 200,
      height: 200,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007BFF',
    },
    inputContainer: {
      padding: 20,
    },
    inputPair: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default styles;