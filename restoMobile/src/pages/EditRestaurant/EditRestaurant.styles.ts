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
  deleteButton: {
    padding: 10,
    backgroundColor: 'red',
    margin: 5,
  },
  changeButton: {
    padding: 10,
    backgroundColor: 'lightgrey',
    margin: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
  },
  placeholderContainer: {
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    width: 200,
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  }
  });
  
export default styles;