import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    paddingBottom: 10,
    fontSize: 20,
  },
  profilePicture: {
    height: 100,
    width: 100,
    resizeMode: "contain"
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  restaurantSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  restaurantItem: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  logoutSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
  },
  logoutButton: {
    margin: 10,
    padding: 20,
    borderRadius: 4,
  },
  success: {
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: '#d32f2f',
    backgroundColor: '#ffcdd2',
    alignSelf: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  changePasswordButton: {
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  defaultProfilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultProfilePictureText: {
    fontSize: 16,
    color: 'gray',
  },
  deletePictureButton: {
    marginBottom: 15
  },
  dropDown: {
    marginBottom: 20,
  },
  deleteAccountSection: {
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 10,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  restoReference: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    paddingTop: 10,
  },
  restoReferenceDarkTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    paddingTop: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6d071a',
  },
  favoriteListContainer: {
    flexGrow: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0066FF',
    borderRadius: 5,
  },
  paginationButtonDisabled: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#9e9e9e",
    borderRadius: 5,
  },
  paginationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  containerDarkTheme: {
    flexGrow: 1,
    backgroundColor: '#1B1D1E',
    padding: 16,
  },
  profileSectionDarkTheme: {
    backgroundColor: '#1B1D1E',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  inputDarkTheme: {
    width: '100%',
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    color: 'white'
  },
  profileHeader: {
    color: 'black',
  },
  profileHeaderDarkTheme: {
    color: 'black',
  },
  ingredientButton: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  dropDownDarkTheme: {
    marginBottom: 20,
    backgroundColor: '#3B3B3B'
  },
  restaurantSectionDarkTheme: {
    backgroundColor: '#1B1D1E',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  tabButtonTexDarkTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutSectionDarkTheme: {
    backgroundColor: '#3B3B3B',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
  },
  headingDarkTheme: {
    textAlign: 'center',
    color: 'white',
    paddingBottom: 10,
    fontSize: 20,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    width: '80%'
  },
  popupAllergens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  allergenButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    justifyContent: 'center',
  },
  inputDishProduct: {
    height: 20,
  },
  inputDishProductDarkTheme: {
    height: 20,
    color: "white"
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
    textAlign: 'center'
  },
  labelCernterdDarkTheme: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: "white"
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
  labelDarkTheme: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "white"
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default styles;
