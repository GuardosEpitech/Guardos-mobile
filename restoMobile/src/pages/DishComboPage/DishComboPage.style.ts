import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#333',
  },
  scrollViewContentContainer: {
    alignItems: 'center', // Center children horizontally
    justifyContent: 'flex-start', // Align children to the top
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center', // Center title text
  },
  titleDark: {
    color: '#fff', // White text in dark mode
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  labelDark: {
    color: '#ccc',
  },
  contentProducsDishes: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  labelCernterd: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  labelCernterdDarkTheme: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
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
  buttonDark: {
    borderColor: '#444',
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
    backgroundColor: '#333',
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#ddd',
  },
  selectedButtonDark: {
    backgroundColor: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%', // Ensure it stretches across the width
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1, // Make the button take up equal space
    marginRight: 8, // Add space between buttons
  },
  saveButtonDark: {
    backgroundColor: '#2E7D32',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonTextDark: {
    color: '#ddd',
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1, // Make the button take up equal space
    marginLeft: 8, // Add space between buttons
  },
  clearButtonDark: {
    backgroundColor: '#d32f2f',
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  clearButtonTextDark: {
    color: '#ddd',
  },
});

export default styles;
