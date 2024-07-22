import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 16,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      marginBottom: 16,
    },
  });
  
export default styles;
