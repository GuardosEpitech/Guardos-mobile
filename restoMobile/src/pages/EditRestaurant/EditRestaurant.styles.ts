import { StyleSheet, Dimensions, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    imageContainer: {
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
    },
    column: {
      flex: 1,
      marginRight: 10,
    },
    inputPair: {
      marginBottom: 10,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginBottom: 10,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    saveButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      margin: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
export default styles;