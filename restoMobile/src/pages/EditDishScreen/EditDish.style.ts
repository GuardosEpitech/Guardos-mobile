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
  containerPicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightDropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
  },
  darkDropdown: {
    backgroundColor: '#333',
    borderColor: '#555',
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
  },
  lightDropDownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
  },
  darkDropDownContainer: {
    backgroundColor: '#333',
    borderColor: '#555',
    width: Dimensions.get('window').width - 50,
    alignSelf: 'center',
  },
  lightDropdownText: {
    color: '#000',
  },
  darkDropdownText: {
    color: '#fff',
  },
  lightPlaceholder: {
    color: '#aaa',
  },
  darkPlaceholder: {
    color: '#888',
  },
  lightLabel: {
    color: '#000',
  },
  darkLabel: {
    color: '#fff',
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
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
  },
  selectedButton: {
    borderColor: 'green',
  },
  containerAllergens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  contentProducsDishes: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  inputDishProduct: {
    height: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  labelCernterd: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
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
  containerDarkTheme: {
    flexGrow: 1,
    backgroundColor: '#1B1D1E',
  },
  labelDarkTheme: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "white"
  },
  labelCernterdDarkTheme: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: "white"
  },
  inputDarkTheme: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    color: "white"
  },
  inputDishProductDarkTheme: {
    height: 20,
    color: "white"
  },
  modalViewDark: {
    backgroundColor: 'black'
  }
});

export default styles;
