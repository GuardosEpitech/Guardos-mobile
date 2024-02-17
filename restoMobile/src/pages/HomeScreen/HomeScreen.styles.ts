import { StyleSheet, Dimensions, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAFAFA',
      alignItems: 'center',
      position: 'relative',
    },
    roundButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 150,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#007BFF',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
export default styles;