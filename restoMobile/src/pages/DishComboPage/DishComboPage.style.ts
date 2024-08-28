import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    label: {
      fontSize: 18,
      marginBottom: 8,
    },
    autocomplete: {
      minWidth: 300,
      marginBottom: 16,
    },
    errorText: {
      color: 'red',
      marginBottom: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    contentProducsDishes: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 20,
      },
      labelDarkTheme: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "white"
      },
      containerAllergens: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      },
      inputDishProduct: {
        height: 20,
      },
      labelCernterd: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center'
      },
      labelCernterdDarkTheme: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: "white"
      },
      inputDishProductDarkTheme: {
        height: 20,
        color: "white"
      },
      button: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        justifyContent: 'center',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalViewDark: {
        backgroundColor: 'black'
      },
      flexContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      },
      selectedButton: {
        borderColor: 'green',
      },
  });
  
  export default styles;